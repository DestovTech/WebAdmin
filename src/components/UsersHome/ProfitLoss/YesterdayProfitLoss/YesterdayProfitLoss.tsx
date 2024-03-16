import { useEffect, useState } from "react";
import { useUsersDataContext } from "../../UserContext";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

const YesterdayProfitLoss = () => {
  const { yesterdayBid, yesterdayWin } = useUsersDataContext();
  const [profit, setProfit] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState(0);

  useEffect(() => {
    const calculateProfit = () => {
      const value = yesterdayBid - yesterdayWin;

      if (value > 0) {
        setProfit(true);
      } else if (value < 0) {
        setProfit(false);
      }

      setCalculatedValue(Math.abs(value));
    };

    // Call the function when the component mounts or when totalDeposit or totalWithdraw changes
    calculateProfit();
  }, [yesterdayBid, yesterdayWin]);

  return (
    <div className="profit_loss_container">
      <h3 className="profit_loss_title yesterday">YESTERDAY'S Profit / Loss</h3>
      <div className="profit">&#8377; {calculatedValue}</div>

      {profit ? (
        <div className="profit_icon">
          <KeyboardDoubleArrowUpRoundedIcon style={{ fontSize: "2rem" }} />
        </div>
      ) : !profit && calculatedValue !== 0 ? (
        <div className="loss_icon">
          <KeyboardDoubleArrowDownRoundedIcon style={{ fontSize: "2rem" }} />
        </div>
      ) : (
        <div className="neutral_icon">
          <RemoveCircleRoundedIcon />
        </div>
      )}
    </div>
  );
};

export default YesterdayProfitLoss;
