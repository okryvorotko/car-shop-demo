import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { seedCars } from "./carsData.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;

app.get("/ping", (req, res) => {
	res.json({ message: "pong" });
});

const BE_PORT = process.env.BE_PORT;
const SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
	const header = req.headers.authorization;
	if (!header) return res.status(401).json({ error: "No token" });
	const token = header.split(" ")[1];
	try {
		const decoded = jwt.verify(token, SECRET);
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
		res.json({ id: result.lastID, username });
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
	const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
		expiresIn: "1h",
	});
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
	const { model, minRange, maxRange, minPrice, maxPrice, range, price } =
		req.query;
	const filters = [];
	const params = [];

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
				image_url AS imageUrl
			FROM cars
			${where}
			ORDER BY price ASC
		`,
		params
	);

	res.json(cars);
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

	app.listen(BE_PORT, () => console.log(`🚗 Backend running on port ${BE_PORT}`));
}

startServer();
