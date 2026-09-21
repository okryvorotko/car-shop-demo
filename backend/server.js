import "dotenv/config";
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import { resetCars, sampleCars, seedCars } from "./carsData.js";
import { openapiSpec } from "./openapiSpec.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/openapi.json", (req, res) => {
	res.json(openapiSpec);
});

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(openapiSpec, {
		explorer: true,
		customSiteTitle: "Car Shop API Docs",
	})
);

let db;

app.get("/ping", (req, res) => {
	res.json({ message: "pong" });
});

const BE_PORT = Number(process.env.BE_PORT || 4000);
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
	throw new Error("JWT_SECRET is required. Configure it through the environment or backend/.env.");
}

async function getTokenVersion() {
	const state = await db.get(
		"SELECT value FROM app_state WHERE key = ?",
		["token_version"]
	);

	return Number(state?.value || 0);
}

const auth = async (req, res, next) => {
	const header = req.headers.authorization;
	if (!header) return res.status(401).json({ error: "No token" });
	const token = header.split(" ")[1];
	try {
		const decoded = jwt.verify(token, SECRET);
		const tokenVersion = Number(decoded.tokenVersion ?? 0);
		const currentTokenVersion = await getTokenVersion();

		if (tokenVersion !== currentTokenVersion) {
			return res.status(401).json({ error: "Invalid token" });
		}

		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ error: "Invalid token" });
	}
};

// --- Register ---
app.post("/auth/register", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res.status(400).json({ error: "Missing fields" });
	const hashed = await bcrypt.hash(password, 10);
	try {
		const result = await db.run(
			"INSERT INTO users (username, password) VALUES (?, ?)",
			[username, hashed]
		);
		const tokenVersion = await getTokenVersion();
		const token = jwt.sign(
			{ id: result.lastID, username, tokenVersion },
			SECRET,
			{
				expiresIn: "1h",
			}
		);
		res.json({ token });
	} catch {
		res.status(400).json({ error: "User exists" });
	}
});

// --- Login ---
app.post("/auth/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await db.get("SELECT * FROM users WHERE username = ?", [
		username,
	]);
	if (!user) return res.status(400).json({ error: "Invalid credentials" });
	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return res.status(400).json({ error: "Invalid credentials" });
	const tokenVersion = await getTokenVersion();
	const token = jwt.sign(
		{ id: user.id, username: user.username, tokenVersion },
		SECRET,
		{
			expiresIn: "1h",
		}
	);
	res.json({ token });
});

// --- /me route ---
app.get("/me", auth, async (req, res) => {
	const user = await db.get("SELECT id, username FROM users WHERE id = ?", [
		req.user.id,
	]);
	res.json(user);
});

// --- Cars catalog ---
app.get("/cars", auth, async (req, res) => {
	const {
		model,
		minRange,
		maxRange,
		minPrice,
		maxPrice,
		range,
		price,
		sortBy,
		sortDirection,
	} = req.query;
	const filters = ["available = 1"];
	const params = [];
	const sortableColumns = {
		year: "year",
		price: "price",
		range: "range_miles",
	};
	const orderColumn = sortableColumns[sortBy] || sortableColumns.price;
	const orderDirection =
		String(sortDirection).toLowerCase() === "desc" ? "DESC" : "ASC";

	if (model) {
		filters.push("LOWER(model) LIKE ?");
		params.push(`%${String(model).toLowerCase()}%`);
	}

	if (minRange) {
		filters.push("range_miles >= ?");
		params.push(Number(minRange));
	}

	if (maxRange || range) {
		filters.push("range_miles <= ?");
		params.push(Number(maxRange || range));
	}

	if (minPrice) {
		filters.push("price >= ?");
		params.push(Number(minPrice));
	}

	if (maxPrice || price) {
		filters.push("price <= ?");
		params.push(Number(maxPrice || price));
	}

	const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
	const cars = await db.all(
		`
			SELECT
				id,
				model,
				make,
				year,
				range_miles AS rangeMiles,
				price,
				image_url AS imageUrl,
				available
			FROM cars
			${where}
			ORDER BY ${orderColumn} ${orderDirection}, id ASC
		`,
		params
	);

	res.json(cars);
});

app.get("/cars/:id", auth, async (req, res) => {
	const carId = Number(req.params.id);

	if (!Number.isInteger(carId) || carId < 1) {
		return res.status(400).json({ error: "Invalid car id" });
	}

	const car = await db.get(
		`
			SELECT
				id,
				model,
				make,
				year,
				range_miles AS rangeMiles,
				price,
				image_url AS imageUrl,
				available
			FROM cars
			WHERE id = ?
		`,
		[carId]
	);

	if (!car) {
		return res.status(404).json({ error: "Car not found" });
	}

	res.json(car);
});

app.get("/cart", auth, async (req, res) => {
	const cars = await db.all(
		`
			SELECT
				c.id,
				c.model,
				c.make,
				c.year,
				c.range_miles AS rangeMiles,
				c.price,
				c.image_url AS imageUrl,
				c.available
			FROM cart_items ci
			JOIN cars c ON c.id = ci.car_id
			WHERE ci.user_id = ? AND c.available = 1
			ORDER BY ci.created_at DESC
		`,
		[req.user.id]
	);

	res.json(cars);
});

app.get("/cart/count", auth, async (req, res) => {
	const result = await db.get(
		`
			SELECT COUNT(*) AS count
			FROM cart_items ci
			JOIN cars c ON c.id = ci.car_id
			WHERE ci.user_id = ? AND c.available = 1
		`,
		[req.user.id]
	);

	res.json({ count: result.count });
});

app.post("/cart/add/:id", auth, async (req, res) => {
	const carId = Number(req.params.id);

	if (!Number.isInteger(carId) || carId < 1) {
		return res.status(400).json({ error: "Invalid car id" });
	}

	const car = await db.get("SELECT id, available FROM cars WHERE id = ?", [carId]);

	if (!car) {
		return res.status(404).json({ error: "Car not found" });
	}

	if (!car.available) {
		return res.status(409).json({ error: "Car is no longer available" });
	}

	await db.run(
		"INSERT OR IGNORE INTO cart_items (user_id, car_id) VALUES (?, ?)",
		[req.user.id, carId]
	);

	const count = await db.get(
		`
			SELECT COUNT(*) AS count
			FROM cart_items ci
			JOIN cars c ON c.id = ci.car_id
			WHERE ci.user_id = ? AND c.available = 1
		`,
		[req.user.id]
	);

	res.json({ ok: true, count: count.count });
});

app.post("/order", auth, async (req, res) => {
	const cartCars = await db.all(
		`
			SELECT c.id, c.price
			FROM cart_items ci
			JOIN cars c ON c.id = ci.car_id
			WHERE ci.user_id = ? AND c.available = 1
		`,
		[req.user.id]
	);

	if (cartCars.length === 0) {
		return res.status(400).json({ error: "Cart is empty" });
	}

	const total = cartCars.reduce((sum, car) => sum + car.price, 0);

	await db.exec("BEGIN TRANSACTION");
	try {
		const order = await db.run(
			"INSERT INTO orders (user_id, total) VALUES (?, ?)",
			[req.user.id, total]
		);

		for (const car of cartCars) {
			const update = await db.run(
				"UPDATE cars SET available = 0 WHERE id = ? AND available = 1",
				[car.id]
			);

			if (update.changes === 0) {
				throw new Error("Car is no longer available");
			}

			await db.run(
				"INSERT INTO order_items (order_id, car_id, price) VALUES (?, ?, ?)",
				[order.lastID, car.id, car.price]
			);
		}

		await db.run("DELETE FROM cart_items WHERE user_id = ?", [req.user.id]);
		await db.exec("COMMIT");

		res.json({
			orderId: order.lastID,
			total,
			itemCount: cartCars.length,
		});
	} catch (err) {
		await db.exec("ROLLBACK");
		res.status(409).json({ error: err.message });
	}
});

app.post("/admin/reset", async (req, res) => {
	await db.exec("BEGIN TRANSACTION");
	try {
		await db.run("DELETE FROM order_items");
		await db.run("DELETE FROM orders");
		await db.run("DELETE FROM cart_items");
		await db.run("DELETE FROM users");
		await db.run(
			"DELETE FROM sqlite_sequence WHERE name IN (?, ?, ?, ?, ?)",
			["users", "cart_items", "orders", "order_items", "cars"]
		);
		await resetCars(db);
		await db.run(
			`
				UPDATE app_state
				SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT)
				WHERE key = ?
			`,
			["token_version"]
		);
		await db.exec("COMMIT");

		res.json({
			ok: true,
			usersDeleted: true,
			tokensInvalidated: true,
			carsRestored: sampleCars.length,
		});
	} catch (err) {
		await db.exec("ROLLBACK");
		res.status(500).json({ error: err.message });
	}
});

async function startServer() {
	db = await open({ filename: "./db.sqlite", driver: sqlite3.Database });

	// --- Initialize users table ---
	await db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE,
			password TEXT
		)
	`);

	await seedCars(db);

	await db.exec(`
		CREATE TABLE IF NOT EXISTS app_state (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS cart_items (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			car_id INTEGER NOT NULL,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, car_id),
			FOREIGN KEY(user_id) REFERENCES users(id),
			FOREIGN KEY(car_id) REFERENCES cars(id)
		);

		CREATE TABLE IF NOT EXISTS orders (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			total INTEGER NOT NULL,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY(user_id) REFERENCES users(id)
		);

		CREATE TABLE IF NOT EXISTS order_items (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			order_id INTEGER NOT NULL,
			car_id INTEGER NOT NULL,
			price INTEGER NOT NULL,
			FOREIGN KEY(order_id) REFERENCES orders(id),
			FOREIGN KEY(car_id) REFERENCES cars(id)
		);
	`);

	await db.run(
		"INSERT OR IGNORE INTO app_state (key, value) VALUES (?, ?)",
		["token_version", "0"]
	);

	app.listen(BE_PORT, () => console.log(`🚗 Backend running on port ${BE_PORT}`));
}

startServer();
