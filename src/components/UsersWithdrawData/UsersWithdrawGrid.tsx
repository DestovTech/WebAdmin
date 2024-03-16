import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { UserWithdraw } from "./UsersWithdrawData";
import "./UsersWithdrawData.scss";
import { ClickPosition } from "../GamesMarket/GamesDetails/GamesDataGrid";
import { useState } from "react";
import EditWithdrawStatus from "../transactionHistory/WithdrawTransaction/EditWithdrawStatus/EditWithdrawStatus";
import PayoutOptions from "./PayoutOptions";

interface withdrawDataGridProps {
  withdrawData: CustomRow[] | null;
  payoutOption: boolean;
  setPayoutOption: React.Dispatch<React.SetStateAction<boolean>>;
  pending: boolean;
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
}

type CustomRow = UserWithdraw;

const UsersWithdrawGrid: React.FC<withdrawDataGridProps> = ({
  withdrawData,
  payoutOption,
  setPayoutOption,
  pending,
  setPending,
}) => {
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null
  );

  const handlePayout = (payout: string, phone: string, timestamp: string) => {
    if (payout === "Not Selected") {
      setPayoutOption(true);
      setPhone(phone);
      setDate(timestamp);
    }
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
      width: 120,
      cellClassName: "bidPhone_column",
      renderCell: (params) => (
        <div>
          <div className="user_name">{params.row.NAME}</div>
          <div>{params.row.userPhone}</div>
        </div>
      ),
    },

    {
      field: "APP",
      headerName: "App",
      width: 100,
    },
    {
      field: "PAYOUT_TO",
      headerName: "Payout To",
      width: 120,
      cellClassName: "payout_options",
      renderCell: (params) => (
        <div
          onClick={() =>
            handlePayout(
              params.row.PAYOUT_TO,
              params.row.userPhone,
              params.row.timestamp
            )
          }
        >
          {params.row.PAYOUT_TO}
        </div>
      ),
    },
    {
      field: "TYPE",
      headerName: "Type",
      width: 110,
    },
    {
      field: "PENDING",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <div className="status">
          {params.value === "true" ? (
            <p
              className="pending pending_click"
              onClick={(event) =>
                handlePending(params.row.timestamp, params.row.userPhone, event)
              }
            >
              PENDING
            </p>
          ) : params.value === "false" ? (
            <p className="accepted">ACCEPTED</p>
          ) : (
            <p className="rejected">REJECTED</p>
          )}
        </div>
      ),
    },
    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => (
        <div>
          <div>&#8377; {params.row.AMOUNT + params.row.TOTAL}</div>
        </div>
      ),
    },
    {
      field: "AMOUNT",
      headerName: "Withdraw",
      width: 120,
      renderCell: (params) => (
        <div>
          <div className="sub_points">- {params.row.AMOUNT}</div>
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

  const handlePending = (
    timestamp: string,
    phone: string,
    event: React.MouseEvent
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left + window.scrollX; // Adjust for horizontal scroll
    const y = event.clientY - rect.top + window.scrollY;
    setPhone(phone);
    setDate(timestamp);
    setPending(!pending);
    setClickPosition({ x, y });
  };

  const getRowId = (row: CustomRow) => {
    return `${row.DATE}${row.userPhone}`;
  };

  return (
    <div className="dataTable_UsersWithdraw">
      {pending && (
        <EditWithdrawStatus
          setPending={setPending}
          phone={phone}
          date={date}
          clickPosition={clickPosition}
        />
      )}

      {payoutOption && (
        <PayoutOptions
          timestamp={date}
          phone={phone}
          setPayoutOption={setPayoutOption}
        />
      )}
      {withdrawData && withdrawData.length > 0 ? (
        <DataGrid
          className="dataGrid_UsersWithdraw"
          rows={withdrawData}
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

export default UsersWithdrawGrid;
