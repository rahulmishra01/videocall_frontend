import { createContext, useContext, useEffect, useState } from "react";

const custom = createContext();

export const Usecustem = () => {
  return useContext(custom);
};
 
export default function Contextfn({ children }) {
  const [inputvalue, setInputvalue] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usemsg, setUsemsg] = useState([]);
  useEffect(() => {
    localStorage.getItem("mode")
  },[isDarkMode])
  return (
    <custom.Provider value={{ inputvalue, setInputvalue, usemsg, setUsemsg, isDarkMode, setIsDarkMode }}>
      {children}
    </custom.Provider>
  );
}
