import { useEffect, useMemo, useState } from "react";
import { NightModeContext } from "./useNightMode";

const STORAGE_KEY = "nightModePreference";
const NIGHT_MODE = "night";
const DAY_MODE = "day";

function getStoredPreference() {
	const preference = localStorage.getItem(STORAGE_KEY);
	return preference === NIGHT_MODE || preference === DAY_MODE ? preference : null;
}

function getDayOfYear(date) {
	const start = new Date(date.getFullYear(), 0, 0);
	const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
	return Math.floor(diff / 86400000);
}

function getSunTimes(date) {
	const day = getDayOfYear(date);
	const gamma = (2 * Math.PI / 365) * (day - 1 + (12 - 12) / 24);
	const equationOfTime =
		229.18 *
		(0.000075 +
			0.001868 * Math.cos(gamma) -
			0.032077 * Math.sin(gamma) -
			0.014615 * Math.cos(2 * gamma) -
			0.040849 * Math.sin(2 * gamma));
	const declination =
		0.006918 -
		0.399912 * Math.cos(gamma) +
		0.070257 * Math.sin(gamma) -
		0.006758 * Math.cos(2 * gamma) +
		0.000907 * Math.sin(2 * gamma) -
		0.002697 * Math.cos(3 * gamma) +
		0.00148 * Math.sin(3 * gamma);
	const zenith = 90.833 * (Math.PI / 180);
	const latitude = 0;
	const timezoneOffset = -date.getTimezoneOffset();
	const longitude = (timezoneOffset / 60) * 15;
	const hourAngle =
		Math.acos(
			Math.cos(zenith) / (Math.cos(latitude) * Math.cos(declination)) -
				Math.tan(latitude) * Math.tan(declination),
		) *
		(180 / Math.PI);
	const solarNoon = 720 - 4 * longitude - equationOfTime + timezoneOffset;

	return {
		sunrise: solarNoon - hourAngle * 4,
		sunset: solarNoon + hourAngle * 4,
	};
}

function getAutoNightMode(date) {
	const { sunrise, sunset } = getSunTimes(date);
	const minutes = date.getHours() * 60 + date.getMinutes();

	return {
		isNight: minutes >= sunset || minutes < sunrise,
		sunset,
	};
}

function formatMinutes(totalMinutes) {
	const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
	const hours = Math.floor(normalized / 60);
	const minutes = normalized % 60;
	const date = new Date();
	date.setHours(hours, minutes, 0, 0);

	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

export function NightModeProvider({ children }) {
	const [preference, setPreference] = useState(getStoredPreference);
	const [autoMode, setAutoMode] = useState(() => getAutoNightMode(new Date()));

	useEffect(() => {
		function refreshAutoMode() {
			setAutoMode(getAutoNightMode(new Date()));
		}

		refreshAutoMode();
		const intervalId = window.setInterval(refreshAutoMode, 60000);

		return () => window.clearInterval(intervalId);
	}, []);

	useEffect(() => {
		function handleStorage(event) {
			if (event.key === STORAGE_KEY) {
				setPreference(getStoredPreference());
			}
		}

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const isNightMode = preference ? preference === NIGHT_MODE : autoMode.isNight;

	useEffect(() => {
		const theme = isNightMode ? NIGHT_MODE : DAY_MODE;
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme === NIGHT_MODE ? "dark" : "light";
	}, [isNightMode]);

	const value = useMemo(
		() => ({
			isNightMode,
			isAutomatic: preference === null,
			sunsetLabel: formatMinutes(autoMode.sunset),
			setNightModeOverride(enabled) {
				const nextPreference = enabled ? NIGHT_MODE : DAY_MODE;
				localStorage.setItem(STORAGE_KEY, nextPreference);
				setPreference(nextPreference);
			},
		}),
		[autoMode.sunset, isNightMode, preference],
	);

	return <NightModeContext.Provider value={value}>{children}</NightModeContext.Provider>;
}
