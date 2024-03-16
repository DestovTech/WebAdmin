import ClearIcon from "@mui/icons-material/Clear";
import { ref, update } from "firebase/database";
import { useState } from "react";
import { database } from "../../firebase";
import { toast } from "react-toastify";

type Props = {
  timestamp: string;
  phone: string;
  setPayoutOption: React.Dispatch<React.SetStateAction<boolean>>;
};

const PayoutOptions = ({ timestamp, phone, setPayoutOption }: Props) => {
  const [selectedOption, setSelectedOption] = useState("");

  const addpayout = async () => {
    try {
      const dateObj = new Date(Number(timestamp));
      const date = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear();

      const daywiseRef = ref(
        database,
        `USERS TRANSACTION/${phone}/WITHDRAW/DATE WISE/${year}/${month}/${date}/${timestamp}`
      );
      const totalRef = ref(
        database,
        `USERS TRANSACTION/${phone}/WITHDRAW/TOTAL/${timestamp}`
      );

      const totaldaywiseRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW/DATE WISE/${year}/${month}/${date}/${timestamp}`
      );

      const totaltotalRef = ref(
        database,
        `TOTAL TRANSACTION/WITHDRAW/TOTAL/${timestamp}`
      );

      await update(daywiseRef, { PAYOUT_TO: selectedOption });
      await update(totalRef, { PAYOUT_TO: selectedOption });
      await update(totaldaywiseRef, { PAYOUT_TO: selectedOption });
      await update(totaltotalRef, { PAYOUT_TO: selectedOption });

      setPayoutOption(false);
      toast.success("Payout updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addpayout();
  };

  return (
    <div className="edit_status">
      <div className="modal">
        <span className="close" onClick={() => setPayoutOption(false)}>
          <ClearIcon />
        </span>
        <h2>Update Payout</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={selectedOption}
            className="status_edit_option"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option className="filter_option" value="">
              Not Selected
            </option>
            <option className="filter_option" value="BANK ACCOUNT">
              Bank Account
            </option>
            <option className="filter_option" value="GPAY">
              GPay
            </option>
            <option className="filter_option" value="PHONEPE">
              PhonePay
            </option>
            <option className="filter_option" value="PAYTM">
              Paytm
            </option>
            <option className="filter_option" value="UPI">
              UPI
            </option>
          </select>
          <button type="submit">UPDATE</button>
        </form>
      </div>
    </div>
  );
};

export default PayoutOptions;
