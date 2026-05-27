import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BE_HOST = import.meta.env.VITE_BE_HOST;

export default function Login({ setUser }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");
	const navigate = useNavigate();
	
	async function handleLogin(e) {
		e.preventDefault();
		const res = await fetch(`${BE_HOST}auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		
		if (res.ok) {
			localStorage.setItem("token", data.token);
			
			// 👇 Immediately fetch user info and update app state
			const userRes = await fetch(`${BE_HOST}me`, {
				headers: { Authorization: `Bearer ${data.token}` },
			});
			const userData = await userRes.json();
			setUser(userData);
			
			setMsg("Login successful!");
			setTimeout(() => navigate("/cars"), 1000);
		} else {
			setMsg(data.error);
		}
	}
	
	return (
		<main className="landing-page auth-page">
			<form id="login-form" data-testid="login-form" onSubmit={handleLogin} className="auth-panel">
				<img src="/car-icon.svg" alt="Car Shop Demo" className="landing-logo" />
				<h2 id="login-header" data-testid="login-header" className="auth-title">Login</h2>
				<div className="auth-fields">
					<input
						id="login-username"
						data-testid="login-username"
						placeholder="Username"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
					<input
						id="login-password"
						data-testid="login-password"
						placeholder="Password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<button id="login-submit" data-testid="login-submit" className="landing-primary auth-submit" type="submit">Login</button>
				<p id="login-message" data-testid="login-message" className="auth-message">{msg}</p>
			</form>
		</main>
	);
}
