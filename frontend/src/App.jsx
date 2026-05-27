import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import AccountDetails from "./pages/AccountDetails";
import AddToCart from "./pages/AddToCart";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import { checkAuth, fetchCartCount } from "./api";
import { NightModeProvider } from "./nightMode.jsx";

function App() {
	const [user, setUser] = useState(null);
	const [cartCount, setCartCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const refreshCartCount = useCallback(async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			setCartCount(0);
			return;
		}

		try {
			const data = await fetchCartCount(token);
			setCartCount(data.count);
		} catch {
			setCartCount(0);
		}
	}, []);
	
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			checkAuth(token)
			.then((u) => {
				setUser(u);
				return refreshCartCount();
			})
			.catch(() => {
				localStorage.removeItem("token");
				setCartCount(0);
			})
			.finally(() => setLoading(false));
		} else {
			setCartCount(0);
			setLoading(false);
		}
	}, [refreshCartCount]);

	useEffect(() => {
		if (user) {
			refreshCartCount();
		}
	}, [refreshCartCount, user]);
	
	if (loading) return <div>Loading...</div>;
	
	return (
		<NightModeProvider>
			<Router>
				<Routes>
					<Route path="/" element={<Home user={user} />} />
					<Route path="/register" element={<Register setUser={setUser} />} />
					<Route path="/login" element={<Login setUser={setUser} />} />
					<Route path="/welcome" element={user ? <Welcome user={user} /> : <Navigate to="/" />} />
					<Route path="/cars" element={user ? <Cars user={user} setUser={setUser} cartCount={cartCount} /> : <Navigate to="/login" />} />
					<Route path="/cars/:id" element={user ? <CarDetails user={user} setUser={setUser} cartCount={cartCount} refreshCartCount={refreshCartCount} /> : <Navigate to="/login" />} />
					<Route path="/cart" element={user ? <Cart user={user} setUser={setUser} cartCount={cartCount} refreshCartCount={refreshCartCount} /> : <Navigate to="/login" />} />
					<Route path="/cart/add/:id" element={user ? <AddToCart user={user} setUser={setUser} cartCount={cartCount} refreshCartCount={refreshCartCount} /> : <Navigate to="/login" />} />
					<Route path="/order" element={user ? <Order user={user} setUser={setUser} cartCount={cartCount} /> : <Navigate to="/login" />} />
					<Route path="/me" element={user ? <AccountDetails user={user} setUser={setUser} cartCount={cartCount} /> : <Navigate to="/login" />} />
				</Routes>
			</Router>
		</NightModeProvider>
	);
}

export default App;
