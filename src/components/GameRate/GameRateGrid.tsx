import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { GameRateType } from "./GameRateData";
import { useState } from "react";
import EditGameRate from "../EditGameRate/EditGameRate";

type Props = {
  gameRate: GameRateType;
};

const GameRateGrid: React.FC<Props> = ({ gameRate }) => {
  const [gameRateId, setGameRateId] = useState("");
  const [editRate, setEditRate] = useState(false);

  const handleEdit = (gamerateId: string) => {
    setEditRate(!editRate);
    setGameRateId(gamerateId);
  };

  const columns: GridColDef[] = [
    {
      field: "game",
      headerName: "Game",
      width: 140,
      cellClassName: "gameName",
    },
    {
      field: "invest",
      headerName: "Invest",
      width: 120,
    },
    {
      field: "rate",
      headerName: "Return",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <div>
          <img
            src="view.svg"
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const getFullName = (shortForm: string): string => {
    switch (shortForm) {
      case "FS":
        return "Full Sangam";
      case "SD":
        return "Single Digit";
      case "TP":
        return "Triple Panel";
      case "JD":
        return "Jodi Digit";
      case "SP":
        return "Single Panel";
      case "DP":
        return "Double Panel";
      case "HS":
        return "Half Sangam";
      default:
        return shortForm;
    }
  };

  const customGameOrder = ["SD", "JD", "SP", "DP", "TP", "HS", "FS"];

  const rows = customGameOrder
    .filter((game) => gameRate.hasOwnProperty(game))
    .map((game) => {
      return {
        id: game,
        game: getFullName(game),
        rate: gameRate[game],
        invest: 10,
      };
    });

  return (
    <div className="dataTable">
      {editRate && (
        <EditGameRate gameRateId={gameRateId} setEditRate={setEditRate} />
      )}
      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid gameRateGrid"
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
        <p>No data available</p>
      )}
    </div>
  );
};

export default GameRateGrid;
