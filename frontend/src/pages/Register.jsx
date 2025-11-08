import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const BE_HOST = import.meta.env.VITE_BE_HOST;

export default function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [msg, setMsg] = useState('');
	const navigate = useNavigate();
	
	async function handleRegister(e) {
		e.preventDefault();
		const res = await fetch(`${BE_HOST}auth/register`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({username, password}),
		});
		const data = await res.json();
		if (res.ok) {
			setMsg('Registered successfully!');
			setTimeout(() => navigate('/login'), 1000); // wait 1s before redirect
		} else setMsg(data.error);
	}
	
	return (
		<form onSubmit={handleRegister} className="p-4 flex flex-col gap-2">
			<h2 id="r_header">Register</h2>
			<input
				placeholder="Username"
				id="r_username"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<input
				placeholder="Password"
				id="r_password"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			<button type="submit" id="r_register">Register</button>
			<p id="r_msg">{msg}</p>
		</form>
	);
}
