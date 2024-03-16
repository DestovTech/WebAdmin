import { Fragment, useEffect, useState } from "react";
import "./MarketBidDetails.scss";
import { get, ref } from "firebase/database";
import { database } from "../../../firebase";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { useBidComponentContext } from "../BidComponentContext";
import { useNavigate } from "react-router-dom";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import RelatedUserDetails from "./RelatedUserDetails/RelatedUserDetails";
// import EditorModal from "./EditorModal";

export interface MarketDetailsType {
  marketName: string;
  numbers: { [number: string]: number };
  marketTotalPoints: number;
}

export type UserDetailsType = {
  phoneNumber: string;
  points: number;
  userName: string;
};

export type ClickPosition = {
  x: number;
  y: number;
};

const currentFormattedDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");
  const hours = (currentDate.getHours() % 12 || 12).toString().padStart(2, "0");
  const min = currentDate.getMinutes().toString().padStart(2, "0");
  const sec = currentDate.getSeconds().toString().padStart(2, "0");
  const meridiem = currentDate.getHours() >= 12 ? "PM" : "AM";

  return `${date}-${month}-${year} | ${hours}:${min}:${sec} ${meridiem}`;
};

const MarketbidDetails: React.FC<{ gameKey: string }> = ({ gameKey }) => {
  const { bidDetails, setbidDetails } = useBidComponentContext();
  const [userDetails, setUserDetails] = useState<UserDetailsType[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameName, setGameName] = useState("");
  const [clickedNumber, setClickedNumber] = useState(false);
  const [formattedText, setFormattedText] = useState<any>(""); // Declare formattedText as state
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [bidNumber, setBidNumber] = useState<number>();

  // In the parent component where you declare state for click position
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null
  );

  const { selectedBidDate } = useBidComponentContext();

  useEffect(() => {
    const fetchbidDetails = async () => {
      const gameActualKey = gameKey.split("___")[1];
      const openClose = gameKey.split("___")[0];

      setGameName(gameKey.split("___")[2]);

      //   const date = gameKey.split("___")[3];

      const currentYear = selectedBidDate.getFullYear();
      const currentMonth = (selectedBidDate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Ensure two digits
      const currentDay = selectedBidDate.getDate().toString().padStart(2, "0");

      try {
        const bidRef = ref(
          database,
          `TOTAL TRANSACTION/BIDS/${currentYear}/${currentMonth}/${currentDay}/${gameActualKey}/${openClose}`
        );

        const marketDetails: MarketDetailsType[] = [];
        let totalPoint = 0;

        const bidSnapshot = await get(bidRef);

        bidSnapshot.forEach((bidsnapshot) => {
          const marketName = bidsnapshot.key || "";
          const numbers: { [number: string]: number } = {};
          let marketTotalPoints = 0;

          bidsnapshot.forEach((numberSnapshot) => {
            const number = numberSnapshot.key;
            const points = numberSnapshot.val().POINTS || 0;

            totalPoint += points;
            marketTotalPoints += points;

            numbers[number] = points;
          });

          marketDetails.push({
            marketName,
            numbers,
            marketTotalPoints,
          });
        });

        // Define the order for sorting
        const sortOrder = [
          "Single Digit",
          "Jodi Digit",
          "Single Panel",
          "Double Panel",
          "Triple Panel",
          "Half Sangam",
          "Full Sangam",
        ];

        // Sort the marketDetails array based on the sortOrder
        marketDetails.sort(
          (a, b) =>
            sortOrder.indexOf(a.marketName) - sortOrder.indexOf(b.marketName)
        );

        setbidDetails(marketDetails);
        setTotalPoints(totalPoint);

        // const marketsnapshot =
      } catch (err) {
        console.log(err);
      }
    };
    fetchbidDetails();
  }, [gameKey]);

  //   console.log(bidDetails);

  const handleColumnClick = async (
    event: React.MouseEvent,
    row: any,
    columnName: string
  ) => {
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left + window.scrollX; // Adjust for horizontal scroll
      const y = event.clientY - rect.top + window.scrollY;
      const gameActualKey = gameKey.split("___")[1];
      const openClose = gameKey.split("___")[0];
      const currentYear = selectedBidDate.getFullYear();
      const currentMonth = (selectedBidDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDay = selectedBidDate.getDate().toString().padStart(2, "0");

      const bidRef = ref(
        database,
        `TOTAL TRANSACTION/BIDS/${currentYear}/${currentMonth}/${currentDay}/${gameActualKey}/${openClose}/${columnName}/${
          row[columnName].split(" = ")[0]
        }/USERS`
      );

      setBidNumber(row[columnName].split(" = ")[0]);

      const usersSnapshot = await get(bidRef);

      const usersList: UserDetailsType[] = [];
      const promises: Promise<void>[] = [];

      usersSnapshot.forEach((userSnapshot) => {
        let userName = "";

        const phoneNumber = userSnapshot.key;
        const points = userSnapshot.val();

        const userRef = ref(database, `USERS/${phoneNumber}`);

        const promise = get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            userName = snapshot.val().NAME;
          }
          usersList.push({ phoneNumber, points, userName });
        });
        promises.push(promise);
      });

      await Promise.all(promises);
      setClickedNumber(!clickedNumber);
      setUserDetails(usersList);
      setClickPosition({ x, y });
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleCopyToClipboard = async () => {
    // Construct the formatted text
    let newFormattedText = `✦ ${gameName} (${
      gameKey.split("___")[0]
    }) : ${totalPoints} ₹ ✦\n\nDate : ${currentFormattedDate()}\n\n`;

    const gameTypes = [
      "Single Digit",
      "Jodi Digit",
      "Single Panel",
      "Double Panel",
      "Triple Panel",
      "Half Sangam",
      "Full Sangam",
    ];

    gameTypes.forEach((type) => {
      const gameDetails = bidDetails.find(
        (detail) => detail.marketName === type
      );

      if (gameDetails) {
        newFormattedText += `${type} : ${gameDetails.marketTotalPoints} ₹\n`;
      }
    });

    gameTypes.forEach((type) => {
      const gameDetails = bidDetails.find(
        (detail) => detail.marketName === type
      );

      if (gameDetails) {
        newFormattedText += `\n✦ ${type} ✦\n\n`;
        Object.entries(gameDetails.numbers).forEach(([number, points]) => {
          newFormattedText += `${number}=${points} ₹\n`;
        });
        newFormattedText += `--------------------\nTotal = ${gameDetails.marketTotalPoints}\n--------------------\n\n`;
      }
    });

    // Update the state
    setFormattedText(newFormattedText);

    try {
      // Use the updated state value directly inside the writeText callback
      await navigator.clipboard.writeText(newFormattedText);
      // Provide feedback to the user, e.g., toast message
      alert("Copied to clipboard!");
      //   console.log(formattedText);
      toggleEditor();
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  console.log(formattedText);

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 70 },
    ...bidDetails.map((market) => ({
      field: market.marketName,
      headerName: market.marketName,
      width: 134,
      renderCell: (params: GridCellParams) => (
        <div
          onClick={(event) =>
            handleColumnClick(event, params.row, market.marketName)
          }
          style={{ cursor: "pointer" }}
        >
          {params.row[market.marketName]
            .split("=")
            .map((item: any, index: any) => (
              <Fragment key={index}>
                {index === 0 ? (
                  <span className="bold">{item.trim()} </span>
                ) : (
                  <span>= {item.trim()}</span>
                )}
              </Fragment>
            ))}
        </div>
      ),
    })),
  ];

  const rows = Array.from(
    {
      length: Math.max(
        ...bidDetails.map((market) => Object.keys(market.numbers).length)
      ),
    },
    (_, index) => ({
      id: index + 1,
      ...bidDetails.reduce(
        (acc, market) => ({
          ...acc,
          [market.marketName]: Object.entries(market.numbers)[index]
            ? `${Object.entries(market.numbers)[index][0]} = ${
                Object.entries(market.numbers)[index][1]
              } ₹`
            : "", // Display "number = points ₹" only if both number and points exist
        }),
        {}
      ),
    })
  );

  const navigate = useNavigate();

  const handleBackClick = () => {
    // Navigate back to the main page with the selected date
    navigate(`/bid`);
  };

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  console.log(clickPosition);

  return (
    <div className="dataTable_deposit">
      {clickedNumber && (
        <RelatedUserDetails
          userDetails={userDetails}
          setClickedNumber={setClickedNumber}
          bidNumber={bidNumber}
          clickPosition={clickPosition}
        />
      )}
      <button className="back_button" onClick={handleBackClick}>
        &lt; back
      </button>
      <div className="bid_header">
        <h2>
          {gameName} <span>({gameKey.split("___")[0]})</span>
        </h2>
      </div>

      <div className="particular_game_data">
        <div className="game_data_title">
          <h3>Game Amount</h3>
          <MonetizationOnRoundedIcon className="transaction_icon" />
        </div>

        {bidDetails &&
          bidDetails.map((bid) => (
            <div key={bid.marketName} className="particular_game_data_list">
              <div className="particular_game_data_name">{bid.marketName}</div>
              <div className="particular_game_data_amount">
                {bid.marketTotalPoints} &#8377;
              </div>
            </div>
          ))}

        <div className="particular_game_data_list total_points">
          <div className="particular_game_data_name total">Total</div>
          <div className="particular_game_data_amount">
            {totalPoints} &#8377;
          </div>
        </div>

        <button className="copy_button" onClick={handleCopyToClipboard}>
          Copy
        </button>
      </div>

      {bidDetails ? (
        <DataGrid
          className="dataGrid_deposit"
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          //   pageSizeOptions={[15]}
          // checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
    </div>
  );
};
export default MarketbidDetails;
