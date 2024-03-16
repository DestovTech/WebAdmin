import { useEffect, useState } from "react";
import { get, ref, onValue } from "firebase/database";
import { database } from "../../../firebase";
import GamesDataGrid from "./GamesDataGrid";

export interface daysData {
  MON: string;
  TUE: string;
  WED: string;
  THU: string;
  FRI: string;
  SAT: string;
  SUN: string;
}

export interface GameData {
  key: string;
  CLOSE: number;
  DAYS: daysData;
  HIDDEN: string;
  DISABLE: string;
  NAME: string;
  OPEN: number;
  RESULT: string;
}

const formatResult = (open: string, mid: string, close: string): string => {
  return `${open}-${mid}-${close}`;
};

const GamesDetails = () => {
  const [gameData, setGameData] = useState<GameData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  useEffect(() => {
    const gamesRef = ref(database, "GAMES");
    const resultsRef = ref(database, "RESULTS");

    const fetchGameData = async () => {
      try {
        const gamesSnapshot = await get(gamesRef);

        const snapshot = await get(resultsRef);

        if (gamesSnapshot.exists()) {
          const gamesData: GameData[] = Object.keys(gamesSnapshot.val()).map(
            (gameKey) => {
              const gameInfo = gamesSnapshot.val()[gameKey];
              const resultData = snapshot
                .child(gameKey)
                .child(year)
                .child(month)
                .child(day)
                .val();

              const resultString = resultData
                ? formatResult(
                    resultData.OPEN,
                    resultData.MID,
                    resultData.CLOSE
                  )
                : "✦✦✦-✦✦-✦✦✦";

              return {
                key: gameKey,
                RESULT: resultString,
                ...gameInfo,
              };
            }
          );

          gamesData.sort((a, b) => {
            return a.OPEN - b.OPEN;
          });

          setGameData(gamesData);
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribeGames = onValue(gamesRef, () => {
      fetchGameData(); // Fetch game data on initial load
    });

    const unsubscribeResults = onValue(resultsRef, () => {
      fetchGameData(); // Fetch game data whenever result data changes
    });

    return () => {
      unsubscribeGames();
      unsubscribeResults();
    };
  }, [day]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        gameData && <GamesDataGrid gameData={gameData} />
      )}
    </div>
  );
};

export default GamesDetails;
