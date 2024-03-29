import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../../../firebase";
import { FormControlLabel, Switch } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "./AddGames.scss";
import { toast } from "react-toastify";

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

const getDefaultDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}T00:00`;
};

type Props = {
  setAddGame: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddGames = (props: Props) => {
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

    if (gameData.CLOSE && gameData.NAME && gameData.OPEN) {
      const gamesRef = ref(database, "GAMES");

      try {
        const newGameRef = push(gamesRef);

        const daysAsString: Record<string, string> = {};
        for (const [day, value] of Object.entries(gameData.DAYS)) {
          daysAsString[day] = value.toString();
        }

        const currentDate = new Date();
        const openDateTime = new Date(
          `${currentDate.toISOString().split("T")[0]} ${gameData.OPEN}`
        );
        const closeDateTime = new Date(
          `${currentDate.toISOString().split("T")[0]} ${gameData.CLOSE}`
        );

        await set(newGameRef, {
          NAME: gameData.NAME,
          OPEN: openDateTime.getTime(),
          CLOSE: closeDateTime.getTime(),
          DISABLE: gameData.DISABLE.toString(),
          HIDDEN: gameData.HIDDEN.toString(),
          DAYS: daysAsString,
        });

        // // Reset form fields after successful submission
        // setGameData({
        //   NAME: "",
        //   OPEN: getDefaultDateTime(),
        //   CLOSE: getDefaultDateTime(),
        //   DISABLED: false,
        //   HIDDEN: false,
        //   DAYS: {
        //     MON: true,
        //     TUE: true,
        //     WED: true,
        //     THU: true,
        //     FRI: true,
        //     SAT: true,
        //     SUN: true,
        //   },
        // });

        toast.success("Game added successfully!");
        props.setAddGame(false);
      } catch (error) {
        console.error("Error adding game:", error);
      }
    } else {
      toast.error("Required Fields can't be empty");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
    props.setAddGame(false);
  };

  // console.log(gameData.HIDDEN, gameData.DISABLE);

  return (
    <div className={`add1 ${modalOpen ? "" : "closed"}`}>
      <div className="modal1">
        <span className="close" onClick={toggleModal}>
          <ClearIcon />
        </span>
        <h1 className="add_new_title">
          Add new{" "}
          <span className="addNew">
            {/* <img src={AddNew} alt="Add New" className="add-new_img" /> */}
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="addGame_form">
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
          <button className="add_btn" type="submit">
            Add New Market
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGames;
