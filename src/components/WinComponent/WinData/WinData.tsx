import { useEffect, useState } from "react";
import "./WinData.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useBidComponentContext } from "../../BidComponent/BidComponentContext";

interface WinDataType {
  marketkey: string;
  marketName: string;
  openTotal: number;
  closeTotal: number;
}

const WinData: React.FC = () => {
  const { selectedWinDate, setSelectedWinDate } = useBidComponentContext();
  const [winDataType, setWinDataType] = useState<WinDataType[] | null>(null);
  const [totalWinPoints, settotalWinPoints] = useState(0);
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinData = async () => {
      const currentYear = selectedWinDate.getFullYear();
      const currentMonth = (selectedWinDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = selectedWinDate.getDate().toString().padStart(2, "0");

      try {
        const marketRef = ref(
          database,
          `TOTAL TRANSACTION/WIN/DATE WISE/${currentYear}/${currentMonth}/${currentDay}`
        );

        const marketSnapshot = await get(marketRef);

        if (marketSnapshot.exists()) {
          const winData: WinDataType[] = [];
          let totalWinPoint = 0;
          marketSnapshot.forEach((marketsnapshot) => {
            const marketKey = marketsnapshot.key;
            let marketName: string = "";
            let totalOpen: number = 0;
            let totalClose: number = 0;

            marketsnapshot.forEach((timestamp) => {
              marketName = timestamp.val().MARKET_NAME;
              if (timestamp.val().OPEN_CLOSE === "OPEN") {
                totalOpen += timestamp.val().WIN_POINTS;
              } else {
                totalClose += timestamp.val().WIN_POINTS;
              }
            });
            winData.push({
              marketkey: marketKey,
              marketName: marketName,
              openTotal: totalOpen,
              closeTotal: totalClose,
            });

            totalWinPoint += totalOpen + totalClose;
          });
          settotalWinPoints(totalWinPoint);
          setWinDataType(winData);
        } else {
          setWinDataType(null);
          settotalWinPoints(0);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };

    fetchWinData();
  }, [selectedWinDate]);

  console.log(totalWinPoints);

  const handleDateChange = (date: Date) => {
    setSelectedWinDate(date);
  };

  //   if (dateString) {
  //     const [day, month, year] = dateString.split("-");
  //     const dateObject = new Date(`${year}-${month}-${day}`);
  //     S(dateObject);
  //   }

  if (!selectedWinDate) {
    const currentDate = new Date();
    setSelectedWinDate(currentDate);
  }

  const handleClick = (gamekey: string, gameName: string) => {
    navigate(`/win/${gamekey}___${gameName}`);
  };

  return (
    <div className="winData">
      <div className="winData_header">
        <h2>Win Data</h2>
        <div className="date-picker-container">
          <div className="date-pic">
            <DatePicker
              className="datePicker"
              selected={selectedWinDate}
              onChange={handleDateChange}
              dateFormat="dd-MMM-yyyy"
              maxDate={new Date()} // Set the maximum date to the current date

              //   placeholderText="Select a Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
      <div className="usersTotalWin">
        <h4 className="total_win_title">TOTAL WIN AMOUNT</h4>
        <div className="total_win">
          <div className="amount">&#8377; {totalWinPoints}</div>
        </div>
        <div className="money_icon">
          <img src="/UserWithdraw.png" alt="" className="withdraw_image" />
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {winDataType ? (
            <div className="winDataList">
              <ul>
                <li className="header_li">
                  <div className="header">
                    <p>MARKETS</p>
                    <p>OPEN</p>
                    <p>CLOSE</p>
                    <p>TOTAL</p>
                  </div>
                </li>

                {winDataType &&
                  winDataType.map((winData) => (
                    <li key={winData.marketkey}>
                      <div
                        className="winDataDetails"
                      >
                        <p
                          className="gameName"
                          onClick={() =>
                            handleClick(winData.marketkey, winData.marketName)
                          }
                        >
                          {winData.marketName}
                        </p>
                        <p
                          className="openTotal"
                          onClick={() =>
                            handleClick(winData.marketkey, winData.marketName)
                          }
                        >
                          {winData.openTotal}
                        </p>
                        <p
                          className="closeTotal"
                          onClick={() =>
                            handleClick(winData.marketkey, winData.marketName)
                          }
                        >
                          {winData.closeTotal}
                        </p>
                        <p
                          className="marketTotal"
                          onClick={() =>
                            handleClick(winData.marketkey, winData.marketName)
                          }
                        >
                          {winData.openTotal + winData.closeTotal}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="no-data">
              <img src="/noData.gif" alt="" className="no-data-img" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WinData;
