const BE_HOST = import.meta.env.VITE_BE_HOST;

export async function checkAuth(token) {
	const res = await fetch(`${BE_HOST}me`, {
		headers: {Authorization: `Bearer ${token}`},
		cache: "no-store",
	});
	if (!res.ok) throw new Error('unauthorized');
	return res.json();
}

export async function fetchCars(token, filters = {}) {
	const params = new URLSearchParams();

	Object.entries(filters).forEach(([key, value]) => {
		if (value !== "") {
			params.set(key, value);
		}
	});

	const query = params.toString();
	const res = await fetch(`${BE_HOST}cars${query ? `?${query}` : ""}`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Unable to load cars");
	return res.json();
}

export async function fetchCar(token, id) {
	const res = await fetch(`${BE_HOST}cars/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	if (res.status === 404) throw new Error("Car not found");
	if (!res.ok) throw new Error("Unable to load car");
	return res.json();
}

export async function fetchCart(token) {
	const res = await fetch(`${BE_HOST}cart`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Unable to load cart");
	return res.json();
}

export async function fetchCartCount(token) {
	const res = await fetch(`${BE_HOST}cart/count`, {
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Unable to load cart count");
	return res.json();
}

export async function addToCart(token, id) {
	const res = await fetch(`${BE_HOST}cart/add/${id}`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		throw new Error(data.error || "Unable to add car to cart");
	}

	return data;
}

export async function createOrder(token) {
	const res = await fetch(`${BE_HOST}order`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		cache: "no-store",
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		throw new Error(data.error || "Unable to create order");
	}

	return data;
}
