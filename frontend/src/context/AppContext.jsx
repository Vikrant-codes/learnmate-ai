import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [student, setStudent] = useState({
    classGroup: "",   // "5-8" | "9-10" | "11-12"
    level: "",        // "Beginner" | "Intermediate" | "Advanced"
  });

  const [currentTopic, setCurrentTopic] = useState("");

  return (
    <AppContext.Provider value={{ student, setStudent, currentTopic, setCurrentTopic }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
