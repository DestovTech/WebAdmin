import { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DepositDetails,
  BidDetails,
  WinDetails,
  WithdrawalDetails,
} from "../TransactionContext";
import { GiTwoCoins } from "react-icons/gi";
import { parse, isValid } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import "./single.scss";

type CustomRow = DepositDetails | WinDetails | BidDetails | WithdrawalDetails;

// Function to get transaction type dynamically
const getTransactionType = (row: CustomRow) => {
  if ("paymentApp" in row) {
    return "Deposit";
  } else if ("winPoints" in row) {
    return "Win";
  } else if ("previousPoints" in row) {
    return "Bid";
  } else if ("payoutTo" in row) {
    return "Withdraw";
  } else {
    return "Unknown"; // Add a default or handle appropriately
  }
};

const columns: GridColDef[] = [
  {
    field: "date",
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
    field: "particulars",
    headerName: "Particulars",
    width: 400,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return (
                <div className="row_details">
                  Deposit ( {params.row.paymentApp} : {params.row.paymentBy} :{" "}
                  {params.row.paymentTo} )
                </div>
              );
            case "Win":
              return (
                <div className="row_details">
                  Win ( {params.row.marketName} : {params.row.type} :{" "}
                  {params.row.openClose} ) : {params.row.number}
                </div>
              );
            case "Bid":
              return (
                <div className="row_details">
                  Bid ( {params.row.marketName} : {params.row.type} :{" "}
                  {params.row.openClose} ) : {params.row.number}
                </div>
              );
            case "Withdraw":
              return (
                <div className="row_details">
                  Withdraw ( {params.row.app} : {params.row.payoutTo} :{" "}
                  {params.row.type} )
                </div>
              );
          }
        })()}
      </>
    ),
  },

  {
    field: "previousPoints",
    headerName: "Previous Points",
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return (
                <div className="points">
                  <div>{params.row.total - params.row.amount} </div>

                  <GiTwoCoins />
                </div>
              );
            case "Win":
              return (
                <div className="points">
                  <div> {params.row.previousPoints} </div>

                  <GiTwoCoins />
                </div>
              );
            case "Bid":
              return (
                <div className="points">
                  <div>{params.row.previousPoints}</div>

                  <GiTwoCoins />
                </div>
              );
            case "Withdraw":
              return (
                <div className="points">
                  {params.row.isRejected === "true" ? (
                    <div>{params.row.total}</div>
                  ) : (
                    <div>{params.row.amount + params.row.total}</div>
                  )}
                  <GiTwoCoins />
                </div>
              );
          }
        })()}
      </>
    ),
  },
  {
    field: "points",
    headerName: "Points",
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return <div className="add_points">+{params.row.amount}</div>;
            case "Win":
              return <div className="add_points">+{params.row.winPoints}</div>;
            case "Bid":
              return <div className="sub_points">-{params.row.points}</div>;
            case "Withdraw":
              return <div className="sub_points">-{params.row.amount}</div>;
          }
        })()}
      </>
    ),
  },
  {
    field: "currentPoints",
    headerName: "Current Points",
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        {(() => {
          const transactionType = getTransactionType(params.row);
          switch (transactionType) {
            case "Deposit":
              return (
                <div className="points">
                  <div>{params.row.total}</div>
                  <GiTwoCoins />
                </div>
              );
            case "Win":
              return (
                <div className="points">
                  <div>{params.row.newPoints}</div>
                  <GiTwoCoins />
                </div>
              );
            case "Bid":
              return (
                <div className="points">
                  <div>{params.row.previousPoints - params.row.points} </div>
                  <GiTwoCoins />
                </div>
              );
            case "Withdraw":
              return (
                <div className="points">
                  <div>{params.row.total}</div>
                  <GiTwoCoins />
                </div>
              );
          }
        })()}
      </>
    ),
  },
];

interface DataGridDemoProps {
  totalData: CustomRow[];
}

const DataGridDemo: React.FC<DataGridDemoProps> = ({ totalData }) => {
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const flatData = totalData
    .map((transaction) => {
      if ("paymentTo" in transaction) {
        // Deposit
        const depositDetails: DepositDetails = {
          paymentTo: transaction.paymentTo,
          paymentApp: transaction.paymentApp,
          amount: transaction.amount || 0, // Add default value or handle appropriately
          name: transaction.name || "", // Add default value or handle appropriately
          paymentBy: transaction.paymentBy || "", // Add default value or handle appropriately
          uid: transaction.uid,
          total: transaction.total,
          date: transaction.date || "",
        };
        return depositDetails;
      } else if ("winPoints" in transaction) {
        // Win
        const winDetails: WinDetails = {
          winPoints: transaction.winPoints,
          marketName: transaction.marketName,
          points: transaction.points,
          marketId: transaction.marketId || "", // Add default value or handle appropriately
          name: transaction.name || "", // Add default value or handle appropriately
          newPoints: transaction.newPoints || 0, // Add default value or handle appropriately
          number: transaction.number || "", // Add default value or handle appropriately
          date: transaction.date,
          openClose: transaction.openClose,
          phone: transaction.phone,
          previousPoints: transaction.previousPoints,
          type: transaction.type,
        };
        return winDetails;
      } else if ("previousPoints" in transaction) {
        // Bid
        const bidDetails: BidDetails = {
          marketName: transaction.marketName,
          previousPoints: transaction.previousPoints,
          points: transaction.points,
          date: transaction.date,
          name: transaction.name || "", // Add default value or handle appropriately
          number: transaction.number || "", // Add default value or handle appropriately
          openClose: transaction.openClose,
          type: transaction.type,
          uid: transaction.uid,
        };
        return bidDetails;
      } else if ("payoutTo" in transaction) {
        // Withdraw
        const withdrawalDetails: WithdrawalDetails = {
          app: transaction.app || "",
          total: transaction.total,
          pending: transaction.pending || "",
          amount: transaction.amount,
          date: transaction.date || "",
          name: transaction.name || "", // Add default value or handle appropriately
          payoutTo: transaction.payoutTo || "",
          type: transaction.type || "",
          uid: transaction.uid || "",
        };
        return withdrawalDetails;
      }
    })
    .filter((transaction) => transaction !== null) as CustomRow[];

  const getRowId = (row: CustomRow) => {
    // Use a combination of date and number (if it exists) as the unique identifier
    return `${row.date}${"paymentApp" in row ? row.paymentApp : ""}${
      "number" in row ? row.number : ""
    }`;
  };

  const filterDataByDate = (data: CustomRow[]) => {
    if (!startDate && !endDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      setStartDate(currentDate);
      setEndDate(currentDate);
    }

    if (startDate && endDate) {
      return data.filter((row) => {
        const rowDate = parseCustomDateString(row.date);

        if (!rowDate) {
          return false; // Skip rows with invalid dates
        }

        // Extract date part only for comparison
        const rowDateWithoutTime = new Date(
          rowDate.getFullYear(),
          rowDate.getMonth(),
          rowDate.getDate()
        );

        // console.log(rowDateWithoutTime);
        // console.log("Start date", startDate);
        // console.log("End date", endDate);

        return rowDateWithoutTime >= startDate && rowDateWithoutTime <= endDate;
      });
    }

    return data;
  };

  function parseCustomDateString(dateString: string) {
    const parsedDate = parse(
      dateString,
      "dd-MMM-yyyy | hh:mm:ss a" || "MM-dd-yyyy | hh:mm:ss a",
      new Date()
    );
    // console.log(parsedDate);

    if (!isValid(parsedDate)) {
      console.error(`Invalid Date: ${dateString}`);
      // Handle the error gracefully, e.g., return a default date or throw an exception.
      return null;
    }

    return parsedDate;
  }

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const filteredData = filterDataByDate(flatData);

  return (
    <div className="dataTable_transaction">
      <div className="date-picker-container">
        <div className="date-pick">
          <div className="date-label">Start Date</div>
          <div className="date">
            <DatePicker
              className="datePicker"
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="dd-MMM-yyyy"
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()} // Set the maximum date to the current date
              placeholderText="Start Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
        <div className="date-pick">
          <div className="date-label">End Date</div>
          <div className="date">
            <DatePicker
              className="datePicker"
              selected={endDate}
              dateFormat="dd-MMM-yyyy"
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()} // Set the maximum date to the current date
              placeholderText="End Date"
            />
            <div className="calendar">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>
      {filteredData.length > 0 ? (
        <DataGrid
          className="dataGrid_transaction"
          rows={filteredData}
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

export default DataGridDemo;
