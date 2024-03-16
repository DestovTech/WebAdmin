import { useEffect, useState } from "react";
import "./GameSetting.scss";
import Switch from "@mui/material/Switch";
import { get, onValue, ref, set } from "firebase/database";
import { database } from "../../firebase";
import GameName from "./GameName";
import CloseGameName from "./CloseGameName";

type GameSettingType = Record<string, boolean>;

const GameSetting = () => {
  const [open, setOpen] = useState(true);
  const [close, setClose] = useState(false);

  const [openGameList, setOpenGameList] = useState<GameSettingType>();
  const [closeGameList, setCloseGameList] = useState<GameSettingType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const closeSettingRef = ref(database, "ADMIN/GAMES/CLOSE");
        const openSettingRef = ref(database, "ADMIN/GAMES/OPEN");

        const openSnapshot = await get(openSettingRef);
        const closesnapshot = await get(closeSettingRef);

        if (openSnapshot.exists()) {
          setOpenGameList(openSnapshot.val());
        }

        if (closesnapshot.exists()) {
          setCloseGameList(closesnapshot.val());
        }

        const unsubscribeOpen = onValue(openSettingRef, (openSnapshot) => {
          if (openSnapshot.exists()) {
            setOpenGameList(openSnapshot.val());
          }
        });

        const unsubscribeClose = onValue(closeSettingRef, (closesnapshot) => {
          if (closesnapshot.exists()) {
            setCloseGameList(closesnapshot.val());
          }
        });

        return () => (unsubscribeOpen(), unsubscribeClose());
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleOpenToggle = (gameId: string, openStatus: boolean) => {
    const openSettingRef = ref(database, `ADMIN/GAMES/OPEN/${gameId}`);
    set(openSettingRef, !openStatus);
  };

  const handleCloseToggle = (gameId: string, openStatus: boolean) => {
    const closeSettingRef = ref(database, `ADMIN/GAMES/CLOSE/${gameId}`);
    set(closeSettingRef, !openStatus);
  };

  const handleClose = () => {
    setOpen(false);
    setClose(true);
  };
  const handleOpen = () => {
    setClose(false);
    setOpen(true);
  };

  console.log(closeGameList);

  return (
    <div className="gameSetting">
      <div className="gameSetting_btn">
        <button className={`btn ${open ? "open" : ""}`} onClick={handleOpen}>
          OPEN
        </button>
        <button className={`btn ${close ? "close" : ""}`} onClick={handleClose}>
          CLOSE
        </button>
      </div>
      {open && (
        <div className="open_games">
          <p>Open Games On/Off</p>
          <ul>
            {openGameList &&
              Object.entries(openGameList).map(([game, status]) => (
                <li key={game}>
                  <span>{<GameName game={game} />}</span>
                  <Switch
                    checked={status}
                    className="switch"
                    color="secondary"
                    onClick={() => handleOpenToggle(game, status)}
                  />
                </li>
              ))}
          </ul>
        </div>
      )}

      {close && (
        <div className="open_games">
          <p>Close Games On/Off</p>
          <ul>
            {closeGameList &&
              Object.entries(closeGameList).map(([game, status]) => (
                <li key={game}>
                  <span>{<CloseGameName game={game} />}</span>
                  <Switch
                    className="switch"
                    checked={status}
                    color="secondary"
                    onClick={() => handleCloseToggle(game, status)}
                  />
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameSetting;
