import React, { useState, useEffect } from "react";
import { get, ref, set } from "firebase/database";
import { toast } from "react-toastify";
import "./EditUser.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { database } from "../../firebase";
import "./EditUser.scss";

// Function to update an existing user in the database
type UserData = {
  phoneNumber: string;
  name: string;
  password: string;
  pin: string;
  uid: string;
  amount: number; // Assuming AMOUNT is a number, adjust if needed
  createdOn: number; // Assuming CREATED_ON is a number, adjust if needed
  lastSeen: number; // Assuming LAST_SEEN is a number, adjust if needed
  appVersion: number;
};

type Props = {
  setEditUser: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number; // Pass the userId as a prop
};

const initialState = {
  phoneNumber: "",
  name: "",
  password: "",
  pin: "",
  uid: "",
  amount: 0, // Assuming AMOUNT is a number, adjust if needed
  createdOn: 0, // Assuming CREATED_ON is a number, adjust if needed
  lastSeen: 0, // Assuming LAST_SEEN is a number, adjust if needed
  appVersion: 1,
};

const EditUser = (props: Props) => {
  const [formData, setFormData] = useState<UserData>(initialState);
  //   const oldPhoneNumber = props.userId;
  //   const [newPhoneNumber, setNewPhoneNumber] = useState<any>();

  const { phoneNumber, name, password, pin } = formData;

  // Fetch user data based on the provided userId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(database, `USERS/${props.userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          // If user exists, set the formData state with user data
          setFormData((prevData) => ({
            ...prevData,
            phoneNumber: String(snapshot.val().PHONE), // Convert to string explicitly
            name: snapshot.val().NAME,
            password: snapshot.val().PASSWORD,
            pin: snapshot.val().PIN,
            amount: snapshot.val().AMOUNT,
            createdOn: snapshot.val().CREATED_ON,
            lastSeen: snapshot.val().LAST_SEEN,
            uid: String(snapshot.val().PHONE),
          }));
        } else {
          toast.error("User not found");
          // Close the edit modal if user not found
          props.setEditUser(false);
        }
      } catch (error) {
        console.error("Error fetching user data");
      }
    };

    fetchUserData();
  }, [props.userId, props.setEditUser]);

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (phoneNumber && password && name && pin) {
      try {
        // Update the user data in the database
        // setNewPhoneNumber(phoneNumber);

        // if (oldPhoneNumber !== Number(newPhoneNumber)) {
        //   const oldUserRef = ref(database, `USERS/${props.userId}`);
        //   const newuserRef = ref(database, `USERS/${String(newPhoneNumber)}`);

        //   console.log(oldUserRef, newuserRef);

        //   await set(newuserRef, {
        //     LAST_SEEN: Date.now(), // Update the last seen timestamp
        //     NAME: formData.name,
        //     PASSWORD: formData.password,
        //     PHONE: formData.phoneNumber,
        //     UID: formData.uid,
        //     CREATED_ON: formData.createdOn,
        //     AMOUNT: formData.amount,
        //   });

        //   await remove(oldUserRef);
        // } else {
        const userRef = ref(database, `USERS/${props.userId}`);

        await set(userRef, {
          LAST_SEEN: formData.lastSeen, // Update the last seen timestamp
          NAME: formData.name,
          PASSWORD: formData.password,
          PHONE: formData.phoneNumber,
          UID: formData.phoneNumber,
          PIN: formData.pin,
          CREATED_ON: formData.createdOn,
          AMOUNT: formData.amount,
          APP_VERSION: formData.appVersion,
        });
        // }

        toast.success("User updated successfully!");
        props.setEditUser(false);
      } catch (error) {
        console.error("Error updating user");
      }
    } else {
      toast.error("All fields are required");
      return;
    }

    // Close the edit modal
  };

  return (
    <div className="edit">
      {formData && (
        <div className="modal">
          <span className="close" onClick={() => props.setEditUser(false)}>
            <ClearIcon />
          </span>
          <h1>
            Update User{" "}
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
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="item">
              <label>Password</label>
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label>PIN</label>
              <input
                type="text"
                name="pin"
                placeholder="PIN"
                value={pin}
                onChange={handleChange}
                maxLength={4}
                pattern="[0-9]{4}"
                inputMode="numeric" // Display numeric keyboard on mobile devices
                title="Please enter a 4-digit numeric PIN" // Display a custom validation message
              />
            </div>

            <button type="submit" className="update_btn">
              Update User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditUser;
