import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder, fetchCart } from "../api";
import AccountMenu from "../components/AccountMenu";
import CartLink from "../components/CartLink";
import { useDistanceUnits } from "../useDistanceUnits";

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export default function Cart({ user, setUser, cartCount, refreshCartCount }) {
	const navigate = useNavigate();
	const { formatDistance } = useDistanceUnits();
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [buying, setBuying] = useState(false);
	const [error, setError] = useState("");

	const total = useMemo(
		() => cars.reduce((sum, car) => sum + car.price, 0),
		[cars]
	);

	useEffect(() => {
		let active = true;

		async function loadCart() {
			setLoading(true);
			setError("");

			try {
				const token = localStorage.getItem("token");
				const data = await fetchCart(token);

				if (active) {
					setCars(data);
				}
			} catch (err) {
				if (active) {
					setError(err.message);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		loadCart();

		return () => {
			active = false;
		};
	}, []);

	async function handleBuy() {
		setBuying(true);
		setError("");

		try {
			const token = localStorage.getItem("token");
			const order = await createOrder(token);
			await refreshCartCount();
			navigate("/order", { state: order });
		} catch (err) {
			setError(err.message);
		} finally {
			setBuying(false);
		}
	}

	return (
		<main id="cart-page" data-testid="cart-page" className="cart-page">
			<header id="cart-header" data-testid="cart-header" className="cars-header">
				<div id="cart-header-copy" data-testid="cart-header-copy">
					<h1 id="cart-title" data-testid="cart-title">
						Cart
					</h1>
				</div>
				<div id="cart-header-actions" data-testid="cart-header-actions" className="header-actions">
					<Link id="cart-back-link" data-testid="cart-back-link" className="account-back-link" to="/cars">
						Back to cars
					</Link>
					<CartLink count={cartCount} />
					<AccountMenu user={user} setUser={setUser} />
				</div>
			</header>

			{loading && (
				<p id="cart-loading" data-testid="cart-loading" className="cars-status">
					Loading cart...
				</p>
			)}

			{error && (
				<p id="cart-error" data-testid="cart-error" className="cars-status error">
					{error}
				</p>
			)}

			{!loading && !error && cars.length === 0 && (
				<p id="cart-empty" data-testid="cart-empty" className="cars-status">
					Your cart is empty.
				</p>
			)}

			{cars.length > 0 && (
				<>
					<section id="cart-items-grid" data-testid="cart-items-grid" className="cars-grid">
						{cars.map((car) => (
							<article
								id={`cart-item-${car.id}`}
								data-testid={`cart-item-${car.id}`}
								className="car-card"
								key={car.id}
							>
								<Link
									id={`cart-item-link-${car.id}`}
									data-testid={`cart-item-link-${car.id}`}
									className="car-card-link"
									to={`/cars/${car.id}`}
									aria-label={`View details for ${car.year} ${car.model}`}
								>
									<img
										id={`cart-item-image-${car.id}`}
										data-testid={`cart-item-image-${car.id}`}
										src={car.imageUrl}
										alt={`${car.year} ${car.model}`}
									/>
									<div className="car-details">
										<p>{car.make}</p>
										<h2>
											{car.year} {car.model}
										</h2>
										<div className="car-specs">
											<span>{formatDistance(car.rangeMiles)} range</span>
											<span>{currencyFormatter.format(car.price)}</span>
										</div>
									</div>
								</Link>
							</article>
						))}
					</section>

					<section id="cart-summary" data-testid="cart-summary" className="cart-summary">
						<div>
							<span id="cart-summary-label" data-testid="cart-summary-label">
								Total
							</span>
							<strong id="cart-summary-total" data-testid="cart-summary-total">
								{currencyFormatter.format(total)}
							</strong>
						</div>
						<button
							id="cart-buy-button"
							data-testid="cart-buy-button"
							type="button"
							onClick={handleBuy}
							disabled={buying}
						>
							{buying ? "Buying..." : "Buy"}
						</button>
					</section>
				</>
			)}
		</main>
	);
}
