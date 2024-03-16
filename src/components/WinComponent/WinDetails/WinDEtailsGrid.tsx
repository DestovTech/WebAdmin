import { WinDetailsType } from "./WinDetails";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./WinDetails.scss";
import { useNavigate } from "react-router-dom";

interface WinDetailsGridType {
  winDetails: WinDetailsType[];
}

type CustomRow = WinDetailsType;

const WinDEtailsGrid: React.FC<WinDetailsGridType> = ({ winDetails }) => {
  const navigate = useNavigate();
  const handleUserClick = (phone: string) => {
    navigate(`/users/${phone}`);
  };

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "User Name",
      width: 110,
      cellClassName: "phone-column",
      renderCell: (params) => (
        <div>
          <div
            className="user_name"
            onClick={() => handleUserClick(params.row.phoneNumber)}
          >
            {params.row.userName}
          </div>
          <div>{params.row.phoneNumber}</div>
        </div>
      ),
    },
    {
      field: "gameName",
      headerName: "Game Name",
      width: 160,
      renderCell: (params) => (
        <div>
          {params.row.gameName} ({params.row.openClose})
        </div>
      ),
    },
    {
      field: "number",
      headerName: "Number",
      width: 120,
    },
    {
      field: "bidAmount",
      headerName: "Bid Amount",
      width: 120,
    },
    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => <div>&#8377; {params.row.previousPoints}</div>,
    },
    {
      field: "winPoints",
      headerName: "Win Points",
      width: 120,
      cellClassName: "add_points",
      renderCell: (params) => <div>+ {params.row.winPoints}</div>,
    },
    {
      field: "newPoints",
      headerName: "New Points",
      width: 120,
      renderCell: (params) => <div>&#8377; {params.row.newPoints}</div>,
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div>
          <div>{params.row.date.split(" | ")[0]}</div>
          <div>{params.row.date.split(" | ")[1]}</div>
        </div>
      ),
    },
  ];

  const getRowId = (row: CustomRow) => {
    return `${row.phoneNumber}-${row.number}-${row.openClose}`;
  };
  return (
    <div className="dataTable">
      {winDetails && winDetails.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={winDetails}
          columns={columns}
          getRowId={getRowId}
          // checkboxSelection

          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
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
    </div>
  );
};

export default WinDEtailsGrid;
