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
			setTimeout(() => navigate("/"), 1000);
		} else {
			setMsg(data.error);
		}
	}
	
	return (
		<form onSubmit={handleLogin} className="p-4 flex flex-col gap-2">
			<h2>Login</h2>
			<input
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				placeholder="Password"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button type="submit">Login</button>
			<p>{msg}</p>
		</form>
	);
}
