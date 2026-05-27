import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
	const navigate = useNavigate();
	
	if (user) {
		return (
			<main id="welcome-page" data-testid="welcome-page" className="landing-page landing-page-auth">
				<section className="landing-hero landing-hero-minimal" aria-label="Car Shop Demo">
					<img src="/car-icon.svg" alt="Car Shop Demo" className="landing-logo" />
					<div className="landing-actions">
						<button id="go-to-shop" data-testid="go-to-shop" className="landing-primary" onClick={() => navigate("/cars")}>
							Browse cars
						</button>
					</div>
				</section>
			</main>
		);
	}
	
	return (
		<main id="home-page" data-testid="home-page" className="landing-page">
			<section className="landing-hero landing-hero-minimal" aria-label="Car Shop Demo">
				<img src="/car-icon.svg" alt="Car Shop Demo" className="landing-logo" />
				<div id="home-actions" data-testid="home-actions" className="landing-actions">
					<button id="register-btn" data-testid="register-btn" className="landing-primary" onClick={() => navigate("/register")}>
						Register
					</button>
					<button id="login-btn" data-testid="login-btn" className="landing-secondary" onClick={() => navigate("/login")}>
						Login
					</button>
				</div>
			</section>
		</main>
	);
}
