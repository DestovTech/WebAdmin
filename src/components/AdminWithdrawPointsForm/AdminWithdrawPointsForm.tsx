import { useState } from "react";
import { get, ref, set, update } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import "./AdminWithdrawPointsForm.scss";
import { useAuth } from "../auth-context";
import { usePermissionContext } from "../AdmissionPermission";

interface AdminPointsData {
  phoneNumber: string;
  amount: number;
}

type Props = {
  phoneNumber: string;
  setWithdrawPointsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminWithdrawPointsForm = (props: Props) => {
  const [formData, setFormData] = useState<AdminPointsData>({
    phoneNumber: props.phoneNumber,
    amount: 0,
  });

  const [modalOpen, setIsModalOpen] = useState(true);

  const withdrawPoints = async (data: AdminPointsData) => {
    const { phoneNumber, amount } = data;

    if (amount >= 0 && phoneNumber) {
      try {
        const userRef = ref(database, `USERS/${phoneNumber}`);

        const snapshot = await get(userRef);
        const currentAmount = snapshot.val()?.AMOUNT || 0;
        const username = snapshot.val()?.NAME || "";

        const newTotal = currentAmount - amount;

        if (newTotal < 0) {
          toast.error("Insufficient points");
          return;
        }

        await update(userRef, { AMOUNT: newTotal });

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

        const withdrawRef = ref(
          database,
          `USERS TRANSACTION/${phoneNumber}/WITHDRAW/DATE WISE/${year}/${month}/${day}/${timestamp}`
        );

        const totalRef = ref(
          database,
          `USERS TRANSACTION/${phoneNumber}/WITHDRAW/TOTAL/${timestamp}`
        );

        const totalTransactionDateWiseRef = ref(
          database,
          `TOTAL TRANSACTION/WITHDRAW/DATE WISE/${year}/${month}/${day}/${timestamp}`
        );

        const totalTransactionTotalRef = ref(
          database,
          `TOTAL TRANSACTION/WITHDRAW//TOTAL/${timestamp}`
        );

        await set(withdrawRef, {
          AMOUNT: amount,
          APP: "Admin",
          DATE: date,
          NAME: username,
          PAYOUT_TO: "Admin",
          PENDING: "false",
          TOTAL: newTotal,
          TYPE: "Admin",
          UID: phoneNumber,
        });

        await set(totalRef, {
          AMOUNT: amount,
          APP: "Admin",
          DATE: date,
          NAME: username,
          PAYOUT_TO: "Admin",
          PENDING: "false",
          TOTAL: newTotal,
          TYPE: "Admin",
          UID: phoneNumber,
        });

        await set(totalTransactionDateWiseRef, {
          AMOUNT: amount,
          APP: "Admin",
          DATE: date,
          NAME: username,
          PAYOUT_TO: "Admin",
          PENDING: "false",
          TOTAL: newTotal,
          TYPE: "Admin",
          UID: phoneNumber,
        });

        await set(totalTransactionTotalRef, {
          AMOUNT: amount,
          APP: "Admin",
          DATE: date,
          NAME: username,
          PAYOUT_TO: "Admin",
          PENDING: "false",
          TOTAL: newTotal,
          TYPE: "Admin",
          UID: phoneNumber,
        });

        props.setWithdrawPointsFormVisible(false);
        toast.success("Points withdraw successfully!");
      } catch (error) {
        console.error("Error adding points:", error);
      }
    } else if (amount === 0 && phoneNumber) {
      props.setWithdrawPointsFormVisible(false);
      return;
    } else {
      toast.error("All field are required to fill");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
    props.setWithdrawPointsFormVisible(false);
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
    withdrawPoints(formData);
  };

  const { isAuthenticated, isSubAuthenticated } = useAuth();
  const { permissions } = usePermissionContext();

  return (
    <div className={`add ${modalOpen ? "" : "closed"}`}>
      {isAuthenticated ||
      (isSubAuthenticated && permissions?.USERS_WITHDRAW) ? (
        <div className="modal">
          <span className="close" onClick={toggleModal}>
            <ClearIcon />
          </span>
          <div className="title-card">
            Withdraw Points{" "}
            <span>
              <img
                src="/assets/withdrawal.png"
                alt=""
                className="withdraw_img"
              />
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                inputMode="numeric"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            {/* <div className="item">
            <label>App</label>
            <input
              type="text"
              name="app"
              placeholder="App"
              value={formData.app}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label>Payout To</label>
            <input
              type="text"
              name="payout_to"
              placeholder="Payout to"
              value={formData.payout_to}
              onChange={handleChange}
            />
          </div>

          <div className="item">
            <label>Type</label>
            <input
              type="text"
              name="type"
              placeholder="Type"
              value={formData.type}
              onChange={handleChange}
            />
          </div> */}
            <button className="withdraw-btn" type="submit">
              Withdraw Points
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

export default AdminWithdrawPointsForm;
