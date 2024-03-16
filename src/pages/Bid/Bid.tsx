import { Navigate } from "react-router-dom";
import MarketBidData from "../../components/BidComponent/MarketBidData/MarketBidData";
import { useAuth } from "../../components/auth-context";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { useEffect, useState } from "react";

const Bid = () => {
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
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/BID`
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
        <MarketBidData />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default Bid;
