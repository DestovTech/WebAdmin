import { useEffect, useState } from "react";
import MarketChart from "../../components/GameChartComponent/MarketChart";
import { useAuth } from "../../components/auth-context";
import { Navigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const GameChart = () => {
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

  return (
    <div>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
        <div>
          <h2>Game Chart</h2>
          <MarketChart />
        </div>
      ) : (
        <p>No access to this data...</p>
      )}
    </div>
  );
};

export default GameChart;
