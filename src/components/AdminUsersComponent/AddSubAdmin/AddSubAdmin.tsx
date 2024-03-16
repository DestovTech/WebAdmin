import ClearIcon from "@mui/icons-material/Clear";
import { get, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { useState } from "react";
import { SubAdminDataType } from "../AdminUsersComponent";
import { toast } from "react-toastify";

type Props = {
  setAddAdmin: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddSubAdmin = (props: Props) => {
  const [formData, setFormData] = useState<SubAdminDataType>({
    FULL_NAME: "",
    ID: "",
    PASSWORD: "",
  });

  const addNewAdmin = async () => {
    try {
      const adminRef = ref(database, `ADMIN/SUB_ADMIN/${formData.ID}/AUTH`);
      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${formData.ID}/PERMISSIONS`
      );

      const snapshot = await get(adminRef);

      if (snapshot.exists()) {
        toast.error("Username already exists.");
      } else {
        await set(adminRef, {
          FULL_NAME: formData.FULL_NAME,
          ID: formData.ID,
          PASSWORD: formData.PASSWORD,
        });

        await set(permissionRef, {
          BID: false,
          DEPOSIT: false,
          GAME_RATE: false,
          GAME_SETTINGS: false,
          MANUAL_REQUEST: false,
          MARKET: false,
          NOTIFICATION: false,
          PAYOUT: false,
          SETTINGS: false,
          USERS: false,
          USERS_DEPOSIT: false,
          USERS_WITHDRAW: false,
          WIN: false,
          WITHDRAW: false,
        });

        toast.success("Admin added successfully");
        props.setAddAdmin(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.FULL_NAME && formData.ID && formData.PASSWORD) {
      addNewAdmin();
    } else {
      toast.error("All field are required to fill");
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setAddAdmin(false)}>
          <ClearIcon />
        </span>
        <h2>
          Add New Admin
          <span className="addNew">
            <img src="add-new.png" alt="Add New" className="add-new_img" />
          </span>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Full Name</label>
            <input
              type="text"
              name="FULL_NAME"
              placeholder="Full Name"
              value={formData.FULL_NAME}
              onChange={handleChange}
            />
          </div>

          <div className="item">
            <label>Username</label>
            <input
              type="text"
              name="ID"
              placeholder="Username"
              value={formData.ID}
              onChange={handleChange}
            />
          </div>

          <div className="item">
            <label>Password</label>
            <input
              type="text"
              name="PASSWORD"
              placeholder="Password"
              value={formData.PASSWORD}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="add_btn">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubAdmin;
