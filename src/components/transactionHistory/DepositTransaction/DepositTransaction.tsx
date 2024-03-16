import { useEffect } from "react";
import "./DepositTransaction.scss";
import { off, onValue, ref } from "firebase/database";
import { database } from "../../../firebase";
import { useTransactionContext, DepositDetails } from "../TransactionContext";
import DepositDataGrid from "./DepositDataGrid";

type Depositdetails = DepositDetails;

const DepositTransaction: React.FC<{ userId: number }> = ({ userId }) => {
  const { depositData, setDepositData } = useTransactionContext();

  useEffect(() => {
    const depositRef = ref(
      database,
      `USERS TRANSACTION/${userId}/DEPOSIT/TOTAL`
    );

    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      if (!data) {
        return;
      }

      const depositDetailsArray: Depositdetails[] = [];

      for (const key in data) {
        const depositNode = data[key];

        const depositDetails: Depositdetails = {
          amount: depositNode.AMOUNT,
          date: depositNode.DATE,
          name: depositNode.NAME,
          paymentApp: depositNode.PAYMENT_APP,
          paymentBy: depositNode.PAYMENT_BY,
          paymentTo: depositNode.PAYMENT_TO,
          total: depositNode.TOTAL,
          uid: depositNode.UID,
        };

        depositDetailsArray.push(depositDetails);
      }

      depositDetailsArray.sort((a, b) => {
        if (a.date === b.date) {
          return b.total - a.total;
        }
        const dateA = new Date(a.date.replace("|", "")).getTime();
        const dateB = new Date(b.date.replace("|", "")).getTime();
        return dateB - dateA;
      });

      setDepositData(depositDetailsArray);
    };

    onValue(depositRef, handleData);

    // Cleanup function
    return () => {
      // Unsubscribe when the component unmounts
      off(depositRef, "value", handleData);
    };
  }, [userId]);

  return (
    <div>
      <h2>Deposit History</h2>
      {/* <hr />
      <br /> */}
      {depositData && <DepositDataGrid depositData={depositData} />}
    </div>
  );
};

export default DepositTransaction;
