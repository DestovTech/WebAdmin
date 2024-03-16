import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../../firebase";

const YesterdayWithdraw = () => {
  const [yesterdayWithdraw, setYesterdayWithdraw] = useState(0);

  useEffect(() => {
    try {
      const currentDate = new Date();
      const yesterdayTimestamp = currentDate.getTime() - 24 * 60 * 60 * 1000; // Subtract 1 day in milliseconds
      const yesterday = new Date(yesterdayTimestamp);

      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, "0");
      const day = yesterday.getDate();

      let totalWithdrawAmount = 0;

      const withdrawRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW/DATE WISE/${year}/${month}/${day}`
      );

      const unsub = onValue(withdrawRef, (withdrawSnapshot) => {
        if (withdrawSnapshot.exists()) {
          withdrawSnapshot.forEach((timeSnap) => {
            const amount = timeSnap.child("AMOUNT").val() as number;
            //   console.log(amount, userPhone);
            totalWithdrawAmount += amount;
            //   console.log(totalWithdrawAmount);
          });
          setYesterdayWithdraw(totalWithdrawAmount);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title yesterday">YESTERDAY'S WITHDRAW</h4>
      <div className="total_balance ">
        <div className="amount yesterDay_deposit">
          &#8377; {yesterdayWithdraw}
        </div>
      </div>
      <div className="money_icon">
        <img src="/withdraw2.svg" alt="" />
      </div>
    </div>
  );
};

export default YesterdayWithdraw;
