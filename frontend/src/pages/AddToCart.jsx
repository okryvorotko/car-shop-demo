import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../api";
import AccountMenu from "../components/AccountMenu";
import CartLink from "../components/CartLink";

export default function AddToCart({ user, setUser, cartCount, refreshCartCount }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;

		async function addCar() {
			try {
				const token = localStorage.getItem("token");
				await addToCart(token, id);
				await refreshCartCount();

				if (active) {
					navigate("/cart", { replace: true });
				}
			} catch (err) {
				if (active) {
					setError(err.message);
				}
			}
		}

		addCar();

		return () => {
			active = false;
		};
	}, [id, navigate, refreshCartCount]);

	return (
		<main id="add-to-cart-page" data-testid="add-to-cart-page" className="cart-page">
			<header id="add-to-cart-header" data-testid="add-to-cart-header" className="cars-header">
				<div id="add-to-cart-header-copy" data-testid="add-to-cart-header-copy">
					<h1 id="add-to-cart-title" data-testid="add-to-cart-title">
						Adding to Cart
					</h1>
				</div>
				<div id="add-to-cart-header-actions" data-testid="add-to-cart-header-actions" className="header-actions">
					<CartLink count={cartCount} />
					<AccountMenu user={user} setUser={setUser} />
				</div>
			</header>

			{error ? (
				<>
					<p id="add-to-cart-error" data-testid="add-to-cart-error" className="cars-status error">
						{error}
					</p>
					<Link id="add-to-cart-back-link" data-testid="add-to-cart-back-link" className="account-back-link" to={`/cars/${id}`}>
						Back to car details
					</Link>
				</>
			) : (
				<p id="add-to-cart-loading" data-testid="add-to-cart-loading" className="cars-status">
					Adding car...
				</p>
			)}
		</main>
	);
}
