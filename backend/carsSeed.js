import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { seedCars, sampleCars } from "./carsData.js";

const db = await open({ filename: "./db.sqlite", driver: sqlite3.Database });

await seedCars(db);
await db.close();

console.log(`Seeded ${sampleCars.length} cars.`);
