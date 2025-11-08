const BE_HOST = import.meta.env.VITE_BE_HOST;

export async function checkAuth(token) {
	const res = await fetch(`${BE_HOST}me`, {
		headers: {Authorization: `Bearer ${token}`},
		cache: "no-store",
	});
	if (!res.ok) throw new Error('unauthorized');
	return res.json();
}
