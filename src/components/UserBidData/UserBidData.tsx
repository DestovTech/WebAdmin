import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import UserBidGrid from "./UserBidGrid";

export interface UserBid {
  userPhone: string;
  DATE: string;
  MARKET_NAME: string;
  NAME: string;
  NUMBER: string;
  OPEN_CLOSE: string;
  POINTS: number;
  PREVIOUS_POINTS: number;
  TYPE: string;
  UID: string;
}

interface BidData {
  DATE: string;
  MARKET_NAME: string;
  NAME: string;
  NUMBER: string;
  OPEN_CLOSE: string;
  POINTS: number;
  PREVIOUS_POINTS: number;
  TYPE: string;
  UID: string;
}

const UserBidData = () => {
  const [bidData, setBidData] = useState<UserBid[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchBidData = async () => {
      const currentYear = selectedDate.getFullYear();
      const currentMonth = (selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const currentDate = selectedDate.getDate();

      const userRef = ref(database, "USERS");

      try {
        const usersSnapshot = await get(userRef);

        if (usersSnapshot.exists()) {
          const promises: Promise<void>[] = [];
          const bidDataArray: UserBid[] = [];

          usersSnapshot.forEach((userSnapshot) => {
            const userPhone = userSnapshot.key;
            const bidRef = ref(
              database,
              `USERS TRANSACTION/${userPhone}/BID/DATE WISE/${currentYear}/${currentMonth}/${currentDate}`
            );

            const promise = get(bidRef).then((bidSnapshot) => {
              if (bidSnapshot.exists()) {
                bidSnapshot.forEach((gameKey) => {
                  gameKey.forEach((timeSnap) => {
                    const timeData = timeSnap.val() as BidData;
                    bidDataArray.push({
                      userPhone,
                      ...timeData,
                    });
                  });
                });
              }
            });
            promises.push(promise);
          });
          await Promise.all(promises);
          setBidData(bidDataArray);
        } else {
          console.log("No users available in the database");
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchBidData();
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  return (
    <div className="usersDeposit">
      <div className="usersDeposit_title">
        <h2>Bid </h2>
        <MonetizationOnRoundedIcon
          style={{ fontSize: "1.6rem" }}
          className="transaction_icon"
        />
      </div>
      <div className="date-picker-container">
        <div className="date-pic">
          <DatePicker
            className="datePicker"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd-MMM-yyyy"
            //   placeholderText="Select a Date"
          />
          <div className="calendar">
            <FaCalendarAlt />
          </div>
        </div>
      </div>
      <div>
        <UserBidGrid bidData={bidData} />
      </div>
    </div>
  );
};

export default UserBidData;
