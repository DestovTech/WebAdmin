import { User } from "../UserContext";
import "./TotalBalance.scss";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import ContributingUsers from "./ContributingUsers";

const TotalBalance = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [usersData, setUsersData] = useState<User[] | null>(null);

  useEffect(() => {
    const userRef = ref(database, "USERS");

    try {
      const unsub = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUsersData(Object.values(snapshot.val()));
        }
      });

      return () => unsub();
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log(usersData);

  const totalAmount = usersData?.reduce(
    (total, user) => total + user.AMOUNT,
    0
  );

  const contributingUsers = usersData?.filter((user) => user.AMOUNT > 0);

  const handleClick = () => {
    setShowUsers(!showUsers);
  };

  return (
    <div className="total_balance_container" onClick={handleClick}>
      {showUsers && (
        <ContributingUsers
          contributingUsers={contributingUsers}
          setShowUsers={setShowUsers}
        />
      )}
      <h4 className="total_balance_title">TOTAL BALANCE</h4>
      <div className="total_balance ">
        <div className="amount">&#8377; {totalAmount}</div>
        <div className="users_involve">({contributingUsers?.length})</div>
      </div>
      <div className="money_icon">
        <img src="balance.svg" alt="" />
      </div>
    </div>
  );
};

export default TotalBalance;
