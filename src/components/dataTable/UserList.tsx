import React, { useEffect, useMemo, useState } from "react";
import DataTable from "./DataTable";

type User = {
  AMOUNT: number;
  APP_VERSION: number;
  CREATED_ON: number;
  LAST_SEEN: number;
  NAME: string;
  PASSWORD: string;
  PHONE: string;
  PIN: string;
  UID: string;
  isLoggedIn: boolean;
};

interface UserListProps {
  usersData: Record<string, User> | User[] | null | undefined;
  filterOption: string;
}

const UserList: React.FC<UserListProps> = ({ usersData, filterOption }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sorting function based on last_seen timestamp in descending order
  const sortByLastSeen = (users: User[]) => {
    return users.sort((a, b) => b.LAST_SEEN - a.LAST_SEEN);
  };

  // Sorting function based on alphabetical order of user names
  const sortAlphabetically = (users: User[]) => {
    return users.sort((a, b) => a.NAME.localeCompare(b.NAME));
  };

  // Sorting function based on amount in ascending order
  const sortByAmount = (users: User[]) => {
    return users.sort((a, b) => b.AMOUNT - a.AMOUNT);
  };

  // Sorting function based on versions (assuming there is a property named "version")
  const sortByVersions = (users: User[]) => {
    return users.sort((a, b) => b.APP_VERSION - a.APP_VERSION);
  };

  // Memoize the sorting function based on the selected filter option
  const sortedUsers = useMemo(() => {
    switch (filterOption) {
      case "lastSeen":
        return sortByLastSeen(Object.values(usersData || {}));
      case "alphabetical":
        return sortAlphabetically(Object.values(usersData || {}));
      case "amount":
        return sortByAmount(Object.values(usersData || {}));
      case "versions":
        return sortByVersions(Object.values(usersData || {}));
      default:
        return sortByLastSeen(Object.values(usersData || {}));
    }
  }, [filterOption, usersData]);

  useEffect(() => {
    if (usersData) {
      setIsLoading(false);
    }
  }, [usersData]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        sortedUsers && <DataTable usersData={sortedUsers} />
      )}
    </div>
  );
};

export default UserList;
