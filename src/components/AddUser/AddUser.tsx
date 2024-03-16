import React, { useState } from "react";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import { toast } from "react-toastify";
import "./AddUser.scss";
import ClearIcon from "@mui/icons-material/Clear";

// Function to add a new user to the database
type UserData = {
  phoneNumber: string;
  name: string;
  password: string;
  pin: string;
};

type Props = {
  setAddUser: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddUser = (props: Props) => {
  const [modalOpen, setIsModalOpen] = useState(true);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    password: "",
    pin: "",
  });

  const addUser = async (userData: UserData) => {
    const { phoneNumber, name, password, pin } = userData;

    if (phoneNumber && name && password && pin) {
      try {
        // Extract data from the userData object

        const userRef = ref(database, `USERS/${phoneNumber}`);
        const userStatusRef = ref(database, `USERS LIST/${phoneNumber}`);

        // Check if the user already exists
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          //   throw new Error("User already exists!");
          toast.error("User already exists!");
          return;
        }

        // Create a user object with the provided data
        const user = {
          AMOUNT: 0,
          APP_VERSION: 1,
          CREATED_ON: Date.now(), // Set the creation timestamp
          LAST_SEEN: Date.now(), // Set the last seen timestamp initially to creation timestamp
          NAME: name,
          PASSWORD: password,
          PHONE: phoneNumber,
          PIN: pin,
          UID: phoneNumber,
        };

        // Set the user data in the database
        await set(userRef, user);
        await set(userStatusRef, true);

        console.log("User added successfully!");
        props.setAddUser(false);
      } catch (error) {
        console.error("Error adding user");
      }
    } else {
      toast.error("All fields are required to fill");
      return;
    }
  };

  // Function to handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the specific field in the formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.setAddUser(false);

    // Call the addUser function with the form data
    addUser(formData);
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
    props.setAddUser(false);
  };

  return (
    <div className={`add ${modalOpen ? "" : "closed"}`}>
      <div className="modal">
        <span className="close" onClick={toggleModal}>
          <ClearIcon />
        </span>
        <h1>
          Add new{" "}
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
            <label>Username </label>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="item">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              pattern="[0-9]{10}" // Allow only 10 numeric characters
              inputMode="numeric" // Display numeric keyboard on mobile devices
              title="Please enter a 10-digit phone number" // Display a custom validation message
            />
          </div>

          <div className="item">
            <label>Password</label>
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="item">
            <label>PIN</label>
            <input
              type="text"
              name="pin"
              placeholder="PIN"
              value={formData.pin}
              onChange={handleChange}
              maxLength={4}
              pattern="[0-9]{4}"
              inputMode="numeric" // Display numeric keyboard on mobile devices
              title="Please enter a 4-digit numeric PIN" // Display a custom validation message
            />
          </div>

          <button type="submit" className="add_btn">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
