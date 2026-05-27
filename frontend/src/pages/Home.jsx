import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
	const navigate = useNavigate();
	
	if (user) {
		return (
			<div id="welcome-page" data-testid="welcome-page">
				<h1 id="home-title-authenticated" data-testid="home-title-authenticated">🚗 Car Shop Demo</h1>
				<p id="home-welcome-message" data-testid="home-welcome-message">Welcome back, {user.username}!</p>
				<button id="go-to-shop" data-testid="go-to-shop" onClick={() => navigate("/cars")}>Go to Shop</button>
			</div>
		);
	}
	
	return (
		<div id="home-page" data-testid="home-page">
			<h1 id="home-title" data-testid="home-title">🚗 Car Shop Demo</h1>
			<p id="home-message" data-testid="home-message">Welcome! Please register or log in to continue.</p>
			<div id="home-actions" data-testid="home-actions" style={{ marginTop: "20px" }}>
				<button id="register-btn" data-testid="register-btn" onClick={() => navigate("/register")}>Register</button>
				<button id="login-btn" data-testid="login-btn" onClick={() => navigate("/login")}>Login</button>
			</div>
		</div>
	);
}
