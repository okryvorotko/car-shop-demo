import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "../api";
import AccountMenu from "../components/AccountMenu";

export default function AccountDetails({ user, setUser }) {
	const [account, setAccount] = useState(user);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		let active = true;

		async function loadAccount() {
			setLoading(true);
			setError("");

			try {
				const token = localStorage.getItem("token");
				const data = await checkAuth(token);

				if (active) {
					setAccount(data);
					setUser(data);
				}
			} catch {
				if (active) {
					localStorage.removeItem("token");
					setUser(null);
					setError("Your session has expired. Please log in again.");
					navigate("/login");
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		loadAccount();

		return () => {
			active = false;
		};
	}, [navigate, setUser]);

	return (
		<main id="account-page" data-testid="account-page" className="account-page">
			<header id="account-header" data-testid="account-header" className="account-header">
				<div id="account-header-copy" data-testid="account-header-copy">
					<p id="account-eyebrow" data-testid="account-eyebrow">
						Account
					</p>
					<h1 id="account-title" data-testid="account-title">
						Account Details
					</h1>
				</div>
				<AccountMenu user={user} setUser={setUser} />
			</header>

			{loading && (
				<p id="account-loading" data-testid="account-loading" className="cars-status">
					Loading account...
				</p>
			)}

			{error && (
				<p id="account-error" data-testid="account-error" className="cars-status error">
					{error}
				</p>
			)}

			{!loading && !error && account && (
				<section id="account-card" data-testid="account-card" className="account-card">
					<div id="account-avatar" data-testid="account-avatar" className="account-avatar">
						{account.username.charAt(0).toUpperCase()}
					</div>
					<div id="account-fields" data-testid="account-fields" className="account-fields">
						<div id="account-id-field" data-testid="account-id-field">
							<span>User ID</span>
							<strong id="account-id-value" data-testid="account-id-value">
								{account.id}
							</strong>
						</div>
						<div id="account-username-field" data-testid="account-username-field">
							<span>Username</span>
							<strong id="account-username-value" data-testid="account-username-value">
								{account.username}
							</strong>
						</div>
					</div>
				</section>
			)}

			<Link id="account-back-link" data-testid="account-back-link" className="account-back-link" to="/cars">
				Back to cars
			</Link>
		</main>
	);
}
