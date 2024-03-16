import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { PayoutDataType } from "./PayoutComponent";
import "./PayoutComponent.scss";
import { useState } from "react";
import EditPayout from "./EditPayout/EditPayout";

interface PyoutGridProps {
  payoutData: PayoutDataType[] | null;
}

const PayoutGrid: React.FC<PyoutGridProps> = ({ payoutData }) => {
  const [userId, setUserId] = useState("");
  const [editPayout, setEditPayout] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Phone",
      width: 120,
      cellClassName: "phone-column",
      renderCell: (params) => (
        <div>
          <div>{params.row.id.split("-")[0]}</div>
          <div
            className="user_name"
            onClick={() => handleEdit(params.row.id.split("-")[0])}
          >
            {params.row.name}
          </div>
        </div>
      ),
    },
    {
      field: "acc_name",
      headerName: "Account Name",
      cellClassName: "phone-column",

      width: 150,
    },
    {
      field: "acc_num",
      headerName: "Account Number",
      width: 170,
    },
    {
      field: "acc_ifsc",
      headerName: "IFSC Code",
      width: 140,
    },
    {
      field: "gpay",
      headerName: "GPay",
      width: 120,
    },
    {
      field: "paytm",
      headerName: "Paytm",
      width: 120,
    },
    {
      field: "phonepe",
      headerName: "PhonePe",
      width: 120,
    },
    {
      field: "upi",
      headerName: "UPI",
      width: 180,
    },
    {
      field: "edit",
      headerName: "Action",
      width: 90,
      renderCell: (params) => (
        <img
          src="view.svg"
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(params.row.id.split("-")[0])}
        />
      ),
    },
  ];

  const handleEdit = (userid: string) => {
    setUserId(userid);
    setEditPayout(!editPayout);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rows = Object.values(payoutData || {}).map((data) => {
    return {
      id: `${data.key}-${data.name}`,
      name: data.name,
      acc_ifsc: data.ACC_IFSC,
      acc_name: data.ACC_NAME,
      acc_num: data.ACC_NUM,
      gpay: data.GPAY,
      paytm: data.PAYTM,
      phonepe: data.PHONEPE,
      upi: data.UPI,
    };
  });

  return (
    <div className="dataTable payout_dataTable">
      {editPayout && (
        <EditPayout userId={userId} setEditPayout={setEditPayout} />
      )}
      {rows ? (
        <DataGrid
          className="dataGrid payout_dataGrid"
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
    </div>
  );
};

export default PayoutGrid;
