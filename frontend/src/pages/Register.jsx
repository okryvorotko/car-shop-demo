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
		<main className="landing-page auth-page">
			<form id="register-form" data-testid="register-form" onSubmit={handleRegister} className="auth-panel">
				<img src="/car-icon.svg" alt="Car Shop Demo" className="landing-logo" />
				<h2 id="r_header" data-testid="r_header" className="auth-title">Register</h2>
				<div className="auth-fields">
					<input
						placeholder="Username"
						id="r_username"
						data-testid="r_username"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
					<input
						placeholder="Password"
						id="r_password"
						data-testid="r_password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit" id="r_register" data-testid="r_register" className="landing-primary auth-submit">Register</button>
				<p id="r_msg" data-testid="r_msg" className="auth-message">{msg}</p>
			</form>
		</main>
	);
}
