import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCars } from "../api";
import AccountMenu from "../components/AccountMenu";
import CartLink from "../components/CartLink";
import { useDistanceUnits } from "../useDistanceUnits";

const initialFilters = {
	model: "",
	minRange: "",
	maxRange: "",
	minPrice: "",
	maxPrice: "",
	sortBy: "price",
	sortDirection: "asc",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

function getCatalogBounds(cars) {
	if (!cars.length) {
		return null;
	}

	return cars.reduce(
		(bounds, car) => ({
			minRange: Math.min(bounds.minRange, car.rangeMiles),
			maxRange: Math.max(bounds.maxRange, car.rangeMiles),
			minPrice: Math.min(bounds.minPrice, car.price),
			maxPrice: Math.max(bounds.maxPrice, car.price),
		}),
		{
			minRange: cars[0].rangeMiles,
			maxRange: cars[0].rangeMiles,
			minPrice: cars[0].price,
			maxPrice: cars[0].price,
		}
	);
}

function DoubleSliderFilter({
	id,
	label,
	minName,
	maxName,
	min,
	max,
	minValue,
	maxValue,
	formatValue,
	onChange,
}) {
	const range = max - min;
	const startPercent = range > 0 ? ((minValue - min) / range) * 100 : 0;
	const endPercent = range > 0 ? ((maxValue - min) / range) * 100 : 100;

	return (
		<div
			id={`${id}-filter`}
			data-testid={`${id}-filter`}
			className="double-slider-field"
			style={{
				"--slider-start": `${startPercent}%`,
				"--slider-end": `${endPercent}%`,
			}}
		>
			<div className="double-slider-summary">
				<span id={`${id}-filter-label`} data-testid={`${id}-filter-label`}>
					{label}
				</span>
				<strong id={`${id}-filter-value`} data-testid={`${id}-filter-value`}>
					{formatValue(minValue)} - {formatValue(maxValue)}
				</strong>
			</div>
			<div className="double-slider-control">
				<div className="double-slider-track" aria-hidden="true" />
				<input
					id={`${id}-min-filter-input`}
					data-testid={`${id}-min-filter-input`}
					className="double-slider-input double-slider-input-min"
					name={minName}
					type="range"
					min={min}
					max={max}
					value={minValue}
					aria-label={`${label} minimum`}
					onInput={(e) => onChange(minName, e.target.value)}
					onChange={(e) => onChange(minName, e.target.value)}
				/>
				<input
					id={`${id}-max-filter-input`}
					data-testid={`${id}-max-filter-input`}
					className="double-slider-input double-slider-input-max"
					name={maxName}
					type="range"
					min={min}
					max={max}
					value={maxValue}
					aria-label={`${label} maximum`}
					onInput={(e) => onChange(maxName, e.target.value)}
					onChange={(e) => onChange(maxName, e.target.value)}
				/>
			</div>
			<div className="double-slider-limits" aria-hidden="true">
				<span>{formatValue(min)}</span>
				<span>{formatValue(max)}</span>
			</div>
		</div>
	);
}

export default function Cars({ user, setUser, cartCount }) {
	const { formatDistance } = useDistanceUnits();
	const [filters, setFilters] = useState(initialFilters);
	const [cars, setCars] = useState([]);
	const [catalogBounds, setCatalogBounds] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const requestIdRef = useRef(0);

	const loadCars = useCallback(async (nextFilters, updateBounds = false) => {
		const requestId = requestIdRef.current + 1;
		requestIdRef.current = requestId;
		setLoading(true);
		setError("");

		try {
			const token = localStorage.getItem("token");
			const data = await fetchCars(token, nextFilters);

			if (requestId !== requestIdRef.current) {
				return;
			}

			setCars(data);

			if (updateBounds) {
				setCatalogBounds(getCatalogBounds(data));
			}
		} catch (err) {
			if (requestId === requestIdRef.current) {
				setError(err.message);
			}
		} finally {
			if (requestId === requestIdRef.current) {
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		loadCars(initialFilters, true);
	}, [loadCars]);

	useEffect(() => {
		if (!catalogBounds) {
			return;
		}

		loadCars(filters);
	}, [catalogBounds, filters, loadCars]);

	const sliderValues = useMemo(() => {
		if (!catalogBounds) {
			return null;
		}

		return {
			minRange:
				filters.minRange === "" ? catalogBounds.minRange : Number(filters.minRange),
			maxRange:
				filters.maxRange === "" ? catalogBounds.maxRange : Number(filters.maxRange),
			minPrice:
				filters.minPrice === "" ? catalogBounds.minPrice : Number(filters.minPrice),
			maxPrice:
				filters.maxPrice === "" ? catalogBounds.maxPrice : Number(filters.maxPrice),
		};
	}, [catalogBounds, filters]);

	function handleChange(e) {
		setFilters((current) => ({
			...current,
			[e.target.name]: e.target.value,
		}));
	}

	function handleSliderChange(name, value) {
		if (!catalogBounds || !sliderValues) {
			return;
		}

		const numericValue = Number(value);

		setFilters((current) => {
			if (name === "minRange") {
				return {
					...current,
					minRange: String(Math.min(numericValue, sliderValues.maxRange)),
				};
			}

			if (name === "maxRange") {
				return {
					...current,
					maxRange: String(Math.max(numericValue, sliderValues.minRange)),
				};
			}

			if (name === "minPrice") {
				return {
					...current,
					minPrice: String(Math.min(numericValue, sliderValues.maxPrice)),
				};
			}

			return {
				...current,
				maxPrice: String(Math.max(numericValue, sliderValues.minPrice)),
			};
		});
	}

	function handleReset() {
		setFilters(initialFilters);
	}

	return (
		<main id="cars-page" data-testid="cars-page" className="cars-page">
			<header id="cars-page-header" data-testid="cars-page-header" className="cars-header">
				<div id="cars-header-copy" data-testid="cars-header-copy">
					<h1 id="cars-title" data-testid="cars-title">
						Cars Catalog
					</h1>
				</div>
				<div id="cars-header-actions" data-testid="cars-header-actions" className="header-actions">
					<p id="cars-count" data-testid="cars-count" className="cars-count">
						{cars.length} results
					</p>
					<CartLink count={cartCount} />
					<AccountMenu user={user} setUser={setUser} />
				</div>
			</header>

			<form
				id="cars-filter-form"
				data-testid="cars-filter-form"
				className="cars-filter-form"
				onSubmit={(e) => e.preventDefault()}
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

				<label id="sort-by-label" data-testid="sort-by-label">
					Sort by
					<select
						id="sort-by-select"
						data-testid="sort-by-select"
						name="sortBy"
						value={filters.sortBy}
						onChange={handleChange}
					>
						<option value="price">Price</option>
						<option value="year">Year</option>
						<option value="range">Range</option>
					</select>
				</label>

				<label id="sort-direction-label" data-testid="sort-direction-label">
					Direction
					<select
						id="sort-direction-select"
						data-testid="sort-direction-select"
						name="sortDirection"
						value={filters.sortDirection}
						onChange={handleChange}
					>
						<option value="asc">Low to high</option>
						<option value="desc">High to low</option>
					</select>
				</label>

				{catalogBounds && sliderValues && (
					<>
						<DoubleSliderFilter
							id="range"
							label="Range"
							minName="minRange"
							maxName="maxRange"
							min={catalogBounds.minRange}
							max={catalogBounds.maxRange}
							minValue={sliderValues.minRange}
							maxValue={sliderValues.maxRange}
							formatValue={formatDistance}
							onChange={handleSliderChange}
						/>

						<DoubleSliderFilter
							id="price"
							label="Price"
							minName="minPrice"
							maxName="maxPrice"
							min={catalogBounds.minPrice}
							max={catalogBounds.maxPrice}
							minValue={sliderValues.minPrice}
							maxValue={sliderValues.maxPrice}
							formatValue={(value) => currencyFormatter.format(value)}
							onChange={handleSliderChange}
						/>
					</>
				)}

				<div id="cars-filter-actions" data-testid="cars-filter-actions" className="filter-actions">
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
										{formatDistance(car.rangeMiles)} range
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
