import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { UserBid } from "./UserBidData";
import { GiTwoCoins } from "react-icons/gi";

type Custom = UserBid;

interface UserBidDataProps {
  bidData: Custom[] | null;
}

const UserBidGrid: React.FC<UserBidDataProps> = ({ bidData }) => {
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
      headerName: "Phone",
      width: 120,
      cellClassName: "bidPhone_column",
      renderCell: (params) => (
        <div>
          <div>{params.row.userPhone}</div>
          <div className="user_name">{params.row.NAME}</div>
        </div>
      ),
    },
    {
      field: "MARKET_NAME",
      headerName: "Market",
      width: 120,
    },
    {
      field: "TYPE/OPEN_CLOSE",
      headerName: "Type",
      width: 140,
      renderCell: (params) => (
        <div>
          {params.row.TYPE} : {params.row.OPEN_CLOSE}
        </div>
      ),
    },
    {
      field: "NUMBER",
      headerName: "Number",
      width: 100,
    },
    {
      field: "PREVIOUS_POINTS",
      headerName: "Previous Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.PREVIOUS_POINTS}</div>
          <GiTwoCoins />
        </div>
      ),
    },
    {
      field: "POINTS",
      headerName: "Bid",
      width: 100,
      renderCell: (params) => (
        <div className="sub_points">- {params.row.POINTS}</div>
      ),
    },
    {
      field: "currentPoints",
      headerName: "Current Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.PREVIOUS_POINTS - params.row.POINTS}</div>
          <GiTwoCoins />
        </div>
      ),
    },
  ];

  const getRowId = (row: Custom) => {
    return `${row.DATE}${row.NUMBER}${row.NAME}${row.userPhone}`;
  };
  return (
    <div className="dataTable_Usersdeposit">
      {bidData && bidData.length > 0 ? (
        <DataGrid
          className="dataGrid_Usersdeposit"
          rows={bidData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[7]}
          disableRowSelectionOnClick
          //   disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          getRowId={getRowId}
        />
      ) : (
        <p>No Data Available for the day</p>
      )}
    </div>
  );
};

export default UserBidGrid;
