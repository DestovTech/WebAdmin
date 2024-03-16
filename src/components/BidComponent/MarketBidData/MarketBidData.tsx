import { useEffect, useState } from "react";
import "./MarketBidData.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { useBidComponentContext } from "../BidComponentContext";

type BidDataType = {
  gameKey: string;
  gameName: string;
  openTotal: number;
  closeTotal: number;
};

const MarketBidData = () => {
  const [bidDataType, setBidDataType] = useState<BidDataType[] | null>(null);
  const { selectedBidDate, setSelectedBidDate } = useBidComponentContext();
  const [totalBidPoints, setTotalBidPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarketData = async () => {
      const currentYear = selectedBidDate.getFullYear();
      const currentMonth = (selectedBidDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = selectedBidDate.getDate().toString().padStart(2, "0");

      try {
        const gamesRef = ref(database, "GAMES");

        const marketSnapshot = await get(gamesRef);

        const gameRef = ref(
          database,
          `TOTAL TRANSACTION/BIDS/${currentYear}/${currentMonth}/${currentDay}`
        );

        const gameSnapshot = await get(gameRef);

        if (gameSnapshot.exists()) {
          const bidData: BidDataType[] = [];
          let totalBidPoint = 0;

          gameSnapshot.forEach((gamesnapshot) => {
            const marketKey = gamesnapshot.key;
            const marketName: string[] = [];

            marketSnapshot.forEach((marketsnapshot) => {
              if (marketKey === marketsnapshot.key) {
                marketName.push(marketsnapshot.val().NAME);
              }
            });

            const calculateTotalPoints = (snapshot: any) => {
              let totalPoints: number = 0;

              if (snapshot.exists()) {
                snapshot.forEach((gameTypeSnapshot: any) => {
                  gameTypeSnapshot.forEach((numberSnapshot: any) => {
                    numberSnapshot
                      .child("USERS")
                      .forEach((userSnapshot: any) => {
                        totalPoints += userSnapshot.val() || 0;
                      });
                  });
                });
              }

              return totalPoints;
            };

            const totalPointsOpen = calculateTotalPoints(
              gamesnapshot.child("OPEN")
            );
            const totalPointsClose = calculateTotalPoints(
              gamesnapshot.child("CLOSE")
            );

            totalBidPoint += totalPointsClose + totalPointsOpen;

            bidData.push({
              gameKey: marketKey,
              gameName: marketName.join(", "), // Concatenate game names into a string
              openTotal: totalPointsOpen,
              closeTotal: totalPointsClose,
            });
            setTotalBidPoints(totalBidPoint);
            setBidDataType(bidData);
          });
        } else {
          setBidDataType(null);
          setTotalBidPoints(0);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedBidDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedBidDate(newDate);
  };

  if (!selectedBidDate) {
    const currentDate = new Date();
    setSelectedBidDate(currentDate);
  }

  const handleOpenClick = (gamekey: string, gamename: string) => {
    navigate(`/bid/OPEN___${gamekey}___${gamename}`);
  };

  const handleCloseClick = (gamekey: string, gamename: string) => {
    navigate(`/bid/CLOSE___${gamekey}___${gamename}`);
  };

  return (
    <div className="bidData">
      <div className="bidData_header">
        <h2>Bid Data</h2>
        <div className="date-picker-container">
          <div className="date-pic">
            <DatePicker
              className="datePicker"
              selected={selectedBidDate}
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
      <div className="usersTotalBid">
        <h4 className="total_bid_title">TOTAL BID AMOUNT</h4>
        <div className="total_bid">
          <div className="amount">&#8377; {totalBidPoints}</div>
        </div>
        <div className="money_icon">
          <img src="/UserDeposit.png" alt="" className="deposit_image" />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : bidDataType ? (
        <div className="bidDataList">
          <ul>
            {bidDataType && (
              <li className="header_li">
                <div className="header">
                  <p>MARKETS</p>
                  <p>OPEN</p>
                  <p>CLOSE</p>
                  <p>TOTAL</p>
                </div>
              </li>
            )}

            {bidDataType &&
              bidDataType.map((bidData) => (
                <li key={bidData.gameKey}>
                  <div className="bidDataDetails">
                    <p className="gameName">{bidData.gameName}</p>
                    <p
                      className="openTotal"
                      onClick={() =>
                        handleOpenClick(bidData.gameKey, bidData.gameName)
                      }
                    >
                      {bidData.openTotal}
                    </p>
                    <p
                      className="closeTotal"
                      onClick={() =>
                        handleCloseClick(bidData.gameKey, bidData.gameName)
                      }
                    >
                      {bidData.closeTotal}
                    </p>
                    <p className="marketTotal">
                      {bidData.openTotal + bidData.closeTotal}
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
  );
};

export default MarketBidData;
