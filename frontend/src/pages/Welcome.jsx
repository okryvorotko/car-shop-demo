import React from "react";

export default function Welcome({ user }) {
	return (
		<div id="welcome-user">
			<h2>Welcome, {user.username}!</h2>
			<p>You're logged in 🎉</p>
		</div>
	);
}
