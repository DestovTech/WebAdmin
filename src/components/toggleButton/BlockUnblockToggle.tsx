import { useState, useEffect } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { database } from "../../firebase";
import { green, red } from "@mui/material/colors";
import Switch from "@mui/material/Switch";

interface DataTableProps {
  userId: string;
}

const BlockUnblockToggle: React.FC<DataTableProps> = ({ userId }) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const switchColor = isBlocked ? green[500] : red[500];

  useEffect(() => {
    // Reference to the 'user list' node in the database
    const userListRef = ref(database, "USERS LIST");

    // Fetch user list data once
    get(userListRef).then((snapshot) => {
      if (snapshot.exists()) {
        // Check if the user is blocked based on the user list data
        setIsBlocked(snapshot.val()[userId] === true);
      }
    });

    // Alternatively, fetch user list data in real-time
    const unsubscribe = onValue(userListRef, (snapshot) => {
      if (snapshot.exists()) {
        // Check if the user is blocked based on the user list data
        setIsBlocked(snapshot.val()[userId] === true);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  const handleToggle = () => {
    // Update the user's blocked status in the 'user list' node
    const userListRef = ref(database, `USERS LIST/${userId}`);
    set(userListRef, !isBlocked);
  };

  return (
    <div className="toggle_icons">
      <Switch
        size="small"
        color="default"
        checked={isBlocked}
        onChange={handleToggle}
        sx={{
          "& .MuiSwitch-thumb": {
            bgcolor: switchColor,
          },
          "& .MuiSwitch-track": {
            bgcolor: switchColor,
          },
        }}
      />
    </div>
  );
};

export default BlockUnblockToggle;
