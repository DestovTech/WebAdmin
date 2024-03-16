import { GridColDef, DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GameData } from "./GamesDetails";
import "./gamesDetails.scss";
import { ref, remove } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import { useState } from "react";
import EditGame from "../EditGames/EditGame";
import OpenCloseOption from "../OpenCloseOption/OpenCloseOption";
import Rewards from "../Rewards/Rewards";

type ColumnRow = GameData;

interface gameDataGridProps {
  gameData: ColumnRow[];
}

export type ClickPosition = {
  x: number;
  y: number;
};

const GamesDataGrid: React.FC<gameDataGridProps> = ({ gameData }) => {
  const [editGame, setEditGame] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameName, setGameName] = useState("");
  const [openClose, setOpenClose] = useState(false);
  const [rewards, setRewards] = useState(false);
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null
  );

  const getTime = (time: number) => {
    const date = new Date(time);

    // Get hours, minutes, and AM/PM
    const hours = (date.getHours() % 12 || 12).toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    // Format the time as a string
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
  };

  const handleEdit = (gameid: string, event: React.MouseEvent) => {
    setEditGame(!editGame);
    setGameId(gameid);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left + window.scrollX; // Adjust for horizontal scroll
    const y = event.clientY - rect.top + window.scrollY;
    setClickPosition({ x, y });
  };

  const handleUpdate = (
    event: React.MouseEvent,
    gameid: string,
    gamename: string
  ) => {
    setGameId(gameid);
    setOpenClose(!openClose);
    setGameName(gamename);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left + window.scrollX; // Adjust for horizontal scroll
    const y = event.clientY - rect.top + window.scrollY;
    setClickPosition({ x, y });
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Market",
      width: 150,
      cellClassName: "market_name",
    },
    {
      field: "open",
      headerName: "Open",
      width: 100,
    },
    {
      field: "close",
      headerName: "Close",
      width: 100,
    },
    {
      field: "disable",
      headerName: "Holiday",
      width: 90,
      renderCell: (params) => (
        <div>{params.row.disable === "true" ? "Yes" : "No"}</div>
      ),
    },
    {
      field: "hidden",
      headerName: "Hidden",
      width: 90,
      renderCell: (params) => (
        <div>{params.row.hidden === "true" ? "Yes" : "No"}</div>
      ),
    },
    {
      field: "result",
      headerName: "Result",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="actions_icons">
          <img
            style={{ cursor: "pointer" }}
            src="view.svg"
            alt=""
            onClick={(event) => handleEdit(params.row.id, event)}
          />
          <img
            style={{ cursor: "pointer" }}
            src="delete.svg"
            alt=""
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
    {
      field: "updateResult",
      headerName: "Update Result",
      width: 130,
      renderCell: (params) => (
        <div>
          <img
            src="./update.png"
            alt="update"
            className="update_img"
            onClick={(event) =>
              handleUpdate(event, params.row.id, params.row.name)
            }
          />
        </div>
      ),
    },
    {
      field: "Rewards",
      headerName: "Rewards",
      width: 100,
      renderCell: (params) => (
        <div>
          <img
            src="./gift.png"
            alt="rewards"
            className="update_img"
            onClick={(event) =>
              handleRewards(event, params.row.id, params.row.name)
            }
          />
        </div>
      ),
    },
  ];

  const handleRewards = (
    event: React.MouseEvent,
    gameid: string,
    gamename: string
  ) => {
    setGameId(gameid);
    setRewards(!rewards);
    setGameName(gamename);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left + window.scrollX; // Adjust for horizontal scroll
    const y = event.clientY - rect.top + window.scrollY;
    setClickPosition({ x, y });
  };

  const handleDelete = (gameId: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the game ?`
    );

    if (!userConfirmed) {
      return;
    }

    const gameRef = ref(database, `GAMES/${gameId}`);
    const resultRef = ref(database, `RESULTS/${gameId}`);
    const chartRef = ref(database, `GAME CHART/${gameId}`);

    remove(gameRef)
      .then(() => {
        toast.success(`Game ${gameId} deleted successfully`);

        remove(resultRef);
        remove(chartRef);
      })
      .catch((error) => {
        console.error("Error deleting user", error);
        toast.error("Error deleting user");
      });
  };

  const rows = gameData.map((game) => {
    const timestampClose = getTime(game.CLOSE);
    const timestampOpen = getTime(game.OPEN);

    return {
      id: game.key,
      name: game.NAME,
      close: timestampClose,
      open: timestampOpen,
      hidden: game.HIDDEN,
      disable: game.DISABLE,
      result: game.RESULT,
    };
  });
  return (
    <div className="dataTable">
      {rewards && (
        <Rewards
          gameId={gameId}
          setRewards={setRewards}
          gameName={gameName}
          clickPosition={clickPosition}
        />
      )}
      {editGame && (
        <EditGame
          gameId={gameId}
          setEditGame={setEditGame}
          clickPosition={clickPosition}
        />
      )}
      {openClose && (
        <OpenCloseOption
          gameId={gameId}
          gameName={gameName}
          setOpenClose={setOpenClose}
          clickPosition={clickPosition}
        />
      )}
      {rows.length > 0 ? (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
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

export default GamesDataGrid;
