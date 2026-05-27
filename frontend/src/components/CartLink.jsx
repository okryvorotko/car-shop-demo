import { Link } from "react-router-dom";

export default function CartLink({ count = 0 }) {
	return (
		<Link
			id="cart-link"
			data-testid="cart-link"
			className="cart-link"
			to="/cart"
			aria-label={count > 0 ? `Cart with ${count} items` : "Cart"}
		>
			<span id="cart-link-icon" data-testid="cart-link-icon" className="cart-link-icon" aria-hidden="true">
				&#128722;
			</span>
			{count > 0 && (
				<span id="cart-link-badge" data-testid="cart-link-badge" className="cart-link-badge">
					{count}
				</span>
			)}
		</Link>
	);
}
