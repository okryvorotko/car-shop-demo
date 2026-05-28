export const sampleCars = [
	{
		model: "Tesla Model 3",
		make: "Tesla",
		year: 2023,
		rangeMiles: 358,
		price: 38990,
		imageUrl: "/cars/photos/2023-tesla-model-3.jpg",
	},
	{
		model: "Ford Mustang Mach-E",
		make: "Ford",
		year: 2024,
		rangeMiles: 312,
		price: 42995,
		imageUrl: "/cars/photos/2024-ford-mustang-mach-e.jpg",
	},
	{
		model: "Hyundai Ioniq 5",
		make: "Hyundai",
		year: 2024,
		rangeMiles: 303,
		price: 41450,
		imageUrl: "/cars/photos/2024-hyundai-ioniq-5.jpg",
	},
	{
		model: "Chevrolet Bolt EV",
		make: "Chevrolet",
		year: 2023,
		rangeMiles: 259,
		price: 26995,
		imageUrl: "/cars/photos/2023-chevrolet-bolt-ev.jpg",
	},
	{
		model: "Kia EV6",
		make: "Kia",
		year: 2024,
		rangeMiles: 310,
		price: 48900,
		imageUrl: "/cars/photos/2024-kia-ev6.jpg",
	},
	{
		model: "Nissan Leaf",
		make: "Nissan",
		year: 2024,
		rangeMiles: 212,
		price: 28140,
		imageUrl: "/cars/photos/2024-nissan-leaf.jpg",
	},
	{
		model: "Tesla Model Y",
		make: "Tesla",
		year: 2025,
		rangeMiles: 337,
		price: 44990,
		imageUrl: "/cars/photos/2025-tesla-model-y.jpg",
	},
	{
		model: "Tesla Model S",
		make: "Tesla",
		year: 2025,
		rangeMiles: 410,
		price: 79990,
		imageUrl: "/cars/photos/2025-tesla-model-s.jpg",
	},
	{
		model: "Tesla Model X",
		make: "Tesla",
		year: 2025,
		rangeMiles: 329,
		price: 84990,
		imageUrl: "/cars/photos/2025-tesla-model-x.jpg",
	},
	{
		model: "Tesla Cybertruck",
		make: "Tesla",
		year: 2025,
		rangeMiles: 335,
		price: 69990,
		imageUrl: "/cars/photos/2025-tesla-cybertruck.jpg",
	},
	{
		model: "Chevrolet Equinox EV",
		make: "Chevrolet",
		year: 2025,
		rangeMiles: 319,
		price: 33600,
		imageUrl: "/cars/photos/2025-chevrolet-equinox-ev.jpg",
	},
	{
		model: "Chevrolet Blazer EV",
		make: "Chevrolet",
		year: 2025,
		rangeMiles: 334,
		price: 44600,
		imageUrl: "/cars/photos/2025-chevrolet-blazer-ev.jpg",
	},
	{
		model: "Ford F-150 Lightning",
		make: "Ford",
		year: 2025,
		rangeMiles: 320,
		price: 49975,
		imageUrl: "/cars/photos/2025-ford-f-150-lightning.jpg",
	},
	{
		model: "Honda Prologue",
		make: "Honda",
		year: 2025,
		rangeMiles: 308,
		price: 47400,
		imageUrl: "/cars/photos/2025-honda-prologue.jpg",
	},
	{
		model: "Kia EV9",
		make: "Kia",
		year: 2025,
		rangeMiles: 304,
		price: 54900,
		imageUrl: "/cars/photos/2025-kia-ev9.jpg",
	},
	{
		model: "Hyundai Ioniq 6",
		make: "Hyundai",
		year: 2025,
		rangeMiles: 342,
		price: 37850,
		imageUrl: "/cars/photos/2025-hyundai-ioniq-6.jpg",
	},
	{
		model: "Nissan Ariya",
		make: "Nissan",
		year: 2025,
		rangeMiles: 289,
		price: 39770,
		imageUrl: "/cars/photos/2025-nissan-ariya.jpg",
	},
	{
		model: "Cadillac Lyriq",
		make: "Cadillac",
		year: 2025,
		rangeMiles: 326,
		price: 58595,
		imageUrl: "/cars/photos/2025-cadillac-lyriq.jpg",
	},
	{
		model: "Volkswagen ID.4",
		make: "Volkswagen",
		year: 2025,
		rangeMiles: 291,
		price: 39995,
		imageUrl: "/cars/photos/2025-volkswagen-id-4.jpg",
	},
	{
		model: "Toyota bZ4X",
		make: "Toyota",
		year: 2025,
		rangeMiles: 252,
		price: 37070,
		imageUrl: "/cars/photos/2025-toyota-bz4x.jpg",
	},
	{
		model: "Subaru Solterra",
		make: "Subaru",
		year: 2025,
		rangeMiles: 227,
		price: 38495,
		imageUrl: "/cars/photos/2025-subaru-solterra.jpg",
	},
	{
		model: "Lexus RZ",
		make: "Lexus",
		year: 2025,
		rangeMiles: 266,
		price: 42800,
		imageUrl: "/cars/photos/2025-lexus-rz.jpg",
	},
	{
		model: "Genesis GV60",
		make: "Genesis",
		year: 2025,
		rangeMiles: 294,
		price: 52350,
		imageUrl: "/cars/photos/2025-genesis-gv60.jpg",
	},
	{
		model: "Polestar 3",
		make: "Polestar",
		year: 2025,
		rangeMiles: 350,
		price: 67500,
		imageUrl: "/cars/photos/2025-polestar-3.jpg",
	},
	{
		model: "Rivian R1S",
		make: "Rivian",
		year: 2025,
		rangeMiles: 300,
		price: 75900,
		imageUrl: "/cars/photos/2025-rivian-r1s.jpg",
	},
	{
		model: "Lucid Air",
		make: "Lucid",
		year: 2025,
		rangeMiles: 420,
		price: 69900,
		imageUrl: "/cars/photos/2025-lucid-air.jpg",
	},
];

export async function createCarsTable(db) {
	await db.exec(`
		CREATE TABLE IF NOT EXISTS cars (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			model TEXT NOT NULL UNIQUE,
			make TEXT NOT NULL,
			year INTEGER NOT NULL,
			range_miles INTEGER NOT NULL,
			price INTEGER NOT NULL,
			image_url TEXT NOT NULL,
			available INTEGER NOT NULL DEFAULT 1
		)
	`);

	const columns = await db.all("PRAGMA table_info(cars)");
	const hasAvailable = columns.some((column) => column.name === "available");

	if (!hasAvailable) {
		await db.exec("ALTER TABLE cars ADD COLUMN available INTEGER NOT NULL DEFAULT 1");
	}
}

export async function seedCars(db) {
	await createCarsTable(db);

	for (const car of sampleCars) {
		await db.run(
			`
				INSERT INTO cars
					(model, make, year, range_miles, price, image_url)
				VALUES (?, ?, ?, ?, ?, ?)
				ON CONFLICT(model) DO UPDATE SET
					make = excluded.make,
					year = excluded.year,
					range_miles = excluded.range_miles,
					price = excluded.price,
					image_url = excluded.image_url
			`,
			[
				car.model,
				car.make,
				car.year,
				car.rangeMiles,
				car.price,
				car.imageUrl,
			]
		);
	}
}

export async function resetCars(db) {
	await createCarsTable(db);
	await db.run("DELETE FROM cars");
	await db.run("DELETE FROM sqlite_sequence WHERE name = ?", ["cars"]);

	for (const car of sampleCars) {
		await db.run(
			`
				INSERT INTO cars
					(model, make, year, range_miles, price, image_url, available)
				VALUES (?, ?, ?, ?, ?, ?, 1)
			`,
			[
				car.model,
				car.make,
				car.year,
				car.rangeMiles,
				car.price,
				car.imageUrl,
			]
		);
	}
}
