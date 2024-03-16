import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import { onValue, ref, remove, update } from "firebase/database";
import { database } from "../../firebase";
import BlockUnblockToggle from "../toggleButton/BlockUnblockToggle";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import AddCardIcon from "@mui/icons-material/AddCard";
import { useEffect, useState } from "react";
import AdminAddPointsForm from "../AdminAddPointsForm/AdminAddPointsForm";
import AdminWithdrawPointsForm from "../AdminWithdrawPointsForm/AdminWithdrawPointsForm";

// type User = {
//   NAME: string;
//   PHONE: string;
//   CREATED_ON: string;
//   LAST_SEEN: string;
//   AMOUNT: number;
//   isLoggedIn: boolean;
//   // ... other properties
// };

type User = {
  AMOUNT: number;
  APP_VERSION: number;
  CREATED_ON: string;
  LAST_SEEN: string;
  NAME: string;
  PASSWORD: string;
  PHONE: string;
  PIN: string;
  UID: string;
  isLoggedIn: boolean;
};

// type UsersData = Record<string, User>;

interface DataTableProps {
  usersData: Record<string, any> | User[] | null | undefined;
}

const DataTable: React.FC<DataTableProps> = ({ usersData }) => {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAddPointsFormVisible, setIsAddPointsFormVisible] = useState(false);
  const [isWithdrawPointsFormVisible, setIsWithdrawPointsFormVisible] =
    useState(false);

  const [versionData, setVersionData] = useState(0);

  const handleAddPoints = (userId: string) => {
    setSelectedUserId(userId);
    setIsAddPointsFormVisible(!isAddPointsFormVisible);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWithdrawPoints = (userId: string) => {
    setSelectedUserId(userId);
    setIsWithdrawPointsFormVisible(!isWithdrawPointsFormVisible);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    try {
      const versionRef = ref(database, "ADMIN/GENERAL SETTINGS/LATEST_VERSION");
      const unsub = onValue(versionRef, (snapshot) => {
        if (snapshot.exists()) {
          setVersionData(snapshot.val());
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log(versionData);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Phone",
      width: 160,
      renderCell: (params) => (
        <div className="phone_column">
          <div
            className={
              versionData === params.row.appVersion ? "latest" : "version"
            }
          >
            V{params.row.appVersion}.0
          </div>
          <div>
            <div>{params.row.id.split("-")[0]}</div>
            <div
              className="user_name"
              onClick={() => handleEdit(params.row.id.split("-")[0])}
            >
              {params.row.name}
            </div>
          </div>
        </div>
      ),
      cellClassName: "phone-column",
      headerClassName: "phone-header",
    },

    // {
    //   field: "name",
    //   headerName: "Name",
    //   width: 0,
    //   renderCell: (params) => (
    //     <div style={{ display: "none" }}>{params.row.name}</div>
    //   ),
    // },

    {
      field: "createdOn",
      headerName: "Created On",
      width: 130,
      renderCell: (params) => (
        <div>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },
    {
      field: "lastSeen",
      headerName: "Last Seen",
      width: 130,
      renderCell: (params) => (
        <div>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 110,
      renderCell: (params) => <div>&#8377;{params.value}</div>,
    },

    {
      field: "addAmount",
      headerName: "Add Points",
      width: 120,
      renderCell: (params) => (
        <div
          className="add_points_button"
          onClick={() => handleAddPoints(params.row.id.split("-")[0])}
        >
          <img
            src="/assets/wallet.png"
            alt="Add Points"
            className="addPointsImage"
          />
        </div>
      ),
    },

    {
      field: "withdrawAmount",
      headerName: "Withdraw Points",
      width: 150,
      renderCell: (params) => (
        <div
          className="withdraw_points_button"
          onClick={() => handleWithdrawPoints(params.row.id.split("-")[0])}
        >
          <img
            src="/assets/withdrawal.png"
            alt="Withdraw Points"
            className="withdrawPointsImage"
          />
        </div>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <div className="actions_icons">
          <img
            style={{ cursor: "pointer" }}
            src="view.svg"
            alt=""
            onClick={() => handleEdit(params.row.id.split("-")[0])}
          />
          <img
            style={{ cursor: "pointer" }}
            src="delete.svg"
            alt=""
            onClick={() => handleDelete(params.row.id.split("-")[0])}
          />
        </div>
      ),
    },

    {
      field: "block-unblock",
      headerName: "Block",
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <BlockUnblockToggle userId={params.row.id.split("-")[0]} />
      ),
    },
  ];

  const handleEdit = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleDelete = (userId: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete user ${userId}?`
    );

    if (!userConfirmed) {
      // User canceled the deletion
      return;
    }
    // Reference to the specific user's ID under 'USERS' node
    const userToDeleteRef = ref(database, `USERS/${userId}`);
    const userListRef = ref(database, "USERS LIST");
    const userTransactionRef = ref(database, `USERS TRANSACTION/${userId}`);

    // Remove the user from the database
    remove(userToDeleteRef)
      .then(() => {
        // console.log(`User ${userId} deleted successfully`);
        toast.success(`User ${userId} deleted successfully`);

        // Remove the user's ID from the 'users_list' node
        update(userListRef, {
          [userId]: null, // Set the user's ID to null to remove it
        });

        remove(userTransactionRef);
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        toast.error("Error deleting user");
      });
  };

  // console.log(usersData);

  const rows = Object.entries(usersData || {}).map(([id, user]) => {
    const convertTimestamp = (timestamp: string) => {
      const dateObj = new Date(timestamp);

      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = getMonthName(dateObj.getMonth());
      const year = dateObj.getFullYear();
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes().toString().padStart(2, "0");
      const seconds = dateObj.getSeconds().toString().padStart(2, "0");
      const meridiem = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

      return `${day}-${month}-${year} | ${formattedHours}:${minutes}:${seconds} ${meridiem}`;
    };
    console.log(id);
    const createdOnDate = user?.CREATED_ON
      ? convertTimestamp(user.CREATED_ON)
      : "";
    const lastSeenDate = user?.LAST_SEEN
      ? convertTimestamp(user.LAST_SEEN)
      : "";

    return {
      id: `${user?.PHONE}-${user?.NAME}`,
      phone: user?.PHONE,
      name: user?.NAME || "",
      createdOn: createdOnDate,
      lastSeen: lastSeenDate,
      amount: user?.AMOUNT || 0,
      appVersion: user?.APP_VERSION || 1,
    };
  });

  function getMonthName(monthIndex: number): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  }

  return (
    <div className="dataTable">
      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columns}
          // initialState={{
          //   pagination: {
          //     paginationModel: {
          //       pageSize: 7,
          //     },
          //   },
          // }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          // pageSizeOptions={[7]}
          // checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
      {isAddPointsFormVisible && (
        <AdminAddPointsForm
          phoneNumber={selectedUserId}
          setAddPointsFormVisible={setIsAddPointsFormVisible}
        />
      )}
      {isWithdrawPointsFormVisible && (
        <AdminWithdrawPointsForm
          phoneNumber={selectedUserId}
          setWithdrawPointsFormVisible={setIsWithdrawPointsFormVisible}
        />
      )}
    </div>
  );
};

export default DataTable;
