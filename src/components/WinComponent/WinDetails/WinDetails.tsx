import { useEffect, useState } from "react";
import "./WinDetails.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import WinDEtailsGrid from "./WinDEtailsGrid";
import { useNavigate } from "react-router-dom";
import { useBidComponentContext } from "../../BidComponent/BidComponentContext";
import { FaFilter } from "react-icons/fa6";

export interface WinDetailsType {
  date: string;
  phoneNumber: string;
  userName: string;
  gameName: string;
  openClose: string;
  number: string;
  previousPoints: number;
  newPoints: number;
  bidAmount: string;
  winPoints: number;
}

const WinDetails: React.FC<{ gameId: string }> = ({ gameId }) => {
  const [winDetails, setWinDetails] = useState<WinDetailsType[] | null>(null);
  const [marketName, setMarketName] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  const { selectedWinDate } = useBidComponentContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinDetails = async () => {
      const gameActualKey = gameId.split("___")[0];
      setMarketName(gameId.split("___")[1]);

      const currentYear = selectedWinDate.getFullYear();
      const currentMonth = (selectedWinDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = selectedWinDate.getDate().toString().padStart(2, "0");

      try {
        const winRef = ref(
          database,
          `TOTAL TRANSACTION/WIN/DATE WISE/${currentYear}/${currentMonth}/${currentDay}/${gameActualKey}`
        );

        const winData: WinDetailsType[] = [];

        const winSnapshot = await get(winRef);

        winSnapshot.forEach((timestamp) => {
          winData.push({
            date: timestamp.val().DATE,
            phoneNumber: timestamp.val().PHONE,
            userName: timestamp.val().NAME,
            gameName: timestamp.val().TYPE,
            openClose: timestamp.val().OPEN_CLOSE,
            number: timestamp.val().NUMBER,
            previousPoints: timestamp.val().PREVIOUS_POINTS,
            newPoints: timestamp.val().NEW_POINTS,
            bidAmount: timestamp.val().POINTS,
            winPoints: timestamp.val().WIN_POINTS,
          });
        });

        winData.sort((a, b) => {
          const dateA = new Date(a.date.replace("|", "")).getTime();
          const dateB = new Date(b.date.replace("|", "")).getTime();
          if (dateA === dateB) {
            return b.previousPoints - a.previousPoints;
          }

          return dateB - dateA;
        });

        if (selectedOption !== "") {
          const filterWinDetails = winData.filter(
            (item) => item.openClose === selectedOption
          );

          let totalPoint = 0;
          filterWinDetails.map((data) => {
            totalPoint += data.winPoints;
          });

          setTotalPoints(totalPoint);

          setWinDetails(filterWinDetails);
        } else {
          let totalPoint = 0;
          winData.map((data) => {
            totalPoint += data.winPoints;
          });

          setTotalPoints(totalPoint);

          setWinDetails(winData);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchWinDetails();
  }, [gameId, selectedOption]);

  const handleBackClick = () => {
    // Navigate back to the main page with the selected date
    navigate(`/win`);
  };

  return (
    <div>
      <button className="back_button" onClick={handleBackClick}>
        &lt; back
      </button>
      <div className="win_header">
        <h2>{marketName}</h2>
        <h4>Total - &#8377; {totalPoints}</h4>
      </div>
      <div className="filter_option_input">
        <div className="filter_icon">
          <FaFilter size={18} />
        </div>
        <select
          value={selectedOption}
          className="select_filter_option"
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="" className="filter_option">
            ALL
          </option>
          <option value="OPEN" className="filter_option">
            OPEN
          </option>
          <option value="CLOSE" className="filter_option">
            CLOSE
          </option>
        </select>
      </div>
      {winDetails && <WinDEtailsGrid winDetails={winDetails} />}
    </div>
  );
};

export default WinDetails;
