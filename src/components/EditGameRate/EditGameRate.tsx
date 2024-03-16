import { useEffect, useState } from "react";
import "./EditGameRate.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { get, ref, update } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "react-toastify";

type Props = {
  gameRateId: string;
  setEditRate: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditGameRate = (props: Props) => {
  const [Return, setReturn] = useState(0);

  useEffect(() => {
    const fetchRateData = async () => {
      try {
        const rateRef = ref(database, `ADMIN/GAME RATE`);

        const snapshot = await get(rateRef);

        if (snapshot.exists()) {
          setReturn(snapshot.val()[props.gameRateId]);
        } else {
          toast.error("Game not found");
          props.setEditRate(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchRateData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReturn(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Return) {
      try {
        const rateRef = ref(database, `ADMIN/GAME RATE`);

        await update(rateRef, { [props.gameRateId]: Return });
        toast.success("Rate Updated Successfully");
        props.setEditRate(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Rate can't be empty");
    }
  };

  return (
    <div className="editRate">
      <div className="editRate_container">
        <span className="close" onClick={() => props.setEditRate(false)}>
          <ClearIcon />
        </span>
        <form onSubmit={handleSubmit}>
          <label>Enter New Rate</label>
          <input
            type="number"
            placeholder="Enter New Rate"
            inputMode="numeric"
            value={Return}
            onChange={handleInputChange}
          />
          <button type="submit">Change Rate</button>
        </form>
      </div>
    </div>
  );
};

export default EditGameRate;
