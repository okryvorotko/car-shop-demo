export default function Welcome({ user }) {
	return (
		<div id="welcome-user" data-testid="welcome-user">
			<h2 id="welcome-user-title" data-testid="welcome-user-title">Welcome, {user.username}!</h2>
			<p id="welcome-user-message" data-testid="welcome-user-message">You're logged in 🎉</p>
		</div>
	);
}
