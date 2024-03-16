import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import ManualRequestGrid from "./ManualRequestGrid";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";

export type ManualDataTye = {
  timestamp: string;
  ACCEPT: string;
  AMOUNT: number;
  DATE: string;
  MoneyAdded: boolean;
  NAME: string;
  PAYMENT_APP: string;
  PAYMENT_BY: string;
  PAYMENT_TO: string;
  TOTAL: number;
  UID: string;
  isFirst: boolean;
};

const ManualRequests = () => {
  const [manualData, setManualData] = useState<ManualDataTye[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedOption, setSelectedOption] = useState("false");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
        const date = selectedDate.getDate().toString().padStart(2, "0");
        const manualRef = ref(
          database,
          `MANUAL_REQUEST/DATE WISE/${year}/${month}/${date}`
        );

        const manualDataArray: ManualDataTye[] = [];

        await get(manualRef).then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((timeSnap) => {
              const timestamp = timeSnap.key;
              const timeData = timeSnap.val();
              manualDataArray.push({ timestamp, ...timeData });
            });
          }

          manualDataArray.sort((a, b) => {
            const dateA = new Date(a.DATE.replace("|", "")).getTime();
            const dateB = new Date(b.DATE.replace("|", "")).getTime();
            return dateB - dateA;
          });

          if (selectedOption !== "") {
            const filterManualReqData = manualDataArray.filter(
              (item) => item.ACCEPT === selectedOption
            );
            setManualData(filterManualReqData);
          } else {
            setManualData(manualDataArray);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [manualData, selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  if (!selectedDate) {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }

  return (
    <div className="manualReq">
      <div className="manualReq_header">
        <h2>Manual Request</h2>
        <div className="date-picker-container">
          <div className="date-pic">
            <DatePicker
              className="datePicker"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd-MMM-yyyy"
              maxDate={new Date()}
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
      <div className="manual_option">
        <div className="manual_option_input">
          <div className="filter_icon">
            <FaFilter size={18} />
          </div>
          <select
            className="select_filter_option"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" className="filter_option">
              All
            </option>
            <option value="true" className="filter_option">
              ACCEPTED
            </option>
            <option value="false" className="filter_option">
              PENDING
            </option>
            <option value="reject" className="filter_option">
              REJECTED
            </option>
          </select>
        </div>
      </div>
      {manualData ? (
        <ManualRequestGrid manualData={manualData} />
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
    </div>
  );
};

export default ManualRequests;
