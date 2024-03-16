import { ReactNode, createContext, useContext, useState } from "react";
import { MarketDetailsType } from "./MarketBidDetails/MarketBidDetails";

interface BidComponentContextProps {
  selectedBidDate: Date;
  selectedWinDate: Date;
  setSelectedBidDate: (data: Date) => void;
  setSelectedWinDate: (data: Date) => void;
  bidDetails: MarketDetailsType[];
  setbidDetails: (data: MarketDetailsType[]) => void;
}

const BidComponentContext = createContext<BidComponentContextProps | undefined>(
  undefined
);

export const BidComponentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedBidDate, setSelectedBidDate] = useState<Date>(new Date());
  const [selectedWinDate, setSelectedWinDate] = useState<Date>(new Date());
  const [bidDetails, setbidDetails] = useState<MarketDetailsType[]>([]);

  return (
    <BidComponentContext.Provider
      value={{
        selectedBidDate,
        setSelectedBidDate,
        selectedWinDate,
        setSelectedWinDate,
        bidDetails,
        setbidDetails,
      }}
    >
      {children}
    </BidComponentContext.Provider>
  );
};

export const useBidComponentContext = () => {
  const context = useContext(BidComponentContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
};
