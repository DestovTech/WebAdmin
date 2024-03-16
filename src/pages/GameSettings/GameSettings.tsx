import { Navigate } from "react-router-dom";
import GameSetting from "../../components/GameSetting/GameSetting";
import { useAuth } from "../../components/auth-context";
import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const GameSettings = () => {
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
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/GAME_SETTINGS`
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
        <>
          <h1>Game Settings</h1>
          <GameSetting />
        </>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default GameSettings;
