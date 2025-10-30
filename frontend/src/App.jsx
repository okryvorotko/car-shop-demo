import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function App() {
	const [user, setUser] = useState(null);
	
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			fetch("http://localhost:3000/me", {
				headers: { Authorization: "Bearer " + token },
			})
			.then(res => res.json())
			.then(data => setUser(data));
		}
	}, []);
	
	if (!user)
		return (
			<div>
				<Register />
				<Login />
			</div>
		);
	
	return <h1>Welcome, {user.username}!</h1>;
}
