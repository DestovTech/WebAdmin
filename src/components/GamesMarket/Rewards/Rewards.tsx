import { get, ref } from "firebase/database";
// import { useState } from "react";
import { database } from "../../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import "./Rewards.scss";
import { ClickPosition } from "../GamesDetails/GamesDataGrid";
import { useEffect, useRef } from "react";

type Props = {
  gameId: string;
  gameName: string;
  setRewards: React.Dispatch<React.SetStateAction<boolean>>;
  clickPosition: ClickPosition | null;
};

const Rewards = (props: Props) => {
  const navigate = useNavigate();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.top = `${props.clickPosition?.y}px`;
    }
  }, [props.clickPosition]);

  const handleOpen = () => {
    const openRef = ref(
      database,
      `RESULTS/${props.gameId}/${year}/${month}/${date}/OPEN`
    );

    get(openRef).then((snapshot) => {
      if (snapshot.exists()) {
        navigate(`/rewards/${props.gameId}___${props.gameName}___OPEN`);
      } else {
        toast.error("Open result is not declared yet");
      }
    });
    props.setRewards(false);
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");

  const handleClose = () => {
    const resultRef = ref(
      database,
      `RESULTS/${props.gameId}/${year}/${month}/${date}/CLOSE`
    );

    get(resultRef).then((snapshot) => {
      if (snapshot.exists() && snapshot.val() !== "✦✦✦") {
        navigate(`/rewards/${props.gameId}___${props.gameName}___CLOSE`);
      } else {
        toast.error("Close result is not declared yet");
      }
    });
    props.setRewards(false);
  };

  return (
    <div
      className="openCloseOption_container"
      style={{ top: `${props.clickPosition?.y}px` }}
    >
      <div className="openCloseOption_main_container">
        <span className="close" onClick={() => props.setRewards(false)}>
          <ClearIcon />
        </span>
        <h2>Market Result</h2>
        {/* <p>Please choose which market do you want to explore ?</p> */}
        <button onClick={handleOpen}>OPEN</button>
        <button onClick={handleClose}>CLOSE</button>
      </div>
    </div>
  );
};

export default Rewards;
