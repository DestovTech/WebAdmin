import { Navigate, useParams } from "react-router-dom";
import "./user.scss";
import UserDetail from "../../components/UserDetail/UserDetail";
import { useAuth } from "../../components/auth-context";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";

const User = () => {
  //this way ensure that useParams never return undefined value
  const { id } = useParams<{ id?: string }>();
  const userId = id ?? ""; // Provide a default value if id is undefined
  console.log(userId);

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
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/USERS`
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
        <UserDetail userId={Number(userId)} />
      ) : (
        <p>No access to this data</p>
      )}
    </div>
  );
};

export default User;
