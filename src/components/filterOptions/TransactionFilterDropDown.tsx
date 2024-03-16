import "./style.scss";

type Props = {
  selectedTransactionType: string;
  setSelectedTransactionType: React.Dispatch<React.SetStateAction<string>>;
};

const TransactionFilterDropDown = (props: Props) => {
  return (
    <div>
      <div className="transaction_filter">
        <label htmlFor="transaction-filter">Select Transaction Type:</label>
        <select
          id="transaction-filter"
          onChange={(e) => props.setSelectedTransactionType(e.target.value)}
          value={props.selectedTransactionType}
        >
          <option value="total">Total</option>
          <option value="bid">Bid</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="win">Win</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionFilterDropDown;
