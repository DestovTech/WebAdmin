import { ReactNode, createContext, useContext, useState } from "react";

export type User = {
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

//create interface for the context
interface UsersDataContextProps {
  usersData: User[] | null;
  setUsersData: React.Dispatch<React.SetStateAction<User[] | null>>;
  totalBid: number;
  setTotalBid: React.Dispatch<React.SetStateAction<number | 0>>;
  totalWin: number;
  setTotalWin: React.Dispatch<React.SetStateAction<number | 0>>;
  yesterdayWin: number;
  setYesterdayWin: React.Dispatch<React.SetStateAction<number | 0>>;
  yesterdayBid: number;
  setYesterdayBid: React.Dispatch<React.SetStateAction<number | 0>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  //   totalWin: number;
  //   setTotalWin: React.Dispatch<React.SetStateAction<number | 0>>;
  //   totalBid: number;
  //   setTotalBid: React.Dispatch<React.SetStateAction<number | 0>>;
}

//create context
const UsersDataContext = createContext<UsersDataContextProps | null>(null);

//create a provider component
export const UsersDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersData, setUsersData] = useState<User[] | null>(null);
  const [totalBid, setTotalBid] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  //   const [totalBid, setTotalBid] = useState(0);
  //   const [totalWin, setTotalWin] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [yesterdayWin, setYesterdayWin] = useState(0);
  const [yesterdayBid, setYesterdayBid] = useState(0);

  return (
    <UsersDataContext.Provider
      value={{
        usersData,
        setUsersData,
        totalBid,
        setTotalBid,
        totalWin,
        setTotalWin,
        yesterdayWin,
        setYesterdayWin,
        yesterdayBid,
        setYesterdayBid,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </UsersDataContext.Provider>
  );
};

//create a custom hook for using the context
export const useUsersDataContext = () => {
  const context = useContext(UsersDataContext);
  if (!context) {
    throw new Error(
      "useUsersDataContext must be used within a UsersDataProvider"
    );
  }

  return context;
};
