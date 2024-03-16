import { ManualDataTye } from "./ManualRequests";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./ManualRequests.scss";
import { ref, set, update } from "firebase/database";
import { database } from "../../firebase";
import { useState } from "react";
import EditStatusReq from "./EditStatusReq";
import { toast } from "react-toastify";

type ManualDataGridProps = {
  manualData: ManualDataTye[] | null;
};

export type transactionData = {
  phone: string;
  DATE: string;
  amount: number;
  total: number;
  paymentApp: string;
  paymentBy: string;
  paymentTo: string;
};

const ManualRequestGrid: React.FC<ManualDataGridProps> = ({ manualData }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [timeStamp, setTimeStamp] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState<transactionData | null>(null);

  const columns: GridColDef[] = [
    {
      field: "DATE",
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
      field: "Phone",
      headerName: "Phone",
      width: 120,
      renderCell: (params) => (
        <div>
          <div>{params.value.split("-")[0]}</div>{" "}
          <div>{params.value.split("-")[1]}</div>
        </div>
      ),
    },

    {
      field: "PAYMENT_APP",
      headerName: "Payment App",
      width: 120,
    },
    {
      field: "PAYMENT_BY",
      headerName: "Payment By",
      width: 120,
    },
    {
      field: "PAYMENT_TO",
      headerName: "Payment To",
      width: 120,
    },
    {
      field: "AMOUNT",
      headerName: "Points",
      width: 100,
      renderCell: (params) => <div className="add_points">+{params.value}</div>,
    },
    {
      field: "TOTAL",
      headerName: "Total",
      width: 100,
      renderCell: (params) => <div>&#8377; {params.value}</div>,
    },
    {
      field: "ACCEPT",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <div className="status">
          {params.value === "false" ? (
            <p className="pending">PENDING</p>
          ) : params.value === "true" ? (
            <p className="accepted">ACCEPTED</p>
          ) : (
            <p className="rejected">REJECTED</p>
          )}
        </div>
      ),
    },
    {
      field: "Approval",
      headerName: "Actions",
      width: 110,
      renderCell: (params) => (
        <div className="status_icon">
          {params.row.ACCEPT === "false" ? (
            <div className="pending_status">
              <img
                src="checkmark.svg"
                alt=""
                onClick={() =>
                  handleApprove(
                    params.row.id,
                    params.row.Phone,
                    params.row.DATE,
                    params.row.AMOUNT,
                    params.row.TOTAL,
                    params.row.PAYMENT_APP,
                    params.row.PAYMENT_BY,
                    params.row.PAYMENT_TO
                  )
                }
              />
              <img
                src="cross.svg"
                alt=""
                onClick={() => handleReject(params.row.id)}
              />
            </div>
          ) : (
            <img
              src="view.svg"
              alt=""
              onClick={() =>
                handleEdit(
                  params.row.id,
                  params.row.ACCEPT,
                  params.row.Phone,
                  params.row.DATE,
                  params.row.AMOUNT,
                  params.row.TOTAL,
                  params.row.PAYMENT_APP,
                  params.row.PAYMENT_BY,
                  params.row.PAYMENT_TO
                )
              }
            />
          )}
        </div>
      ),
    },
  ];

  const handleEdit = (
    timestamp: string,
    currentStatus: string,
    phone: string,
    DATE: string,
    amount: number,
    total: number,
    paymentApp: string,
    paymentBy: string,
    paymentTo: string
  ) => {
    setTimeStamp(timestamp);
    setEditStatus(!editStatus);
    setStatus(currentStatus);
    setData({
      phone,
      DATE,
      amount,
      total,
      paymentApp,
      paymentBy,
      paymentTo,
    });
  };

  const handleApprove = async (
    timestamp: string,
    phone: string,
    DATE: string,
    amount: number,
    total: number,
    paymentApp: string,
    paymentBy: string,
    paymentTo: string
  ) => {
    const dateString = new Date(Number(timestamp));
    const year = dateString.getFullYear();
    const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
    const date = dateString.getDate().toString().padStart(2, "0");

    const reqRef = ref(
      database,
      `MANUAL_REQUEST/DATE WISE/${year}/${month}/${date}/${timestamp}`
    );

    const totalReqRef = ref(database, `MANUAL_REQUEST/TOTAL/${timestamp}`);

    await update(reqRef, {
      ACCEPT: "true",
      MoneyAdded: true,
    });

    await update(totalReqRef, {
      ACCEPT: "true",
      MoneyAdded: true,
    });

    const depositRef = ref(
      database,
      `USERS TRANSACTION/${
        phone.split("-")[0]
      }/DEPOSIT/DATE WISE/${year}/${month}/${date}/${timestamp}`
    );

    const totalRef = ref(
      database,
      `USERS TRANSACTION/${phone.split("-")[0]}/DEPOSIT/TOTAL/${timestamp}`
    );

    const totalTransactionDateWiseRef = ref(
      database,
      `TOTAL TRANSACTION/DEPOSIT/DATE WISE/${year}/${month}/${date}/${timestamp}`
    );

    const totalTransactionTotalRef = ref(
      database,
      `TOTAL TRANSACTION/DEPOSIT/TOTAL/${timestamp}`
    );

    const setData = {
      AMOUNT: amount,
      DATE: DATE,
      NAME: `${phone.split("-")[1]}`,
      PAYMENT_APP: paymentApp,
      PAYMENT_BY: paymentBy,
      PAYMENT_TO: paymentTo,
      TOTAL: total,
      UID: `${phone.split("-")[0]}`,
    };

    await set(depositRef, setData);

    await set(totalRef, setData);

    await set(totalTransactionDateWiseRef, setData);

    await set(totalTransactionTotalRef, setData);

    toast.success("Payment Accepted successfully");
  };

  const handleReject = async (timestamp: string) => {
    const dateString = new Date(Number(timestamp));
    const year = dateString.getFullYear();
    const month = (dateString.getMonth() + 1).toString().padStart(2, "0");
    const date = dateString.getDate().toString().padStart(2, "0");

    const reqRef = ref(
      database,
      `MANUAL_REQUEST/DATE WISE/${year}/${month}/${date}/${timestamp}`
    );

    const totalReqRef = ref(database, `MANUAL_REQUEST/TOTAL/${timestamp}`);

    await update(reqRef, {
      ACCEPT: "reject",
      MoneyAdded: false,
    });

    await update(totalReqRef, {
      ACCEPT: "reject",
      MoneyAdded: false,
    });
    toast.success("Payment Rejected");
  };

  const rows = manualData?.map((data) => {
    return {
      id: data.timestamp,
      DATE: data.DATE,
      Phone: `${data.UID}-${data.NAME}`,
      PAYMENT_APP: data.PAYMENT_APP,
      PAYMENT_BY: data.PAYMENT_BY,
      PAYMENT_TO: data.PAYMENT_TO,
      AMOUNT: data.AMOUNT,
      ACCEPT: data.ACCEPT,
      TOTAL: data.TOTAL,
      isFirst: data.isFirst,
    };
  });

  return (
    <div className="dataTable_UsersWithdraw">
      {editStatus && (
        <EditStatusReq
          timeStamp={timeStamp}
          setEditStatus={setEditStatus}
          accept={status}
          data={data}
        />
      )}
      {rows && rows.length > 0 ? (
        <DataGrid
          className="dataGrid_UsersWithdraw"
          rows={rows}
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
        />
      ) : (
        <div className="no-data">
          <img src="/noData.gif" alt="" className="no-data-img" />
        </div>
      )}
    </div>
  );
};

export default ManualRequestGrid;
