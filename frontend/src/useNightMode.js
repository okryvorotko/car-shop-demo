import { createContext, useContext } from "react";

export const NightModeContext = createContext(null);

export function useNightMode() {
	const context = useContext(NightModeContext);

	if (!context) {
		throw new Error("useNightMode must be used within NightModeProvider");
	}

	return context;
}
