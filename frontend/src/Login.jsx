import { useState } from "react";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");
	
	async function handleLogin(e) {
		e.preventDefault();
		const res = await fetch("http://localhost:3000/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		if (res.ok) {
			localStorage.setItem("token", data.token);
			setMsg("Login successful!");
		} else setMsg(data.error);
	}
	
	return (
		<form onSubmit={handleLogin} className="p-4 flex flex-col gap-2">
			<h2>Login</h2>
			<input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
			<button type="submit">Login</button>
			<p>{msg}</p>
		</form>
	);
}
