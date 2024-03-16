import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./DepositTransaction.scss";
import { DepositDetails } from "../TransactionContext";
import { GiTwoCoins } from "react-icons/gi";
import { useState } from "react";
import { parse, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

type CustomRow = DepositDetails;

interface DepositDataGridProps {
  depositData: CustomRow[];
}

const DepositDataGrid: React.FC<DepositDataGridProps> = ({ depositData }) => {
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
      width: 450,
      cellClassName: "centered-cell",
      renderCell: (params) => (
        <div>
          Deposit ( {params.row.paymentApp} : {params.row.paymentBy} :{" "}
          {params.row.paymentTo} )
        </div>
      ),
    },
    {
      field: "previous",
      headerName: "Previous Points",
      width: 140,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.total - params.row.amount} </div>

          <GiTwoCoins />
        </div>
      ),
    },

    {
      field: "amount",
      headerName: "Points",
      width: 110,
      renderCell: (params) => (
        <div className="add_points">+{params.row.amount}</div>
      ),
    },
    {
      field: "total",
      headerName: "Current Points",
      width: 140,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.total}</div>
          <GiTwoCoins />
        </div>
      ),
    },
  ];

  const getRowId = (row: CustomRow) => `${row.date}${row.uid}${row.paymentApp}`;

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
    // props.setSelectDate(date);
    // console.log(props.setSelectDate);
  };

  const filtereData = filterDataByDate(depositData);
  // console.log(filtereData);

  return (
    <div className="dataTable_deposit">
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
          className="dataGrid_deposit"
          rows={filtereData}
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

export default DepositDataGrid;
