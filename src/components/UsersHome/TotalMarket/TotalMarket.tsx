import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const TotalMarket = () => {
  const [market, setMarket] = useState(0);

  useEffect(() => {
    try {
      const marketRef = ref(database, "GAMES");
      get(marketRef).then((snapshot: any) => {
        if (snapshot.exists()) {
          setMarket(snapshot.size);
        }
      });

      const unsub = onValue(marketRef, (snapshot) => {
        if (snapshot.exists()) {
          setMarket(snapshot.size);
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/market");
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      <h4 className="total_balance_title">TOTAL MARKET</h4>
      <div className="total_balance ">
        <div className="amount totalUsers">{market}</div>
      </div>
      <div className="money_icon">
        <img src="/market.svg" alt="" />
      </div>
    </div>
  );
};

export default TotalMarket;
