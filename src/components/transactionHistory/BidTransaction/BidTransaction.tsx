import "./BidTransaction.scss";
import { useEffect } from "react";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useTransactionContext } from "../TransactionContext";
import BidDataGrid from "./BidDataGrid";

// Define the interface for BID details
interface BidDetails {
  date: string;
  marketName: string;
  name: string;
  number: string;
  openClose: string;
  points: number;
  previousPoints: number;
  type: string;
  uid: string;
}

const BidTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const { bidData, setBidData } = useTransactionContext();

  useEffect(() => {
    const bidRef = ref(database, `USERS TRANSACTION/${userId}/BID/TOTAL`);

    const handleBidData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) return;

      const bidDetailsArray: BidDetails[] = [];

      // Iterate through each game key
      for (const gameKey in data) {
        const gameData = data[gameKey];

        // Iterate through each time key inside the game
        for (const timeKey in gameData) {
          const bidNode = gameData[timeKey];

          const bidDetails: BidDetails = {
            date: bidNode.DATE,
            marketName: bidNode.MARKET_NAME,
            name: bidNode.NAME,
            number: bidNode.NUMBER,
            openClose: bidNode.OPEN_CLOSE,
            points: bidNode.POINTS,
            previousPoints: bidNode.PREVIOUS_POINTS,
            type: bidNode.TYPE,
            uid: bidNode.UID,
          };

          bidDetailsArray.push(bidDetails);
        }
      }

      bidDetailsArray.sort((a, b) => {
        const dateA = new Date(a.date.replace("|", "")).getTime();
        const dateB = new Date(b.date.replace("|", "")).getTime();
        if (dateA === dateB) {
          return a.previousPoints - b.previousPoints;
        }
        return dateB - dateA;
      });

      setBidData(bidDetailsArray);
    };

    // Listen for changes in the BID data
    onValue(bidRef, handleBidData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(bidRef, "value", handleBidData);
    };
  }, [userId]);

  return (
    <div className="bid_transaction">
      <h2>Bid History</h2>
      {bidData && <BidDataGrid bidData={bidData} />}
    </div>
  );
};

export default BidTransaction;
