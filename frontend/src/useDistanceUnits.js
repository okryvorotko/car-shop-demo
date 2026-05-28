import { createContext, useContext } from "react";

export const DistanceUnitsContext = createContext(null);

export function useDistanceUnits() {
	const context = useContext(DistanceUnitsContext);

	if (!context) {
		throw new Error("useDistanceUnits must be used within DistanceUnitsProvider");
	}

	return context;
}
