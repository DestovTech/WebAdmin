import { createContext, ReactNode, useContext, useState } from "react";

export type UsersPermissions = {
  BID: boolean;
  DEPOSIT: boolean;
  GAME_CHART: boolean;
  GAME_RATE: boolean;
  GAME_SETTINGS: boolean;
  MANUAL_REQUEST: boolean;
  MARKET: boolean;
  NOTIFICATION: boolean;
  PAYOUT: boolean;
  SETTINGS: boolean;
  USERS: boolean;
  USERS_DEPOSIT: boolean;
  USERS_WITHDRAW: boolean;
  WIN: boolean;
  WITHDRAW: boolean;
  [key: string]: boolean; // Add index signature
};

type UsersPermission = {
  key: string;
  value: boolean;
};

interface PermissionContextProps {
  switched: boolean;
  setSwitched: (data: boolean) => void;
  username: string | null;
  setUsername: (data: string | null) => void;
  permissions: UsersPermissions | null;
  setPermissions: (data: UsersPermissions | null) => void;
  permission: UsersPermission[] | null;
  setPermission: (data: UsersPermission[] | null) => void;
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined
);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<UsersPermissions | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [switched, setSwitched] = useState(false);
  const [permission, setPermission] = useState<UsersPermission[] | null>(null);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
        username,
        setUsername,
        switched,
        setSwitched,
        permission,
        setPermission,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermissionContext must be used within an PermissionProvider"
    );
  }
  return context;
};
