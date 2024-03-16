// UserListDropdown.tsx
import React from "react";
import "./style.scss";
import { IoMdList } from "react-icons/io";

interface UserListDropdownProps {
  selectedListOption: string;
  onListOptionChange: (value: string) => void;
}

const UserListDropdown: React.FC<UserListDropdownProps> = ({
  selectedListOption,
  onListOptionChange,
}) => {
  return (
    <div className="userListDropdown">
      <div className="listOptions">
        <div className="list_icon">
          <IoMdList size={20} />
        </div>
        <select
          id="listOptions"
          value={selectedListOption}
          onChange={(e) => onListOptionChange(e.target.value)}
        >
          <option value="total">Total Users</option>
          <option value="blocked">Blocked Users</option>
          <option value="today">Today Register</option>
          <option value="last24">Last 24 Hours</option>
          <option value="live">Live Users</option>
          <option value="0balance">0 Balance Users</option>
          <option value="dead">Dead Users</option>
          {/* Add other options as needed */}
        </select>
      </div>
    </div>
  );
};

export default UserListDropdown;
