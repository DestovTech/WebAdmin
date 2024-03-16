import ClearIcon from "@mui/icons-material/Clear";
import { ref, set } from "firebase/database";
import { useState } from "react";
import { database } from "../../../firebase";
import { toast } from "react-toastify";

type Props = {
  setAddUpi: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddUpi = (props: Props) => {
  const [upi, setUpi] = useState("");

  const addUpi = async () => {
    try {
      if (upi) {
        const upiRef = ref(database, `ADMIN/UPI/IDS/${upi}`);

        await set(upiRef, false);

        toast.success("New UPI added successfully");
        props.setAddUpi(false);
      } else {
        toast.error("UPI can't be empty");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addUpi();
  };
  return (
    <div className="add_upi">
      <div className="modal">
        <span className="close" onClick={() => props.setAddUpi(false)}>
          <ClearIcon />
        </span>
        <h2>Add New UPI</h2>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <input
              type="text"
              name="UPI"
              placeholder="Enter New UPI"
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>
          <button type="submit">Add New UPI</button>
        </form>
      </div>
    </div>
  );
};

export default AddUpi;
