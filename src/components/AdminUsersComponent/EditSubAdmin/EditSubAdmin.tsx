import ClearIcon from "@mui/icons-material/Clear";
import { get, ref, update } from "firebase/database";
import { database } from "../../../firebase";
import { useEffect, useState } from "react";
import { SubAdminDataType } from "../AdminUsersComponent";
import { toast } from "react-toastify";

type Props = {
  setEditAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
};

const EditSubAdmin = (props: Props) => {
  const [formData, setFormData] = useState<SubAdminDataType>({
    FULL_NAME: "",
    ID: "",
    PASSWORD: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminRef = ref(
          database,
          `ADMIN/SUB_ADMIN/${props.userName}/AUTH`
        );

        const snapshot = await get(adminRef);

        if (snapshot.exists()) {
          setFormData((prevData) => ({
            ...prevData,
            FULL_NAME: snapshot.val().FULL_NAME,
            ID: snapshot.val().ID,
            PASSWORD: snapshot.val().PASSWORD,
          }));
        } else {
          toast.error("Admin not found");
        }
      } catch (error) {
        console.error("Error fetching user data");
      }
    };
    fetchAdminData();
  }, [props.setEditAdmin, props.userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.FULL_NAME && formData.ID && formData.PASSWORD) {
      const adminRef = ref(database, `ADMIN/SUB_ADMIN/${props.userName}/AUTH`);

      await update(adminRef, {
        FULL_NAME: formData.FULL_NAME,
        ID: formData.ID,
        PASSWORD: formData.PASSWORD,
      });

      toast.success("Admin added successfully");
      props.setEditAdmin(false);
    } else {
      toast.error("All field are required to fill");
    }
  };

  return (
    <div className="edit">
      <div className="modal">
        <span className="close" onClick={() => props.setEditAdmin(false)}>
          <ClearIcon />
        </span>
        <h2>
          Update Admin
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
              disabled
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

          <button type="submit" className="update_btn">
            Update Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubAdmin;
