import { Link, useLocation } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import CartLink from "../components/CartLink";

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export default function Order({ user, setUser, cartCount }) {
	const { state } = useLocation();

	return (
		<main id="order-page" data-testid="order-page" className="order-page">
			<header id="order-header" data-testid="order-header" className="cars-header">
				<div id="order-header-copy" data-testid="order-header-copy">
					<h1 id="order-title" data-testid="order-title">
						Order
					</h1>
				</div>
				<div id="order-header-actions" data-testid="order-header-actions" className="header-actions">
					<CartLink count={cartCount} />
					<AccountMenu user={user} setUser={setUser} />
				</div>
			</header>

			<section id="order-card" data-testid="order-card" className="order-card">
				{state?.orderId ? (
					<>
						<p id="order-status" data-testid="order-status" className="order-status">
							Order placed
						</p>
						<h2 id="order-confirmation" data-testid="order-confirmation">
							Your car purchase is confirmed.
						</h2>
						<div id="order-details" data-testid="order-details" className="order-details">
							<div>
								<span>Order ID</span>
								<strong>{state.orderId}</strong>
							</div>
							<div>
								<span>Cars bought</span>
								<strong>{state.itemCount}</strong>
							</div>
							<div>
								<span>Total</span>
								<strong>{currencyFormatter.format(state.total)}</strong>
							</div>
						</div>
					</>
				) : (
					<>
						<p id="order-status" data-testid="order-status" className="order-status">
							No recent order
						</p>
						<h2 id="order-confirmation" data-testid="order-confirmation">
							Complete checkout from your cart.
						</h2>
					</>
				)}

				<Link id="order-browse-link" data-testid="order-browse-link" className="account-back-link" to="/cars">
					Back to cars
				</Link>
			</section>
		</main>
	);
}
