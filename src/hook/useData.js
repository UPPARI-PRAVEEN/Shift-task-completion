// src/hook/useData.js
import { useState, useEffect } from "react";

const useData = (username) => {
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:8080/shifts");
        const responseData = await response.json();
        setShifts(responseData);
        setError(null); 
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);
  

  return { shifts, loading, error };
};

export default useData;
