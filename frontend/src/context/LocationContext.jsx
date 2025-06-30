import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("confirmedLocation");
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved location:", error);
      }
    }
  }, []);

  // ✅ Save and update location
  const setConfirmedLocation = (loc) => {
    setLocation(loc);
    localStorage.setItem("confirmedLocation", JSON.stringify(loc));
  };

  return (
    <LocationContext.Provider value={{ location, setConfirmedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// ✅ Custom Hook
export const useLocation = () => useContext(LocationContext);
