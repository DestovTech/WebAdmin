import React from "react";
import { useTransactionContext } from "../TransactionContext";
// import {
//   DepositDetails,
//   BidDetails,
//   WinDetails,
//   WithdrawalDetails,
// } from "../TransactionContext";
import "./single.scss";
import DataGridDemo from "./TransactionHistory";

const TotalTransaction: React.FC = () => {
  const { bidData, depositData, winData, withdrawData } =
    useTransactionContext();

  // Combine all data into a single array
  const totalData = [
    ...(bidData || []),
    ...(depositData || []),
    ...(winData || []),
    ...(withdrawData || []),
  ];

  // console.log(totalData);

  // Sort the combined data by date in descending order
  totalData.sort((a, b) => {
    const dateA =
      "winPoints" in totalData
        ? convertToDate(a.date)
        : new Date(a.date.replace("|", "")).getTime();
    const dateB =
      "winPoints" in totalData
        ? convertToDate(b.date)
        : new Date(b.date.replace("|", "")).getTime();
    return dateB - dateA;
  });

  function convertToDate(dateString: string) {
    const [datePart, timePart] = dateString.split(" | "); // Split the date and time parts
    const [day, month, year] = datePart.split("-"); // Split the date part to separate day, month, and year

    const formattedDateString = `${month}-${day}-${year} ${timePart}`;
    return new Date(formattedDateString).getTime();
  }

  return (
    <div className="totalTransaction_detail">
      <h2>Passbook</h2>
      <DataGridDemo totalData={totalData} />
    </div>
  );
};

export default TotalTransaction;
