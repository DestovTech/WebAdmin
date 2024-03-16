// UserFilterDropdown.tsx
import React from "react";
import "./style.scss";
import { FaFilter } from "react-icons/fa6";

interface UserFilterDropdownProps {
  filterOption: string;
  onFilterOptionChange: (value: string) => void;
}

const UserFilterDropDown: React.FC<UserFilterDropdownProps> = ({
  filterOption,
  onFilterOptionChange,
}) => {
  return (
    <div className="userFilterDropdown">
      <div className="filterOptions">
        <div className="filter_icon">
          <FaFilter size={18} />
        </div>
        <select
          id="filterOptions"
          className="select_filter_option"
          value={filterOption}
          onChange={(e) => onFilterOptionChange(e.target.value)}
        >
          <option value="lastSeen">Last Seen</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="amount">Amount</option>
          <option value="versions">Versions</option>
        </select>
      </div>
    </div>
  );
};

export default UserFilterDropDown;
