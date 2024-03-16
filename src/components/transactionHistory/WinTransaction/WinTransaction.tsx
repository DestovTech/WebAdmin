import "./WinTransaction.scss";
import { useEffect } from "react";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useTransactionContext, WinDetails } from "../TransactionContext";
import WinDataGrid from "./WinDataGrid";

type Windetails = WinDetails;

const WinTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const { winData, setWinData } = useTransactionContext();

  useEffect(() => {
    const winRef = ref(database, `USERS TRANSACTION/${userId}/WIN/TOTAL`);

    const handleWinData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) return;

      const winDetailsArray: Windetails[] = [];

      // Function to get short month name from month number

      // Iterate through each game key
      for (const gameKey in data) {
        const gameData = data[gameKey];

        // Iterate through each time key inside the game
        for (const timeKey in gameData) {
          const winNode = gameData[timeKey];

          const winDetails: WinDetails = {
            date: winNode.DATE,
            marketId: winNode.MARKET_ID,
            marketName: winNode.MARKET_NAME,
            name: winNode.NAME,
            newPoints: winNode.NEW_POINTS,
            number: winNode.NUMBER,
            openClose: winNode.OPEN_CLOSE,
            phone: winNode.PHONE,
            points: winNode.POINTS,
            previousPoints: winNode.PREVIOUS_POINTS,
            type: winNode.TYPE,
            winPoints: winNode.WIN_POINTS,
          };

          winDetailsArray.push(winDetails);
        }
      }
      winDetailsArray.sort((a, b) => {
        const dateA = new Date(a.date.replace("|", "")).getTime();
        const dateB = new Date(b.date.replace("|", "")).getTime();
        if (dateA === dateB) {
          return b.previousPoints - a.previousPoints;
        }

        return dateB - dateA;
      });

      setWinData(winDetailsArray);
    };

    // Listen for changes in the WIN data
    onValue(winRef, handleWinData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(winRef, "value", handleWinData);
    };
  }, [userId]);

  return (
    <div className="win_data">
      <h2>Win History</h2>
      {winData && <WinDataGrid winData={winData} />}
    </div>
  );
};

export default WinTransaction;
