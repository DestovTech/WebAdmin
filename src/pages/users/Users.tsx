import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { get, onValue, ref } from "firebase/database";
// import DataTable from "../../components/dataTable/DataTable";
// import AddUser from "../../components/dataTable/AddUser";
import UserList from "../../components/dataTable/UserList";
import UserListDropdown from "../../components/filterOptions/UserListDropDown";
import UserFilterDropDown from "../../components/filterOptions/UseFilterDropDown";
import "./users.scss";
import { FaUserPlus } from "react-icons/fa6";
import AddUser from "../../components/AddUser/AddUser";
import { useAuth } from "../../components/auth-context";
import { Navigate } from "react-router-dom";

type User = {
  AMOUNT: number;
  APP_VERSION: number;
  CREATED_ON: number;
  LAST_SEEN: number;
  NAME: string;
  PASSWORD: string;
  PHONE: string;
  PIN: string;
  UID: string;
  isLoggedIn: boolean;
};

type UsersTransactionData = Set<string>;

type UsersListData = Record<string, boolean>;

const Users: React.FC = () => {
  // Get the query string from the current URL
  let queryString = window.location.search;

  // Parse the query string into a URLSearchParams object
  let searchParams = new URLSearchParams(queryString);

  // Get the value of the 'param' parameter
  let paramValue = searchParams.get("param");

  const [usersData, setUsersData] = useState<
    Record<string, User> | User[] | null
  >(null);
  const [addUser, setAddUser] = useState(false);
  const [filterOption, setFilterOption] = useState("lastSeen"); // Default filter option
  const [selectedListOption, setSelectedListOption] = useState(
    paramValue ? paramValue : "total"
  ); // Default list option

  // const [blockedUser,setBlockedUser] = useState(null);
  const [usersListData, setUsersListData] = useState<UsersListData | null>(
    null
  );

  const [loading, setloading] = useState(true);

  const [usersTransactionData, setUsersTransactionData] =
    useState<UsersTransactionData | null>(null);

  useEffect(() => {
    const usersListRef = ref(database, "USERS LIST");
    const transactionRef = ref(database, "USERS TRANSACTION");

    get(usersListRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUsersListData(snapshot.val());
      } else {
        console.log("No data available for USERS LIST");
      }
    });

    get(transactionRef).then((snapshot) => {
      if (snapshot.exists()) {
        const phoneNumbers = Object.keys(snapshot.val());
        const transactionData = new Set(phoneNumbers);
        setUsersTransactionData(transactionData);
      } else {
        console.log("No data available for USERS");
      }
    });

    const unsubscribe = onValue(usersListRef, (snapshot) => {
      if (snapshot.exists()) {
        setUsersListData(snapshot.val());
        // console.log(usersListData);
      } else {
        console.log("No data available for USERS LIST");
      }
    });

    return () => unsubscribe();
  }, []);

  const isBlocked = (userId: string) => {
    // Check the blocked status from the 'USERS LIST' node
    return usersListData?.[userId] === false;
  };

  const isDead = (userId: string) => {
    return !usersTransactionData?.has(userId) ?? true;
  };

  useEffect(() => {
    try {
      const usersRef = ref(database, "USERS");

      // Fetch data once
      get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUsersData(snapshot.val());
        } else {
          console.log("No data available");
        }
      });

      // Alternatively, fetch data in real-time
      const unsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          setUsersData(snapshot.val());
        } else {
          console.log("No data available");
        }
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  }, []); // Run effect only once on component mount

  const handleClick = () => {
    setAddUser(!addUser);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOptionChange = (value: string) => {
    setFilterOption(value);
  };

  const handleListOptionChange = (value: string) => {
    setSelectedListOption(value);
  };

  const currentDate = new Date();
  const currentdate = currentDate.getDate();
  const currentmonth = currentDate.getMonth();
  const currentyear = currentDate.getFullYear();

  // Filter users based on selected option
  const getFilteredUsers = () => {
    if (usersData === null || usersListData === null) {
      return null;
    }

    const currentTimestamp = new Date().getTime();
    // const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Subtract 24 hours in milliseconds

    switch (selectedListOption) {
      case "blocked":
        // Filter users based on the blocked status
        return Object.values(usersData).filter((user) => isBlocked(user.PHONE));

      case "today":
        // Filter users created today
        return Object.values(usersData).filter((user) =>
          isSameDay(user.CREATED_ON, currentTimestamp)
        );

      case "last24":
        // Filter users where "lastSeen" is within the last 24 hours
        return Object.values(usersData).filter((user) => {
          const timestamp = user.LAST_SEEN;
          const dateObj = new Date(Number(timestamp));

          const date = dateObj.getDate();
          const month = dateObj.getMonth();
          const year = dateObj.getFullYear();

          return (
            date === currentdate &&
            month === currentmonth &&
            year === currentyear
          );
        });

      case "0balance":
        return Object.values(usersData).filter((user) => user.AMOUNT === 0);

      case "live":
        // Filter users who have been seen in the last 1 minutes (adjust as needed)
        const liveThreshold = 1 * 60 * 1000; // 1 minutes in milliseconds
        return Object.values(usersData).filter(
          (user) => currentTimestamp - user.LAST_SEEN <= liveThreshold
        );

      case "dead":
        console.log(
          Object.values(usersData).filter((user) => isDead(user.PHONE))
        );
        return Object.values(usersData).filter((user) => isDead(user.PHONE));

      // Add cases for other options
      default:
        // Default case: Return all users
        return usersData;
    }
  };

  // Helper function to check if two timestamps are on the same day
  const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const { isAuthenticated, isSubAuthenticated, user } = useAuth();
  const [permission, setPermission] = useState<boolean>();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (isSubAuthenticated)
      try {
        const permissionRef = ref(
          database,
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/USERS`
        );

        const unsub = onValue(permissionRef, (snapshot) => {
          if (snapshot.exists()) {
            setPermission(snapshot.val());
          }
        });

        return () => unsub();
      } catch (err) {
        console.log(err);
      }
  }, []);

  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
        <div className="users">
          <div className="users_heading">
            <h1>Users</h1>
            <div className="users_heading_options">
              <div onClick={handleClick} className="add_user_option">
                {!addUser && <FaUserPlus size={25} />}
              </div>

              {/* User List Dropdown */}
              <div>
                <UserListDropdown
                  selectedListOption={selectedListOption}
                  onListOptionChange={handleListOptionChange}
                />
              </div>

              {/* User Filter Dropdown */}
              <div>
                <UserFilterDropDown
                  filterOption={filterOption}
                  onFilterOptionChange={handleOptionChange}
                />
              </div>
            </div>
          </div>

          {addUser && (
            <div>
              <AddUser setAddUser={setAddUser} />
            </div>
          )}

          {/* Display the UserList component with the usersData and filterOption */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <UserList
              usersData={getFilteredUsers()}
              filterOption={filterOption}
            />
          )}
        </div>
      ) : (
        <p>No access to this data</p>
      )}
    </>
  );
};

export default Users;
