import React, { useState, useEffect, useRef } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../../../firebase";
import { FormControlLabel, Switch } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "./EditGame.scss"; // You can create a separate stylesheet for styling
import { toast } from "react-toastify";
import { ClickPosition } from "../GamesDetails/GamesDataGrid";

export interface GameForm {
  NAME: string;
  OPEN: string;
  CLOSE: string;
  DISABLE: boolean;
  HIDDEN: boolean;
  DAYS: {
    MON: boolean;
    TUE: boolean;
    WED: boolean;
    THU: boolean;
    FRI: boolean;
    SAT: boolean;
    SUN: boolean;
  };
}

type Props = {
  gameId: string;
  setEditGame: React.Dispatch<React.SetStateAction<boolean>>;
  clickPosition: ClickPosition | null;
};

const getDefaultDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}T00:00`;
};

const dateFetched = (date: string) => {
  const dateObj = new Date(date);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const EditGame = ({ gameId, setEditGame, clickPosition }: Props) => {
  const [gameData, setGameData] = useState<GameForm>({
    NAME: "",
    OPEN: getDefaultDateTime(),
    CLOSE: getDefaultDateTime(),
    DISABLE: false,
    HIDDEN: false,
    DAYS: {
      MON: true,
      TUE: true,
      WED: true,
      THU: true,
      FRI: true,
      SAT: true,
      SUN: true,
    },
  });

  const [modalOpen, setIsModalOpen] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);

  // Update the position of the modal when clickPosition changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.left = `${clickPosition?.x}px`;
      modalRef.current.style.top = `${clickPosition?.y}px`;
    }
  }, [clickPosition]);

  // console.log(clickPosition);

  useEffect(() => {
    // Fetch the existing game data using gameId
    const gameRef = ref(database, `GAMES/${gameId}`);
    get(gameRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data);
          setGameData({
            NAME: data.NAME,
            OPEN: dateFetched(data.OPEN),
            CLOSE: dateFetched(data.CLOSE),
            DISABLE: data.DISABLE === "false" ? false : true,
            HIDDEN: data.HIDDEN === "false" ? false : true,
            DAYS: {
              MON: data.DAYS?.MON === "false" ? false : true,
              TUE: data.DAYS?.TUE === "false" ? false : true,
              WED: data.DAYS?.WED === "false" ? false : true,
              THU: data.DAYS?.THU === "false" ? false : true,
              FRI: data.DAYS?.FRI === "false" ? false : true,
              SAT: data.DAYS?.SAT === "false" ? false : true,
              SUN: data.DAYS?.SUN === "false" ? false : true,
            },
          });
        } else {
          console.error("Game not found");
          // Handle error, redirect, or display a message
        }
      })
      .catch((error) => {
        console.error("Error fetching game data:", error);
        // Handle error
      });
  }, [gameId]);

  const handleInputChange = (
    field: keyof GameForm,
    value: string | boolean | Record<string, boolean>
  ) => {
    setGameData((prevGameData) => ({
      ...prevGameData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((gameData.NAME, gameData.OPEN, gameData.CLOSE)) {
      const gamesRef = ref(database, `GAMES/${gameId}`);

      try {
        const daysAsString: Record<string, string> = {};
        for (const [day, isChecked] of Object.entries(gameData.DAYS)) {
          daysAsString[day] = isChecked.toString();
        }

        const currentDate = new Date();
        const openDateTime = new Date(
          `${currentDate.toISOString().split("T")[0]} ${gameData.OPEN}`
        );
        const closeDateTime = new Date(
          `${currentDate.toISOString().split("T")[0]} ${gameData.CLOSE}`
        );

        await set(gamesRef, {
          NAME: gameData.NAME,
          OPEN: openDateTime.getTime(),
          CLOSE: closeDateTime.getTime(),
          DISABLED: gameData.DISABLE.toString(),
          HIDDEN: gameData.HIDDEN.toString(),
          DAYS: daysAsString,
        });

        toast.success("Game updated successfully!");
        setEditGame(false);
      } catch (error) {
        console.error("Error updating game:", error);
        toast.error("Error updating game");
      }
    } else {
      toast.error("Required fields can't be empty");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
    setEditGame(false);
  };

  return (
    <div
      className={`add1 ${modalOpen ? "" : "closed"}`}
      style={{ top: `${clickPosition?.y}px` }}
    >
      <div className="modal1">
        <span className="close" onClick={toggleModal}>
          <ClearIcon />
        </span>
        <h1 className="add_new_title">
          Edit Game{" "}
          <span className="addNew">
            {/* <img src={AddNew} alt="Add New" className="add-new_img" /> */}
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="editGame_form addGame_form">
          <div className="item1">
            <label>
              Market <span>Name</span>*
            </label>
            <input
              type="text"
              placeholder="Market Name"
              value={gameData.NAME}
              onChange={(e) => handleInputChange("NAME", e.target.value)}
            />
          </div>
          <div className="item1">
            <label>Open On*</label>
            <input
              type="time"
              placeholder="Open On:"
              value={gameData.OPEN}
              onChange={(e) => handleInputChange("OPEN", e.target.value)}
            />
          </div>
          <div className="item1">
            <label>Close On*</label>
            <input
              type="time"
              placeholder="Close On:"
              value={gameData.CLOSE}
              onChange={(e) => handleInputChange("CLOSE", e.target.value)}
            />
          </div>
          <div className="toggle_switch">
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={gameData.DISABLE}
                  onChange={() =>
                    handleInputChange("DISABLE", !gameData.DISABLE)
                  }
                />
              }
              label="Disable"
            />
            <FormControlLabel
              className="formControl_switch"
              control={
                <Switch
                  size="small"
                  checked={gameData.HIDDEN}
                  onChange={() => handleInputChange("HIDDEN", !gameData.HIDDEN)}
                />
              }
              label="Hidden"
            />
          </div>
          <div className="days_opening_title">Market Opening Days</div>
          <div className="days_opening">
            {Object.entries(gameData.DAYS).map(([day, isChecked]) => (
              <span key={day}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    handleInputChange("DAYS", {
                      ...gameData.DAYS,
                      [day]: !isChecked,
                    })
                  }
                />
                {day}
              </span>
            ))}
          </div>
          <button className="edit_btn add_btn" type="submit">
            Update Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditGame;
