import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../firebase";
import { onValue, ref } from "firebase/database";

const DepositReq = () => {
  const [totalReq, setTotalReq] = useState(0);

  const current = Date.now();
  const previous = current - 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    try {
      const withdrawRef = ref(database, `MANUAL_REQUEST/TOTAL`);

      const unsub = onValue(withdrawRef, (snapshot) => {
        let count = 0;
        if (snapshot.exists()) {
          snapshot.forEach((timesnap: any) => {
            if (timesnap.key >= previous) {
              if (timesnap.val().ACCEPT === "false") {
                count++;
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
    navigate("/manualRequest");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title yesterday">MANUAL DEPOSIT REQ.</h4>
      <div className="total_balance ">
        <div className="amount totalUsers">{totalReq}</div>
      </div>
      <div className="money_icon">
        <img src="deposit.svg" alt="" />
      </div>
    </div>
  );
};

export default DepositReq;
