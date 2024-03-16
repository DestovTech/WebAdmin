import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { WithdrawalDetails } from "../TransactionContext";
import "./WithdrawTransaction.scss";
import { GiTwoCoins } from "react-icons/gi";
import { useState } from "react";
import { parse, isValid } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";

type CustomRow = WithdrawalDetails;

interface WithdrawDataGridProps {
  withdrawData: CustomRow[];
}

const WithdrawDataGrid: React.FC<WithdrawDataGridProps> = ({
  withdrawData,
}) => {
  const [selectDate, setSelectDate] = useState<Date | null>(null);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          <div>{params.value.split(" | ")[0]}</div>
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },

    {
      field: "particulars",
      headerName: "Particulars",
      width: 350,
      renderCell: (params) => (
        <div className="row_details">
          Withdraw ( {params.row.app} : {params.row.payoutTo} :{" "}
          {params.row.type} )
        </div>
      ),
    },

    {
      field: "pending",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <div className="status">
          {params.row.pending === "true" ? (
            <p className="pending pending_click">PENDING</p>
          ) : params.row.pending === "false" ? (
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
      width: 150,
      renderCell: (params) => (
        <div className="points">
          {params.row.pending === "REJECTED" ? (
            <div>{params.row.total}</div>
          ) : (
            <div>{params.row.amount + params.row.total}</div>
          )}
          <GiTwoCoins />
        </div>
      ),
    },
    {
      field: "amount",
      headerName: "Points",
      width: 120,
      renderCell: (params) => (
        <div className="sub_points">-{params.row.amount}</div>
      ),
    },
    {
      field: "total",
      headerName: "Current Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.total}</div>
          <GiTwoCoins />
        </div>
      ),
    },

    // { field: "isRejected", headerName: "Rejected", width: 120 },
  ];

  const getRowId = (row: CustomRow) => `${row.date}-${row.uid}`;

  const filterDataByDate = (data: CustomRow[]) => {
    if (!selectDate) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      setSelectDate(currentDate);
    }

    if (selectDate) {
      return data.filter((row) => {
        const rowDate = parseCustomDateString(row.date);

        if (!rowDate) {
          return false; // Skip rows with invalid dates
        }

        const rowDateWithoutTime = new Date(
          rowDate.getFullYear(),
          rowDate.getMonth(),
          rowDate.getDate()
        );

        // console.log("row date", rowDateWithoutTime);
        // console.log("select date", selectDate);

        return rowDateWithoutTime.getTime() === selectDate.getTime();
      });
    }

    return data;
  };

  function parseCustomDateString(dateString: string) {
    const parseDate = parse(dateString, "dd-MMM-yyyy | hh:mm:ss a", new Date());

    if (!isValid(parseDate)) {
      console.error(`Invalid Date: ${dateString}`);
      // Handle the error gracefully, e.g., return a default date or throw an exception.
      return null;
    }

    return parseDate;
  }

  const handleDateChange = (date: Date | null) => {
    setSelectDate(date);
  };

  const filtereData = filterDataByDate(withdrawData);

  return (
    <div className="dataTable_withdraw">
      <div className="date-picker-container">
        <div className="date-pic">
          <DatePicker
            className="datePicker"
            selected={selectDate}
            onChange={handleDateChange}
            dateFormat="dd-MMM-yyyy"
            maxDate={new Date()} // Set the maximum date to the current date

            //   placeholderText="Select a Date"
          />
          <div className="calendar">
            <FaCalendarAlt />
          </div>
        </div>
      </div>
      {filtereData && filtereData.length > 0 ? (
        <DataGrid
          className="dataGrid_withdraw"
          rows={filtereData}
          columns={columns}
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

export default WithdrawDataGrid;
