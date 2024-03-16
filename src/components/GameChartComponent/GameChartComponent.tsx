import { useEffect, useState } from "react";
import "./GameChart.scss";
import { onValue, ref, update } from "firebase/database";
import { database } from "../../firebase";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

type Props = {
  marketId: string;
};

type resultData = {
  [timestamp: string]: {
    CLOSE: string;
    MID: string;
    OPEN: string;
  };
};

const GameChartComponent = ({ marketId }: Props) => {
  const [resultData, setResultData] = useState<resultData>({});
  const [Loading, setIsLoading] = useState(true);

  const previousDate = Date.now() - 90 * 24 * 60 * 60 * 1000;

  const convertToDate = (timestamp: number) => {
    if (timestamp) {
      const dateString = new Date(Number(timestamp));

      const date = dateString.getDate().toString().padStart(2, "0");
      const month = getMonthName(dateString.getMonth());
      const year = dateString.getFullYear();
      const hour = (dateString.getHours() % 12 || 12)
        .toString()
        .padStart(2, "0");
      const min = dateString.getMinutes().toString().padStart(2, "0");
      const meridiem = dateString.getHours() >= 12 ? "PM" : "AM";
      const sec = dateString.getSeconds().toString().padStart(2, "0");

      return `${date}-${month}-${year} | ${hour}:${min}:${sec} ${meridiem}`;
    }
  };

  function getMonthName(monthIndex: number): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  }

  useEffect(() => {
    try {
      const gameRef = ref(database, `GAME CHART/${marketId.split("___")[1]}`);

      const unsub = onValue(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((timeSnap) => {
            if (Number(timeSnap.key) >= previousDate) {
              const timestamp = timeSnap.key;
              const OPEN = timeSnap.val().OPEN;
              const MID = timeSnap.val().MID;
              const CLOSE = timeSnap.val().CLOSE;
              setResultData((prevResultData) => ({
                ...prevResultData,
                [timestamp]: {
                  OPEN,
                  MID,
                  CLOSE,
                },
              }));
            }
          });
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const downloadJson = () => {
    const jsonData = JSON.stringify(resultData);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game_chart_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    try {
      // Load the JSON file from the public folder
      const response = await fetch("/game_chart_data.json");
      const jsonData = await response.json();

      // Create a new node in the database
      const newUploadRef = ref(
        database,
        `GAME CHART/${marketId.split("___")[1]}`
      );

      // Upload the JSON data to the new node
      await update(newUploadRef, jsonData);

      toast.success("Data uploaded");

      console.log("JSON data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading JSON data:", error);
    }
  };

  return (
    <div className="gameChart">
      {Loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="gameChart_container">
            {resultData &&
              Object.entries(resultData).map(([timestamp, result]) => (
                <div className="gameChart_data" key={timestamp}>
                  <div className="gameChart_date">
                    {convertToDate(Number(timestamp))?.split("|")[0]}
                  </div>
                  <div className="border"></div>
                  <div className="gameChart_result">
                    {result.OPEN}-{result.MID}-{result.CLOSE}
                  </div>
                </div>
              ))}
          </div>

          <div className="buttons-download">
            <CSVLink
              data={Object.entries(resultData)}
              filename={"game_chart_data.csv"}
              className="download_button"
            >
              <button>Download CSV</button>
            </CSVLink>

            <button onClick={downloadJson}>Download JSON</button>
            <button onClick={handleUpload}>Upload Data</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameChartComponent;
