"use client";

import { useEffect, useState } from "react";

export default function ViewPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const gameName = "Gun Shoot";
      try {
        const response = await fetch(`http://localhost:5000/getGameData/gameName/${(gameName)}`); 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();

        setData(jsonData); 
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
  
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      
      {data.length > 0 && (
        <>
          <h3>Path Data:</h3>
          <ul>
            {data.map((game, index) => (
              <li key={index}>
                <strong>Room:</strong> {game.room} <br></br>
                <strong> Path:</strong> {JSON.stringify(game.game_data.path)} <br></br>
                <strong> Player:</strong> {JSON.stringify(game.game_data.reg_id)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
