import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import AccountDetails from "./pages/AccountDetails";
import { checkAuth } from "./api";

function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			checkAuth(token)
			.then((u) => setUser(u))
			.catch(() => localStorage.removeItem("token"))
			.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);
	
	if (loading) return <div>Loading...</div>;
	
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home user={user} />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login setUser={setUser} />} />
				<Route path="/welcome" element={user ? <Welcome user={user} /> : <Navigate to="/" />} />
				<Route path="/cars" element={user ? <Cars user={user} setUser={setUser} /> : <Navigate to="/login" />} />
				<Route path="/cars/:id" element={user ? <CarDetails user={user} setUser={setUser} /> : <Navigate to="/login" />} />
				<Route path="/me" element={user ? <AccountDetails user={user} setUser={setUser} /> : <Navigate to="/login" />} />
			</Routes>
		</Router>
	);
}

export default App;
