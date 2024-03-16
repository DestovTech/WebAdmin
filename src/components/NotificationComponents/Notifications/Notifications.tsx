import { useEffect, useState } from "react";
import { ref, get, onValue } from "firebase/database";
import { database } from "../../../firebase";
import "./Notifications.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddNotifications from "../AddNotifications/AddNotifications";

type Notification = {
  MSG: string;
  TITLE: string;
};

type NotificationType = Record<string, Notification>;

const Notifications: React.FC = () => {
  const [notificationsData, setNotificationsData] =
    useState<NotificationType | null>(null);

  const [addNotification, setAddNotification] = useState(false);

  useEffect(() => {
    const notificationsRef = ref(database, "NOTIFICATIONS/TOTAL");

    get(notificationsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setNotificationsData(snapshot.val());
      } else {
        console.log("No data available for notifications");
      }
    });

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        setNotificationsData(snapshot.val());
      } else {
        console.log("No data available for notifications");
      }
    });

    return () => unsubscribe();
  }, []);

  const getTime = (timeStamp: string) => {
    const time = new Date(parseInt(timeStamp));

    const year = time.getFullYear();
    const month = getMonthName(time.getMonth());
    const date = time.getDate().toString().padStart(2, "0");
    const hour = (time.getHours() % 12 || 12).toString().padStart(2, "0");
    const min = time.getMinutes().toString().padStart(2, "0");
    const sec = time.getSeconds().toString().padStart(2, "0");
    const meridiem = time.getHours() >= 12 ? "PM" : "AM";

    return `${date}-${month}-${year} | ${hour}:${min}:${sec} ${meridiem}`;
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

  return (
    <div className="notifications">
      {addNotification && (
        <AddNotifications setAddNotification={setAddNotification} />
      )}
      <div className="notifications_header">
        <h2>Notification</h2>
        <div
          className="add_notification"
          onClick={() => setAddNotification(!addNotification)}
        >
          <AddCircleOutlineIcon />
          <span>Send</span> Notification
        </div>
      </div>
      {notificationsData ? (
        Object.entries(notificationsData)
          .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
          .map(([timestamp, notification]) => (
            <div key={timestamp} className="notifications_container">
              <div className="notifications_title">
                <h3>{notification.TITLE}</h3>
                <p>{getTime(timestamp)}</p>
              </div>
              <p className="notifications_content">{notification.MSG}</p>
            </div>
          ))
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
    </div>
  );
};

export default Notifications;
