export const sampleCars = [
	{
		model: "Tesla Model 3",
		make: "Tesla",
		year: 2023,
		rangeMiles: 358,
		price: 38990,
		imageUrl:
			"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
	},
	{
		model: "Ford Mustang Mach-E",
		make: "Ford",
		year: 2024,
		rangeMiles: 312,
		price: 42995,
		imageUrl:
			"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80",
	},
	{
		model: "Hyundai Ioniq 5",
		make: "Hyundai",
		year: 2024,
		rangeMiles: 303,
		price: 41450,
		imageUrl:
			"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
	},
	{
		model: "Chevrolet Bolt EV",
		make: "Chevrolet",
		year: 2023,
		rangeMiles: 259,
		price: 26995,
		imageUrl:
			"https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80",
	},
	{
		model: "Kia EV6",
		make: "Kia",
		year: 2024,
		rangeMiles: 310,
		price: 48900,
		imageUrl:
			"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80",
	},
	{
		model: "Nissan Leaf",
		make: "Nissan",
		year: 2024,
		rangeMiles: 212,
		price: 28140,
		imageUrl:
			"https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=900&q=80",
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
			image_url TEXT NOT NULL
		)
	`);
}

export async function seedCars(db) {
	await createCarsTable(db);

	for (const car of sampleCars) {
		await db.run(
			`
				INSERT OR IGNORE INTO cars
					(model, make, year, range_miles, price, image_url)
				VALUES (?, ?, ?, ?, ?, ?)
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
