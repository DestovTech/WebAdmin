import { Navigate } from "react-router-dom";
import ManualRequests from "../../components/ManualRequestComponent/ManualRequests";
import { useAuth } from "../../components/auth-context";
import "./ManualRequest.scss";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const ManualRequest = () => {
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
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/MANUAL_REQUEST`
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
        <ManualRequests />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default ManualRequest;
