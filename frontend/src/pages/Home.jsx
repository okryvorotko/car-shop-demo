import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
	const navigate = useNavigate();
	
	if (user) {
		return (
			<div id="welcome-page">
				<h1>🚗 Car Shop Demo</h1>
				<p>Welcome back, {user.username}!</p>
				<button id="go-to-shop" onClick={() => navigate("/welcome")}>Go to Shop</button>
			</div>
		);
	}
	
	return (
		<div id="home-page">
			<h1>🚗 Car Shop Demo</h1>
			<p>Welcome! Please register or log in to continue.</p>
			<div style={{ marginTop: "20px" }}>
				<button id="register-btn" onClick={() => navigate("/register")}>Register</button>
				<button id="login-btn" onClick={() => navigate("/login")}>Login</button>
			</div>
		</div>
	);
}
