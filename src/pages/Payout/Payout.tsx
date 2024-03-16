import { Navigate } from "react-router-dom";
import PayoutComponent from "../../components/PayoutComponent/PayoutComponent";
import { useAuth } from "../../components/auth-context";
import "./Payout.scss";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const Payout = () => {
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
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/PAYOUT`
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
    <>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
        <div className="payout">
          <h2>Payout Details</h2>
          <PayoutComponent />
        </div>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </>
  );
};

export default Payout;
