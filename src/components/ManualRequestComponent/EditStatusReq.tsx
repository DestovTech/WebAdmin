import { useState } from "react";
import "./ManualRequests.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { ref, remove, set, update } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "react-toastify";
import { transactionData } from "./ManualRequestGrid";

type Props = {
  timeStamp: string;
  setEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
  accept: string;
  data: transactionData | null;
};
const EditStatusReq = (props: Props) => {
  const [selectedStatus, setSelectedStatus] = useState(`${props.accept}`);

  const editStatus = async () => {
    const dateString = new Date(Number(props.timeStamp));
    const year = dateString.getFullYear();
    const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
    const date = dateString.getDate().toString().padStart(2, "0");

    const reqRef = ref(
      database,
      `MANUAL_REQUEST/DATE WISE/${year}/${month}/${date}/${props.timeStamp}`
    );

    const totalReqRef = ref(
      database,
      `MANUAL_REQUEST/TOTAL/${props.timeStamp}`
    );

    const depositRef = ref(
      database,
      `USERS TRANSACTION/${
        props.data?.phone.split("-")[0]
      }/DEPOSIT/DATE WISE/${year}/${month}/${date}/${props.timeStamp}`
    );

    const totalRef = ref(
      database,
      `USERS TRANSACTION/${props.data?.phone.split("-")[0]}/DEPOSIT/TOTAL/${
        props.timeStamp
      }`
    );

    const totalTransactionDateWiseRef = ref(
      database,
      `TOTAL TRANSACTION/DEPOSIT/DATE WISE/${year}/${month}/${date}/${props.timeStamp}`
    );

    const totalTransactionTotalRef = ref(
      database,
      `TOTAL TRANSACTION/DEPOSIT/TOTAL/${props.timeStamp}`
    );

    if (selectedStatus === props.accept) {
      return;
    } else if (selectedStatus === "reject" && props.accept !== selectedStatus) {
      await update(reqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: false,
      });

      if (
        depositRef &&
        totalRef &&
        totalTransactionDateWiseRef &&
        totalTransactionTotalRef
      ) {
        await remove(depositRef).then(() => {
          remove(totalRef);
          remove(totalTransactionDateWiseRef);
          remove(totalTransactionTotalRef);
        });
      }

      await update(totalReqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: false,
      });

      toast.success("Manual request rejected");
    } else if (selectedStatus === "true" && props.accept !== selectedStatus) {
      await update(reqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: true,
      });
      await update(totalReqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: true,
      });

      const setData = {
        AMOUNT: props.data?.amount,
        DATE: props.data?.DATE,
        NAME: `${props.data?.phone.split("-")[1]}`,
        PAYMENT_APP: props.data?.paymentApp,
        PAYMENT_BY: props.data?.paymentBy,
        PAYMENT_TO: props.data?.paymentTo,
        TOTAL: props.data?.total,
        UID: `${props.data?.phone.split("-")[0]}`,
      };

      await set(depositRef, setData);

      await set(totalRef, setData);

      await set(totalTransactionDateWiseRef, setData);

      await set(totalTransactionTotalRef, setData);

      toast.success("Payment Accepted successfully");
    } else {
      await update(reqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: false,
      });
      await update(totalReqRef, {
        ACCEPT: selectedStatus,
        MoneyAdded: false,
      });

      if (
        depositRef &&
        totalRef &&
        totalTransactionDateWiseRef &&
        totalTransactionTotalRef
      ) {
        await remove(depositRef).then(() => {
          remove(totalRef);
          remove(totalTransactionDateWiseRef);
          remove(totalTransactionTotalRef);
        });
      }
      toast.success("Status updated successfully");
    }
    props.setEditStatus(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editStatus();
  };

  return (
    <div className="edit_status">
      <div className="modal">
        <span className="close" onClick={() => props.setEditStatus(false)}>
          <ClearIcon />
        </span>
        <h2>Update Status</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={selectedStatus}
            className="status_edit_option"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="reject">REJECTED</option>
            <option value="false">PENDING</option>
            <option value="true">ACCEPTED</option>
          </select>
          <button type="submit">UPDATE</button>
        </form>
      </div>
    </div>
  );
};

export default EditStatusReq;
