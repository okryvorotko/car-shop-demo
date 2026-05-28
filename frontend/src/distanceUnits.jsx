import { useEffect, useMemo, useState } from "react";
import { DistanceUnitsContext } from "./useDistanceUnits";

const STORAGE_KEY = "distanceUnitPreference";
const METRIC = "metric";
const IMPERIAL = "imperial";
const MILES_TO_KILOMETERS = 1.60934;

function getStoredPreference() {
	const preference = localStorage.getItem(STORAGE_KEY);
	return preference === METRIC || preference === IMPERIAL ? preference : METRIC;
}

function formatRangeMiles(rangeMiles, isMetric) {
	if (isMetric) {
		return `${Math.round(rangeMiles * MILES_TO_KILOMETERS)} Km`;
	}

	return `${Math.round(rangeMiles)} mi`;
}

export function DistanceUnitsProvider({ children }) {
	const [preference, setPreference] = useState(getStoredPreference);

	useEffect(() => {
		function handleStorage(event) {
			if (event.key === STORAGE_KEY) {
				setPreference(getStoredPreference());
			}
		}

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const value = useMemo(
		() => ({
			isMetric: preference === METRIC,
			formatDistance(rangeMiles) {
				return formatRangeMiles(rangeMiles, preference === METRIC);
			},
			setMetricPreference(enabled) {
				const nextPreference = enabled ? METRIC : IMPERIAL;
				localStorage.setItem(STORAGE_KEY, nextPreference);
				setPreference(nextPreference);
			},
		}),
		[preference],
	);

	return <DistanceUnitsContext.Provider value={value}>{children}</DistanceUnitsContext.Provider>;
}
