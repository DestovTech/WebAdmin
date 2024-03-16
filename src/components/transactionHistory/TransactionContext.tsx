import React, { createContext, useContext, ReactNode, useState } from "react";

// Define the interfaces for your data
export interface BidDetails {
  date: string;
  marketName: string;
  name: string;
  number: string;
  openClose: string;
  points: number;
  previousPoints: number;
  type: string;
  uid: string;
}

export interface DepositDetails {
  amount: number;
  date: string;
  name: string;
  paymentApp: string;
  paymentBy: string;
  paymentTo: string;
  total: number;
  uid: string;
}

export interface WinDetails {
  date: string;
  marketId: string;
  marketName: string;
  name: string;
  newPoints: number;
  number: string;
  openClose: string;
  phone: string;
  points: string;
  previousPoints: number;
  type: string;
  winPoints: number;
}

export interface WithdrawalDetails {
  amount: number;
  date: string;
  name: string;
  app: string;
  payoutTo: string;
  pending: string;
  type: string;
  total: number;
  uid: string;
}

// Define the interface for the context
interface TransactionContextProps {
  bidData: BidDetails[] | null;
  depositData: DepositDetails[] | null;
  winData: WinDetails[] | null;
  withdrawData: WithdrawalDetails[] | null;
  setBidData: (data: BidDetails[] | null) => void;
  setDepositData: (data: DepositDetails[] | null) => void;
  setWinData: (data: WinDetails[] | null) => void;
  setWithdrawData: (data: WithdrawalDetails[] | null) => void;
}

// Create the context
const TransactionContext = createContext<TransactionContextProps | undefined>(
  undefined
);

// Create a provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bidData, setBidData] = useState<BidDetails[] | null>(null);
  const [depositData, setDepositData] = useState<DepositDetails[] | null>(null);
  const [winData, setWinData] = useState<WinDetails[] | null>(null);
  const [withdrawData, setWithdrawData] = useState<WithdrawalDetails[] | null>(
    null
  );

  return (
    <TransactionContext.Provider
      value={{
        bidData,
        depositData,
        winData,
        withdrawData,
        setBidData,
        setDepositData,
        setWinData,
        setWithdrawData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Create a custom hook for using the context
export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
};
