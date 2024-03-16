import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../../firebase";
import "./YesterdayDeposit.scss";

const YesterDayDeposit = () => {
  const [yesterdayDeposit, setYesterdayDeposit] = useState(0);

  useEffect(() => {
    try {
      const currentDate = new Date();
      const yesterdayTimestamp = currentDate.getTime() - 24 * 60 * 60 * 1000; // Subtract 1 day in milliseconds
      const yesterday = new Date(yesterdayTimestamp);

      const year = yesterday.getFullYear();
      const month = (yesterday.getMonth() + 1).toString().padStart(2, "0");
      const day = yesterday.getDate();

      console.log(year, month, day);

      let totalDepositAmount = 0;

      const depositRef = ref(
        database,
        `TOTAL TRANSACTION/DEPOSIT/DATE WISE/${year}/${month}/${day}`
      );

      const unsub = onValue(depositRef, (depositSnapshot) => {
        if (depositSnapshot.exists()) {
          depositSnapshot.forEach((timeSnap) => {
            const amount = timeSnap.child("AMOUNT").val() as number;
            //   console.log(amount, userPhone);
            totalDepositAmount += amount;
            //   console.log(totalDepositAmount);
          });
          setYesterdayDeposit(totalDepositAmount);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title yesterday">YESTERDAY'S DEPOSIT</h4>
      <div className="total_balance ">
        <div className="amount yesterDay_deposit">
          &#8377; {yesterdayDeposit}
        </div>
      </div>
      <div className="money_icon">
        <img src="/deposit.svg" alt="" />
      </div>
    </div>
  );
};

export default YesterDayDeposit;
