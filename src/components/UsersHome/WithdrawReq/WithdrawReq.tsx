import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const WithdrawReq = () => {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  //   const day = currentDate.getDate().toString().padStart(2, "0");

  const [totalReq, setTotalReq] = useState(0);

  const current = Date.now();
  const previous = current - 7 * 24 * 60 * 60 * 1000;

  //   console.log(current, previous);

  useEffect(() => {
    try {
      const withdrawRef = ref(database, `TOTAL TRANSACTION/WITHDRAW/TOTAL`);

      const unsub = onValue(withdrawRef, (snapshot) => {
        let count = 0;
        if (snapshot.exists()) {
          snapshot.forEach((timesnap: any) => {
            if (timesnap.key >= previous) {
              if (timesnap.val().PENDING === "true") {
                count++;
                console.log(count);
              }
            }
          });
        }
        setTotalReq(count);
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/withdraw");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title yesterday">MANUAL WITHDRAW REQ.</h4>
      <div className="total_balance ">
        <div className="amount totalUsers">{totalReq}</div>
      </div>
      <div className="money_icon">
        <img src="withdraw2.svg" alt="" />
      </div>
    </div>
  );
};

export default WithdrawReq;
