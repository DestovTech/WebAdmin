import { useEffect, useRef } from "react";
import { ClickPosition } from "../../../GamesMarket/GamesDetails/GamesDataGrid";
import "./EditWithdrawStatus.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { ref, update } from "firebase/database";
import { database } from "../../../../firebase";
import { toast } from "react-toastify";

type Props = {
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
  date: string;
  phone: string;
  clickPosition: ClickPosition | null;
};

const EditWithdrawStatus = ({
  setPending,
  date,
  phone,
  clickPosition,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Update the position of the modal when clickPosition changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.left = `${clickPosition?.x}px`;
      modalRef.current.style.top = `${clickPosition?.y}px`;
    }
  }, [clickPosition]);

  const dateString = new Date(Number(date));
  console.log(dateString);

  const year = dateString.getFullYear();
  const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
  const day = dateString.getDate().toString().padStart(2, "0");

  console.log(date, day, month, year, phone);

  const handleApprove = async () => {
    try {
      const withdrawRef = ref(
        database,
        `USERS TRANSACTION/${phone}/WITHDRAW/DATE WISE/${year}/${month}/${day}/${date}`
      );

      const totalRef = ref(
        database,
        `USERS TRANSACTION/${phone}/WITHDRAW/TOTAL/${date}`
      );
      const totalTransactionDateWiseRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW/DATE WISE/${year}/${month}/${day}/${date}`
      );
      const totalTransactionTotalRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW//TOTAL/${date}`
      );

      await update(totalRef, { PENDING: "false" });
      await update(withdrawRef, { PENDING: "false" });
      await update(totalTransactionDateWiseRef, { PENDING: "false" });
      await update(totalTransactionTotalRef, { PENDING: "false" });

      toast.success("Status updated successfully");
      setPending(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      const withdrawRef = ref(
        database,
        `USERS TRANSACTION/${phone}/WITHDRAW/DATE WISE/${year}/${month}/${day}/${date}`
      );

      const totalRef = ref(
        database,
        `USERS TRANSACTION/${phone}/WITHDRAW/TOTAL/${date}`
      );
      const totalTransactionDateWiseRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW/DATE WISE/${year}/${month}/${day}/${date}`
      );
      const totalTransactionTotalRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW//TOTAL/${date}`
      );

      await update(totalRef, { PENDING: "REJECTED" });
      await update(withdrawRef, { PENDING: "REJECTED" });
      await update(totalTransactionDateWiseRef, { PENDING: "REJECTED" });
      await update(totalTransactionTotalRef, { PENDING: "REJECTED" });
      toast.success("Status updated successfully");
      setPending(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit" style={{ top: `${clickPosition?.y}px` }}>
      <div className="modal">
        <div className="status_option_container">
          <span className="close" onClick={() => setPending(false)}>
            <ClearIcon />
          </span>
          <h4 className="status_option_header">Select an option</h4>

          <div className="status_options">
            <div className="accept_button" onClick={handleApprove}>
              ACCEPT
            </div>
            <div className="reject_button" onClick={handleReject}>
              REJECT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWithdrawStatus;
