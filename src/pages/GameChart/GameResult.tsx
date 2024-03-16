import { Navigate, useNavigate, useParams } from "react-router-dom";
import GameChartComponent from "../../components/GameChartComponent/GameChartComponent";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./gameResult.scss";
import { useAuth } from "../../components/auth-context";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const GameResult = () => {
  const { id } = useParams();

  const { isAuthenticated, isSubAuthenticated, user } = useAuth();
  const [permission, setPermission] = useState<boolean>();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (isSubAuthenticated)
      try {
        const permissionRef = ref(
          database,
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/GAME_CHART`
        );

        const unsub = onValue(permissionRef, (snapshot) => {
          if (snapshot.exists()) {
            setPermission(snapshot.val());
          }
        });

        return () => unsub();
      } catch (err) {
        console.log(err);
      }
  }, []);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/gameChart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const marketId = id ?? "";
  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
        <div className="gameResult">
          <h2 onClick={handleClick}>
            <span>
              <ArrowBackIosNewIcon />
            </span>
            Game Chart
          </h2>
          <GameChartComponent marketId={marketId} />
        </div>
      ) : (
        <p>No access to this data...</p>
      )}
    </>
  );
};

export default GameResult;
