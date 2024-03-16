import { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { BidDetails } from "../TransactionContext";
import "./BidTransaction.scss";
import { GiTwoCoins } from "react-icons/gi";
import { parse, isValid } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";

type CustomRow = BidDetails;

interface BidDataGridProps {
  bidData: CustomRow[];
}

const BidDataGrid: React.FC<BidDataGridProps> = ({ bidData }) => {
  const [selectDate, setSelectDate] = useState<Date | null>(null);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <div>
          <div>{params.value.split(" | ")[0]}</div>{" "}
          <div>{params.value.split(" | ")[1]}</div>
        </div>
      ),
    },
    {
      field: "particulars",
      headerName: "Particulars",
      width: 430,
      renderCell: (params) => (
        <div>
          Bid ( {params.row.marketName} : {params.row.type} :{" "}
          {params.row.openClose} ) : {params.row.number}
        </div>
      ),
    },

    {
      field: "previousPoints",
      headerName: "Previous Points",
      width: 160,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.previousPoints}</div>

          <GiTwoCoins />
        </div>
      ),
    },
    {
      field: "points",
      headerName: "Points",
      width: 100,
      renderCell: (params) => (
        <div className="sub_points">-{params.row.points}</div>
      ),
    },
    {
      field: "currentPoints",
      headerName: "Current Points",
      width: 150,
      renderCell: (params) => (
        <div className="points">
          <div>{params.row.previousPoints - params.row.points}</div>
          <GiTwoCoins />
        </div>
      ),
    },
  ];

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

  const filtereData = filterDataByDate(bidData);

  const getRowId = (row: CustomRow) => `${row.date}${row.number}`;

  return (
    <div className="dataTable_bid">
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
          className="dataGrid_bid"
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
          //   checkboxSelection
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

export default BidDataGrid;
