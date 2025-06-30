// context/LocationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    return JSON.parse(localStorage.getItem("confirmedLocation")) || null;
  });

  const setConfirmedLocation = (loc) => {
    localStorage.setItem("confirmedLocation", JSON.stringify(loc));
    setLocation(loc);
  };

  return (
    <LocationContext.Provider value={{ location, setConfirmedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
