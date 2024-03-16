import { useEffect, useState } from "react";
import "./GameChart.scss";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

type MarketListType = {
  marketName: string;
  marketId: string;
  resultExists: boolean;
};

const MarketChart = () => {
  const [marketList, setMarketList] = useState<MarketListType[] | null>(null);
  const [Loading, setIsLoading] = useState(true);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate();

  useEffect(() => {
    try {
      const marketRef = ref(database, "RESULTS");

      const fetchMarketData = async () => {
        const marketListArray: MarketListType[] = [];
        const promises: Promise<void>[] = [];

        const snapshot = await get(marketRef);

        if (snapshot.exists()) {
          snapshot.forEach((game) => {
            const marketId = game.key;

            const gameNameRef = ref(database, `GAMES/${marketId}/NAME`);
            const resultRef = ref(
              database,
              `RESULTS/${marketId}/${year}/${month}/${day}`
            );

            const promise = Promise.all([
              get(gameNameRef),
              get(resultRef),
            ]).then(([nameSnapshot, resultSnapshot]: any) => {
              if (nameSnapshot.exists()) {
                const marketName = nameSnapshot.val();
                const resultExists = resultSnapshot.exists();

                marketListArray.push({
                  marketName,
                  marketId,
                  resultExists,
                });

                // Sort the array based on whether the result exists
                marketListArray.sort((a, b) => {
                  if (a.resultExists && !b.resultExists) return -1;
                  else if (!a.resultExists && b.resultExists) return 1;
                  else return 0;
                });
              }
            });

            promises.push(promise);
          });
        }
        await Promise.all(promises);
        setMarketList(marketListArray);
      };

      fetchMarketData();

      // When all promises are resolved, set the loading state to false
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [year, month, day]);

  const navigate = useNavigate();

  const handleClick = (marketId: string) => {
    navigate(`gameChartResult___${marketId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="marketChart">
      <h3>Select Market</h3>

      {Loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ul>
          {marketList &&
            marketList.map((market) => (
              <div
                className="marketData"
                key={market.marketId}
                onClick={() => handleClick(market.marketId)}
              >
                <li>
                  <span>{market.marketName}</span>
                  <span>
                    <ArrowForwardIosIcon className="market_icon" />
                  </span>
                </li>
              </div>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MarketChart;
