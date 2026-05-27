import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCars } from "../api";

const initialFilters = {
	model: "",
	minRange: "",
	maxRange: "",
	minPrice: "",
	maxPrice: "",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export default function Cars({ user }) {
	const [filters, setFilters] = useState(initialFilters);
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadCars = useCallback(async (nextFilters) => {
		setLoading(true);
		setError("");

		try {
			const token = localStorage.getItem("token");
			const data = await fetchCars(token, nextFilters);
			setCars(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadCars(initialFilters);
	}, [loadCars]);

	function handleChange(e) {
		setFilters((current) => ({
			...current,
			[e.target.name]: e.target.value,
		}));
	}

	function handleSubmit(e) {
		e.preventDefault();
		loadCars(filters);
	}

	function handleReset() {
		setFilters(initialFilters);
		loadCars(initialFilters);
	}

	return (
		<main id="cars-page" data-testid="cars-page" className="cars-page">
			<header id="cars-page-header" data-testid="cars-page-header" className="cars-header">
				<div id="cars-header-copy" data-testid="cars-header-copy">
					<p id="cars-eyebrow" data-testid="cars-eyebrow">
						Signed in as {user.username}
					</p>
					<h1 id="cars-title" data-testid="cars-title">
						Cars Catalog
					</h1>
				</div>
				<p id="cars-count" data-testid="cars-count" className="cars-count">
					{cars.length} results
				</p>
			</header>

			<form
				id="cars-filter-form"
				data-testid="cars-filter-form"
				className="cars-filter-form"
				onSubmit={handleSubmit}
			>
				<label id="model-filter-label" data-testid="model-filter-label">
					Model
					<input
						id="model-filter-input"
						data-testid="model-filter-input"
						name="model"
						placeholder="Model name"
						value={filters.model}
						onChange={handleChange}
					/>
				</label>

				<label id="min-range-filter-label" data-testid="min-range-filter-label">
					Min range
					<input
						id="min-range-filter-input"
						data-testid="min-range-filter-input"
						name="minRange"
						type="number"
						min="0"
						placeholder="Miles"
						value={filters.minRange}
						onChange={handleChange}
					/>
				</label>

				<label id="max-range-filter-label" data-testid="max-range-filter-label">
					Max range
					<input
						id="max-range-filter-input"
						data-testid="max-range-filter-input"
						name="maxRange"
						type="number"
						min="0"
						placeholder="Miles"
						value={filters.maxRange}
						onChange={handleChange}
					/>
				</label>

				<label id="min-price-filter-label" data-testid="min-price-filter-label">
					Min price
					<input
						id="min-price-filter-input"
						data-testid="min-price-filter-input"
						name="minPrice"
						type="number"
						min="0"
						placeholder="USD"
						value={filters.minPrice}
						onChange={handleChange}
					/>
				</label>

				<label id="max-price-filter-label" data-testid="max-price-filter-label">
					Max price
					<input
						id="max-price-filter-input"
						data-testid="max-price-filter-input"
						name="maxPrice"
						type="number"
						min="0"
						placeholder="USD"
						value={filters.maxPrice}
						onChange={handleChange}
					/>
				</label>

				<div id="cars-filter-actions" data-testid="cars-filter-actions" className="filter-actions">
					<button id="cars-filter-submit" data-testid="cars-filter-submit" type="submit">
						Apply
					</button>
					<button
						id="cars-filter-reset"
						data-testid="cars-filter-reset"
						type="button"
						onClick={handleReset}
					>
						Reset
					</button>
				</div>
			</form>

			{loading && (
				<p id="cars-loading" data-testid="cars-loading" className="cars-status">
					Loading cars...
				</p>
			)}

			{error && (
				<p id="cars-error" data-testid="cars-error" className="cars-status error">
					{error}
				</p>
			)}

			{!loading && !error && cars.length === 0 && (
				<p id="cars-empty" data-testid="cars-empty" className="cars-status">
					No cars match those filters.
				</p>
			)}

			<section id="cars-results-grid" data-testid="cars-results-grid" className="cars-grid">
				{cars.map((car) => (
					<article
						id={`car-card-${car.id}`}
						data-testid={`car-card-${car.id}`}
						className="car-card"
						key={car.id}
					>
						<Link
							id={`car-card-link-${car.id}`}
							data-testid={`car-card-link-${car.id}`}
							className="car-card-link"
							to={`/cars/${car.id}`}
							aria-label={`View details for ${car.year} ${car.model}`}
						>
							<img
								id={`car-image-${car.id}`}
								data-testid={`car-image-${car.id}`}
								src={car.imageUrl}
								alt={`${car.year} ${car.model}`}
							/>
							<div
								id={`car-details-${car.id}`}
								data-testid={`car-details-${car.id}`}
								className="car-details"
							>
								<p id={`car-make-${car.id}`} data-testid={`car-make-${car.id}`}>
									{car.make}
								</p>
								<h2 id={`car-model-${car.id}`} data-testid={`car-model-${car.id}`}>
									{car.year} {car.model}
								</h2>
								<div
									id={`car-specs-${car.id}`}
									data-testid={`car-specs-${car.id}`}
									className="car-specs"
								>
									<span id={`car-range-${car.id}`} data-testid={`car-range-${car.id}`}>
										{car.rangeMiles} mi range
									</span>
									<span id={`car-price-${car.id}`} data-testid={`car-price-${car.id}`}>
										{currencyFormatter.format(car.price)}
									</span>
								</div>
							</div>
						</Link>
					</article>
				))}
			</section>
		</main>
	);
}
