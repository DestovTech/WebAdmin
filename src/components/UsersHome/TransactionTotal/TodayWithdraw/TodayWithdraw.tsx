import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { useUsersDataContext } from "../../UserContext";

const TodayWithdraw = () => {
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const { selectedDate } = useUsersDataContext();

  useEffect(() => {
    try {
      // const selectedDate = new Date();
      const currentYear = selectedDate.getFullYear();
      const currentMonth = (selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = selectedDate.getDate();

      let totalWithdrawAmount = 0;

      const withdrawRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
      );

      const unsub = onValue(withdrawRef, (withdrawSnapshot) => {
        if (withdrawSnapshot.exists()) {
          withdrawSnapshot.forEach((timeSnap) => {
            const amount = timeSnap.child("AMOUNT").val() as number;
            //   console.log(amount, userPhone);
            totalWithdrawAmount += amount;
            //   console.log(totalWithdrawAmount);
          });
          setTotalWithdraw(totalWithdrawAmount);
        } else {
          setTotalWithdraw(0);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, [selectedDate]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/withdraw");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title">TODAY'S WITHDRAW</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalWithdraw}</div>
      </div>
      <div className="money_icon">
        <img src="/withdraw2.svg" alt="" />
      </div>
    </div>
  );
};

export default TodayWithdraw;
