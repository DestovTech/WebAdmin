import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { UserDeposit } from "./UsersDepositData";
import "./UsersDepositData.scss";
import { useNavigate } from "react-router-dom";

interface UserDepositDataProps {
  depositData: CustomRow[] | null;
}

type CustomRow = UserDeposit;

const UserDepositGrid: React.FC<UserDepositDataProps> = ({ depositData }) => {
  const navigate = useNavigate();
  const handleUserClick = (phone: string) => {
    navigate(`/users/${phone}`);
  };
  const columns: GridColDef[] = [
    {
      field: "DATE",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },
    {
      field: "NAME",
      headerName: "Name",
      cellClassName: "bidPhone_column",
      width: 120,
      renderCell: (params) => (
        <div>
          <div
            className="user_name"
            onClick={() => handleUserClick(params.row.userPhone)}
          >
            {params.row.NAME}
          </div>
          <div>{params.row.userPhone}</div>
        </div>
      ),
    },

    {
      field: "PAYMENT_BY",
      headerName: "Payment By",
      width: 120,
    },
    {
      field: "PAYMENT_APP",
      headerName: "Payment App",
      width: 130,
    },
    {
      field: "PAYMENT_TO",
      headerName: "Payment To",
      width: 120,
    },
    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => (
        <div>&#8377; {params.row.TOTAL - params.row.AMOUNT}</div>
      ),
    },
    {
      field: "AMOUNT",
      headerName: "Deposit",
      width: 120,
      renderCell: (params) => (
        <div>
          <div className="add_points">+ {params.row.AMOUNT}</div>
        </div>
      ),
    },
    {
      field: "TOTAL",
      headerName: "Current Points",
      width: 140,
      renderCell: (params) => (
        <div>
          <div>&#8377; {params.row.TOTAL}</div>
        </div>
      ),
    },
  ];

  const getRowId = (row: CustomRow) => {
    return `${row.DATE}${row.userPhone}${row.PAYMENT_APP}`;
  };

  return (
    <div className="dataTable_Usersdeposit">
      {depositData && depositData.length > 0 ? (
        <DataGrid
          className="dataGrid_Usersdeposit"
          rows={depositData}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: {
                debounceMs: 500,
                placeholder: "Search by Name", // Set your custom placeholder here
              },
            },
          }}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          getRowId={getRowId}
        />
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
    </div>
  );
};

export default UserDepositGrid;
