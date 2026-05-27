import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCar } from "../api";
import AccountMenu from "../components/AccountMenu";

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export default function CarDetails({ user, setUser }) {
	const { id } = useParams();
	const [car, setCar] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;

		async function loadCar() {
			setLoading(true);
			setError("");

			try {
				const token = localStorage.getItem("token");
				const data = await fetchCar(token, id);

				if (active) {
					setCar(data);
				}
			} catch (err) {
				if (active) {
					setCar(null);
					setError(err.message);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		loadCar();

		return () => {
			active = false;
		};
	}, [id]);

	return (
		<main id="car-details-page" data-testid="car-details-page" className="car-details-page">
			<header
				id="car-details-header"
				data-testid="car-details-header"
				className="car-details-header"
			>
				<div id="car-details-header-copy" data-testid="car-details-header-copy">
					<h1 id="car-details-title" data-testid="car-details-title">
						Car Details
					</h1>
				</div>
				<div id="car-details-header-actions" data-testid="car-details-header-actions" className="header-actions">
					<Link id="car-details-back-link" data-testid="car-details-back-link" to="/cars">
						Back to cars
					</Link>
					<AccountMenu user={user} setUser={setUser} />
				</div>
			</header>

			{loading && (
				<p id="car-details-loading" data-testid="car-details-loading" className="cars-status">
					Loading car...
				</p>
			)}

			{error && (
				<p id="car-details-error" data-testid="car-details-error" className="cars-status error">
					{error}
				</p>
			)}

			{!loading && !error && car && (
				<section
					id={`car-details-content-${car.id}`}
					data-testid={`car-details-content-${car.id}`}
					className="car-details-content"
				>
					<img
						id={`car-details-image-${car.id}`}
						data-testid={`car-details-image-${car.id}`}
						className="car-details-image"
						src={car.imageUrl}
						alt={`${car.year} ${car.model}`}
					/>

					<div
						id={`car-details-info-${car.id}`}
						data-testid={`car-details-info-${car.id}`}
						className="car-details-info"
					>
						<p id={`car-details-make-${car.id}`} data-testid={`car-details-make-${car.id}`}>
							{car.make}
						</p>
						<h2 id={`car-details-model-${car.id}`} data-testid={`car-details-model-${car.id}`}>
							{car.year} {car.model}
						</h2>

						<div
							id={`car-details-specs-${car.id}`}
							data-testid={`car-details-specs-${car.id}`}
							className="car-details-specs"
						>
							<div
								id={`car-details-year-spec-${car.id}`}
								data-testid={`car-details-year-spec-${car.id}`}
							>
								<span
									id={`car-details-year-label-${car.id}`}
									data-testid={`car-details-year-label-${car.id}`}
								>
									Year
								</span>
								<strong
									id={`car-details-year-value-${car.id}`}
									data-testid={`car-details-year-value-${car.id}`}
								>
									{car.year}
								</strong>
							</div>
							<div
								id={`car-details-range-spec-${car.id}`}
								data-testid={`car-details-range-spec-${car.id}`}
							>
								<span
									id={`car-details-range-label-${car.id}`}
									data-testid={`car-details-range-label-${car.id}`}
								>
									Range
								</span>
								<strong
									id={`car-details-range-value-${car.id}`}
									data-testid={`car-details-range-value-${car.id}`}
								>
									{car.rangeMiles} miles
								</strong>
							</div>
							<div
								id={`car-details-price-spec-${car.id}`}
								data-testid={`car-details-price-spec-${car.id}`}
							>
								<span
									id={`car-details-price-label-${car.id}`}
									data-testid={`car-details-price-label-${car.id}`}
								>
									Price
								</span>
								<strong
									id={`car-details-price-value-${car.id}`}
									data-testid={`car-details-price-value-${car.id}`}
								>
									{currencyFormatter.format(car.price)}
								</strong>
							</div>
						</div>

						<button
							id={`car-details-add-to-cart-${car.id}`}
							data-testid={`car-details-add-to-cart-${car.id}`}
							type="button"
							className="car-details-add-to-cart"
						>
							Add to Cart
						</button>
					</div>
				</section>
			)}
		</main>
	);
}
