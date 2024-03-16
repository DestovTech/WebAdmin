import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { database } from "../../../../firebase";
import { useUsersDataContext } from "../../UserContext";

const YesterdayWin = () => {
  const { yesterdayWin, setYesterdayWin } = useUsersDataContext();

  useEffect(() => {
    try {
      const currentDate = new Date();
      const yesterdayTimestamp = currentDate.getTime() - 24 * 60 * 60 * 1000; // Subtract 1 day in milliseconds
      const yesterday = new Date(yesterdayTimestamp);

      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, "0");
      const day = yesterday.getDate();

      let totalWinAmount = 0;

      const winRef = ref(
        database,
        `TOTAL TRANSACTION/WIN/DATE WISE/${year}/${month}/${day}`
      );

      const unsub = onValue(winRef, (winSnapshot) => {
        if (winSnapshot.exists()) {
          winSnapshot.forEach((market) => {
            market.forEach((timeSnap) => {
              const amount = timeSnap.child("WIN_POINTS").val() as number;
              //   console.log(amount, userPhone);
              totalWinAmount += amount;
              //   console.log(totalWithdrawAmount);
            });
          });
        }
        setYesterdayWin(totalWinAmount);
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title yesterday">YESTERDAY'S WIN</h4>
      <div className="total_balance ">
        <div className="amount yesterDay_deposit">&#8377; {yesterdayWin}</div>
      </div>
      <div className="money_icon">
        <img src="/win1.svg" alt="" />
      </div>
    </div>
  );
};

export default YesterdayWin;
