import ClearIcon from "@mui/icons-material/Clear";
import { get, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { toast } from "react-toastify";

type Props = {
  setEditPayment: React.Dispatch<React.SetStateAction<boolean>>;
};

type EditPaymentType = {
  MIN_ADD: number;
  MIN_WITHDRAW: number;
};

const initialState = {
  MIN_ADD: 0,
  MIN_WITHDRAW: 0,
};

const EditPayment = (props: Props) => {
  const [formData, setFormData] = useState<EditPaymentType>(initialState);

  useEffect(() => {
    const fetchData = async () => {
      const paymentRef = ref(database, "ADMIN/PAYMENT");

      try {
        const snapshot = await get(paymentRef);

        if (snapshot.exists()) {
          setFormData({
            MIN_ADD: snapshot.val().MIN_ADD,
            MIN_WITHDRAW: snapshot.val().MIN_WITHDRAW,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const paymentRef = ref(database, "ADMIN/PAYMENT");

      const snapshot = await get(paymentRef);

      await update(paymentRef, {
        MIN_ADD: formData?.MIN_ADD || snapshot.val().MIN_ADD,
        MIN_WITHDRAW: formData?.MIN_WITHDRAW || snapshot.val().MIN_WITHDRAW,
      });

      toast.success("Updated Successfully");
      props.setEditPayment(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit_general">
      <div className="modal">
        <span className="close" onClick={() => props.setEditPayment(false)}>
          <ClearIcon />
        </span>
        <h2>Update General Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Minimum Deposit</label>
            <input
              type="number"
              name="MIN_ADD"
              value={formData?.MIN_ADD}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label>Minimum Withdraw</label>
            <input
              type="number"
              name="MIN_WITHDRAW"
              onChange={handleChange}
              value={formData?.MIN_WITHDRAW}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;
