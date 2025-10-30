import { useState } from "react";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");
	
	async function handleRegister(e) {
		e.preventDefault();
		const res = await fetch("http://localhost:3000/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		const data = await res.json();
		if (res.ok) setMsg("Registered successfully!");
		else setMsg(data.error);
	}
	
	return (
		<form onSubmit={handleRegister} className="p-4 flex flex-col gap-2">
			<h2>Register</h2>
			<input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
			<button type="submit">Register</button>
			<p>{msg}</p>
		</form>
	);
}
