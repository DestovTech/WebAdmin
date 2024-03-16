import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import { get, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import "./EditorPayout.scss";
import Copy from "../../copy/Copy";

type PayoutEditDataType = {
  ACC_IFSC: string;
  ACC_NAME: string;
  ACC_NUM: string;
  GPAY: string;
  PAYTM: string;
  PHONEPE: string;
  UPI: string;
};

const initialState = {
  ACC_IFSC: "",
  ACC_NAME: "",
  ACC_NUM: "",
  GPAY: "",
  PAYTM: "",
  PHONEPE: "",
  UPI: "",
};

type Props = {
  userId: string;
  setEditPayout: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditPayout = (props: Props) => {
  const [formData, setFormData] = useState<PayoutEditDataType>(initialState);

  const { ACC_IFSC, ACC_NAME, ACC_NUM } = formData;

  useEffect(() => {
    const fetchPayoutData = async () => {
      try {
        const payoutRef = ref(database, `WITHDRAW METHODS/${props.userId}`);

        const snapshot = await get(payoutRef);

        if (snapshot.exists()) {
          setFormData((prevData) => ({
            ...prevData,
            ACC_IFSC: snapshot.val().ACC_IFSC,
            ACC_NAME: snapshot.val().ACC_NAME,
            ACC_NUM: snapshot.val().ACC_NUM,
            GPAY: snapshot.val().GPAY,
            PAYTM: snapshot.val().PAYTM,
            PHONEPE: snapshot.val().PHONEPE,
            UPI: snapshot.val().UPI,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchPayoutData();
  }, [props.userId, props.setEditPayout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the specific field in the formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (ACC_NUM && ACC_IFSC && ACC_NAME) {
      try {
        const payoutRef = ref(database, `WITHDRAW METHODS/${props.userId}`);

        await set(payoutRef, {
          ACC_IFSC: formData.ACC_IFSC,
          ACC_NAME: formData.ACC_NAME,
          ACC_NUM: formData.ACC_NUM,
          GPAY: formData.GPAY || "",
          PAYTM: formData.PAYTM || "",
          PHONEPE: formData.PHONEPE || "",
          UPI: formData.UPI || "",
        });

        toast.success("Payout updated successfully!");
        props.setEditPayout(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Mandatory fields are required");
      return;
    }
  };

  return (
    <div className="add add_payout">
      <div className="modal">
        <span className="close" onClick={() => props.setEditPayout(false)}>
          <ClearIcon />
        </span>
        <h1>
          Update Payout{" "}
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
            <label>
              Account Name* <Copy PhoneNumber={null} data={formData.ACC_NAME} />
            </label>
            <input
              type="text"
              name="ACC_NAME"
              placeholder="Account Name"
              value={formData.ACC_NAME}
              onChange={handleChange}
            />
          </div>

          <div className="item">
            <label>
              Account Number*{" "}
              <Copy PhoneNumber={null} data={formData.ACC_NUM} />
            </label>
            <input
              type="text"
              name="ACC_NUM"
              placeholder="Account Number"
              value={formData.ACC_NUM}
              onChange={handleChange}
              pattern="[0-9]*"
              inputMode="numeric" // Display numeric keyboard on mobile devices
              title="Please enter account number" // Display a custom validation message
            />
          </div>

          <div className="item">
            <label>
              IFSC Code* <Copy PhoneNumber={null} data={formData.ACC_IFSC} />
            </label>
            <input
              type="text"
              name="ACC_IFSC"
              placeholder="IFSC Code"
              value={formData.ACC_IFSC}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label>
              GPay <Copy PhoneNumber={null} data={formData.GPAY} />
            </label>
            <input
              type="text"
              name="GPAY"
              placeholder="GPay"
              value={formData.GPAY}
              onChange={handleChange}
              pattern="[0-9]{10}"
              inputMode="numeric" // Display numeric keyboard on mobile devices
              title="Please enter 10 digit GPay Number" // Display a custom validation message
            />
          </div>

          <div className="item">
            <label>
              Paytm <Copy PhoneNumber={null} data={formData.PAYTM} />
            </label>
            <input
              type="text"
              name="PAYTM"
              placeholder="Paytm"
              value={formData.PAYTM}
              onChange={handleChange}
              pattern="[0-9]{10}"
              inputMode="numeric" // Display numeric keyboard on mobile devices
              title="Please enter 10 digit Paytm Number" // Display a custom validation message
            />
          </div>

          <div className="item">
            <label>
              PhonePe <Copy PhoneNumber={null} data={formData.PHONEPE} />
            </label>
            <input
              type="text"
              name="PHONEPE"
              placeholder="PhonePe"
              value={formData.PHONEPE}
              onChange={handleChange}
              pattern="[0-9]{10}"
              inputMode="numeric" // Display numeric keyboard on mobile devices
              title="Please enter 10 digit PhonePe Number" // Display a custom validation message
            />
          </div>

          <div className="item">
            <label>
              UPI <Copy PhoneNumber={null} data={formData.UPI} />
            </label>
            <input
              type="text"
              name="UPI"
              placeholder="UPI"
              value={formData.UPI}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="add_btn">
            Update Payout
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPayout;
