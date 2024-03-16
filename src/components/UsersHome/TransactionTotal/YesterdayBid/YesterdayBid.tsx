import { get, ref } from "firebase/database";
import { useEffect } from "react";
import { database } from "../../../../firebase";
import { useUsersDataContext } from "../../UserContext";

const YesterdayBid = () => {
  const { yesterdayBid, setYesterdayBid } = useUsersDataContext();

  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const currentDate = new Date();
        const yesterdayTimestamp = currentDate.getTime() - 24 * 60 * 60 * 1000; // Subtract 1 day in milliseconds
        const yesterday = new Date(yesterdayTimestamp);

        const year = yesterday.getFullYear();
        const month = (yesterday.getMonth() + 1).toString().padStart(2, "0");
        const day = yesterday.getDate();

        let totalBidAmount = 0;

        const userRef = ref(database, "USERS");

        const usersSnapshot = await get(userRef);

        if (usersSnapshot.exists()) {
          const promises: Promise<void>[] = [];

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            const bidRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/BID/DATE WISE/${year}/${month}/${day}`
            );

            const promise = get(bidRef).then((bidSnapshot) => {
              if (bidSnapshot.exists()) {
                bidSnapshot.forEach((gameKey) => {
                  gameKey.forEach((timeSnap) => {
                    const amount = timeSnap.child("POINTS").val() as number;

                    totalBidAmount += amount;
                  });
                });
              }
            });
            promises.push(promise);
          });
          await Promise.all(promises);
          setYesterdayBid(totalBidAmount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBidData();
  }, []);

  return (
    <div className="total_balance_container">
      <h4 className="total_balance_title yesterday">YESTERDAY'S BID</h4>
      <div className="total_balance ">
        <div className="amount yesterDay_deposit">&#8377; {yesterdayBid}</div>
      </div>
      <div className="money_icon">
        <img src="/auction1.svg" alt="" />
      </div>
    </div>
  );
};

export default YesterdayBid;
