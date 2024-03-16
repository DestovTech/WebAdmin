import React, { useState } from "react";
import { database } from "../../firebase";
import { get, ref, set, update } from "firebase/database";
import ClearIcon from "@mui/icons-material/Clear";
import "./AdminAddPointsForm.scss";
import { toast } from "react-toastify";
import { useAuth } from "../auth-context";
import { usePermissionContext } from "../AdmissionPermission";

interface AdminPointsData {
  phoneNumber: string;
  amount: number;
}

type Props = {
  phoneNumber: string;
  setAddPointsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminAddPointsForm = (props: Props) => {
  const [formData, setFormData] = useState<AdminPointsData>({
    phoneNumber: props.phoneNumber,
    amount: 0,
  });

  const [modalOpen, setIsModalOpen] = useState(true);

  const addPoints = async (data: AdminPointsData) => {
    const { phoneNumber, amount } = data;

    // Get the current total amount and user name from the database
    if (amount >= 0 && phoneNumber) {
      const userRef = ref(database, `USERS/${phoneNumber}`);
      try {
        const snapshot = await get(userRef);
        const currentAmount = snapshot.val()?.AMOUNT || 0;
        const userName = snapshot.val()?.NAME || "";

        // Calculate the new total amount
        const newTotal = currentAmount + amount;

        // Update the total amount and name for the user
        await update(userRef, { AMOUNT: newTotal });

        // Add points to the deposit transactions
        const timestamp = Date.now();

        const convertTimestamp = (timestamp: number) => {
          const dateObj = new Date(timestamp);

          const day = dateObj.getDate().toString().padStart(2, "0");
          const month = getMonthName(dateObj.getMonth());
          const year = dateObj.getFullYear();
          const hours = dateObj.getHours();
          const minutes = dateObj.getMinutes().toString().padStart(2, "0");
          const seconds = dateObj.getSeconds().toString().padStart(2, "0");
          const meridiem = hours >= 12 ? "PM" : "AM";
          const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

          return `${day}-${month}-${year} | ${formattedHours}:${minutes}:${seconds} ${meridiem}`;
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

        const date = convertTimestamp(timestamp);

        const year = new Date(timestamp).getFullYear();
        const month = (new Date(timestamp).getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const day = new Date(timestamp).getDate();

        const depositRef = ref(
          database,
          `USERS TRANSACTION/${phoneNumber}/DEPOSIT/DATE WISE/${year}/${month}/${day}/${timestamp}`
        );

        const totalRef = ref(
          database,
          `USERS TRANSACTION/${phoneNumber}/DEPOSIT/TOTAL/${timestamp}`
        );

        const totalTransactionDateWiseRef = ref(
          database,
          `TOTAL TRANSACTION/DEPOSIT/DATE WISE/${year}/${month}/${day}/${timestamp}`
        );

        const totalTransactionTotalRef = ref(
          database,
          `TOTAL TRANSACTION/DEPOSIT/TOTAL/${timestamp}`
        );

        await set(depositRef, {
          AMOUNT: amount,
          DATE: date,
          NAME: userName,
          PAYMENT_APP: "Admin",
          PAYMENT_BY: "Admin",
          PAYMENT_TO: "Admin",
          TOTAL: newTotal,
          UID: phoneNumber,
        });

        await set(totalRef, {
          AMOUNT: amount,
          DATE: date,
          NAME: userName,
          PAYMENT_APP: "Admin",
          PAYMENT_BY: "Admin",
          PAYMENT_TO: "Admin",
          TOTAL: newTotal,
          UID: phoneNumber,
        });

        await set(totalTransactionDateWiseRef, {
          AMOUNT: amount,
          DATE: date,
          NAME: userName,
          PAYMENT_APP: "Admin",
          PAYMENT_BY: "Admin",
          PAYMENT_TO: "Admin",
          TOTAL: newTotal,
          UID: phoneNumber,
        });

        await set(totalTransactionTotalRef, {
          AMOUNT: amount,
          DATE: date,
          NAME: userName,
          PAYMENT_APP: "Admin",
          PAYMENT_BY: "Admin",
          PAYMENT_TO: "Admin",
          TOTAL: newTotal,
          UID: phoneNumber,
        });

        props.setAddPointsFormVisible(false);

        toast.success("Points added successfully!");
      } catch (error) {
        console.error("Error adding points:", error);
      }
    } else if (amount === 0 && phoneNumber) {
      props.setAddPointsFormVisible(false);
      return;
    } else {
      toast.error("All field are required to fill");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
    props.setAddPointsFormVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPoints(formData);
  };

  const { isAuthenticated, isSubAuthenticated } = useAuth();
  const { permissions } = usePermissionContext();

  return (
    <div className={`add ${modalOpen ? "" : "closed"}`}>
      {isAuthenticated || (isSubAuthenticated && permissions?.USERS_DEPOSIT) ? (
        <div className="modal">
          <span className="close" onClick={toggleModal}>
            <ClearIcon />
          </span>
          <h1>
            Add Points
            <span className="addNew">
              <img
                src="/assets/add-new.png"
                alt="Add New"
                className="add-new_img"
              />
            </span>
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="Amount"
              />
            </div>
            {/* <div className="item">
            <label htmlFor="paymentApp">Payment App</label>
            <input
              type="text"
              name="paymentApp"
              value={formData.paymentApp}
              onChange={handleChange}
              placeholder="Payment App"
            />
          </div>
          <div className="item">
            <label htmlFor="paymentBy">Payment By</label>
            <input
              type="text"
              name="paymentBy"
              value={formData.paymentBy}
              onChange={handleChange}
              placeholder="Payment By"
            />
          </div>
          <div className="item">
            <label htmlFor="paymentTo">Payment To</label>
            <input
              type="text"
              name="paymentTo"
              value={formData.paymentTo}
              onChange={handleChange}
              placeholder="Payment To"
            />
          </div> */}
            <button className="add-btn" type="submit">
              Add Points
            </button>
          </form>
        </div>
      ) : (
        <div>
          <span className="close-permission" onClick={toggleModal}>
            <ClearIcon />
          </span>
          <p>Sorry, No access to add points !!!</p>
        </div>
      )}
    </div>
  );
};

export default AdminAddPointsForm;
