import React, { createContext, useContext } from "react";
import { useLiveEngine } from "../hooks/useLiveEngine.js";

const EngineContext = createContext(null);

export function EngineProvider({ children }) {
  const engine = useLiveEngine();
  return <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>;
}

export function useEngine() {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error("useEngine must be used within an <EngineProvider>");
  return ctx;
}
