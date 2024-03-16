import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../../firebase";
import { useNavigate } from "react-router-dom";
import { useUsersDataContext } from "../../UserContext";

const TodayDeposit = () => {
  const [totalDeposit, setTotalDeposit] = useState(0);
  const { selectedDate } = useUsersDataContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const selectedDate = new Date();
        const currentYear = selectedDate.getFullYear();
        const currentMonth = (selectedDate.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Ensure two digits
        const currentDay = selectedDate.getDate().toString().padStart(2, "0");

        let totalDepositAmount = 0;

        const depositRef = ref(
          database,
          `TOTAL TRANSACTION/DEPOSIT/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
        );

        const depositSnapshot = await get(depositRef);

        if (depositSnapshot.exists()) {
          depositSnapshot.forEach((timeSnap) => {
            const amount = timeSnap.child("AMOUNT").val() as number;
            //   console.log(amount, userPhone);
            totalDepositAmount += amount;
            //   console.log(totalDepositAmount);
          });
          setTotalDeposit(totalDepositAmount);
        } else {
          setTotalDeposit(0);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [selectedDate]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/deposit");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title">TODAY'S DEPOSIT</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalDeposit}</div>
      </div>
      <div className="money_icon">
        <img src="/deposit.svg" alt="" />
      </div>
    </div>
  );
};

export default TodayDeposit;
