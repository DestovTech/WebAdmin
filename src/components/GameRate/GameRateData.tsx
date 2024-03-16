import { useEffect, useState } from "react";
import "./GameRateData.scss";
import { get, onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import GameRateGrid from "./GameRateGrid";

export type GameRateType = Record<string, number>;

const GameRateData = () => {
  const [gameRate, setGameRate] = useState<GameRateType>({});

  useEffect(() => {
    try {
      const rateRef = ref(database, "ADMIN/GAME RATE");

      get(rateRef).then((snapshot) => {
        if (snapshot.exists()) {
          setGameRate(snapshot.val());
        } else {
          console.log("No data available");
        }
      });

      const unsubscribe = onValue(rateRef, (snapshot) => {
        if (snapshot.exists()) {
          setGameRate(snapshot.val());
        } else {
          console.log("No data available");
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log(gameRate);
  return (
    <div className="gameRate_details">
      <h1>Game Rate</h1>
      <GameRateGrid gameRate={gameRate} />
    </div>
  );
};

export default GameRateData;
