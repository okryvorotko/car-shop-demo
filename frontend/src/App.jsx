import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

const BE_HOST = import.meta.env.VITE_BE_HOST;

export default function App() {
	const [user, setUser] = useState(null);
	
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			fetch(`${BE_HOST}me`, {
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
	
	return <h1 id="welcome_lbl">Welcome, {user.username}!</h1>;
}
