import { useNavigate } from "react-router-dom";
import { useDistanceUnits } from "../useDistanceUnits";
import { useNightMode } from "../useNightMode";

export default function AccountMenu({ user, setUser }) {
	const navigate = useNavigate();
	const { isMetric, setMetricPreference } = useDistanceUnits();
	const { isAutomatic, isNightMode, setNightModeOverride, sunsetLabel } = useNightMode();

	function handleLogout() {
		localStorage.removeItem("token");
		setUser(null);
		window.location.replace("/");
	}

	return (
		<div id="account-menu" data-testid="account-menu" className="account-menu">
			<button
				id="account-menu-trigger"
				data-testid="account-menu-trigger"
				className="account-menu-trigger"
				type="button"
				aria-haspopup="menu"
			>
				<span id="account-menu-icon" data-testid="account-menu-icon" className="account-menu-icon">
					{user.username.charAt(0).toUpperCase()}
				</span>
				<span id="account-menu-name" data-testid="account-menu-name" className="account-menu-name">
					{user.username}
				</span>
			</button>

			<div id="account-menu-dropdown" data-testid="account-menu-dropdown" className="account-menu-dropdown" role="menu">
				<button
					id="night-mode-toggle"
					data-testid="night-mode-toggle"
					type="button"
					role="menuitemcheckbox"
					aria-checked={isNightMode}
					className="account-menu-toggle"
					title={isAutomatic ? `Following browser timezone sunset (${sunsetLabel})` : "Manual night mode override"}
					onClick={() => setNightModeOverride(!isNightMode)}
				>
					<span>Night Mode</span>
					<span className="account-menu-switch" aria-hidden="true">
						<span className="account-menu-switch-thumb" />
					</span>
				</button>
				<button
					id="metric-toggle"
					data-testid="metric-toggle"
					type="button"
					role="menuitemcheckbox"
					aria-checked={isMetric}
					className="account-menu-toggle"
					onClick={() => setMetricPreference(!isMetric)}
				>
					<span>Metric</span>
					<span className="account-menu-switch" aria-hidden="true">
						<span className="account-menu-switch-thumb" />
					</span>
				</button>
				<button
					id="account-details-link"
					data-testid="account-details-link"
					type="button"
					role="menuitem"
					onClick={() => navigate("/me")}
				>
					Account details
				</button>
				<button
					id="account-logout"
					data-testid="account-logout"
					type="button"
					role="menuitem"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
