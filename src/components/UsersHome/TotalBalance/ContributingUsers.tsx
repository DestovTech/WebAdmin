import ClearIcon from "@mui/icons-material/Clear";
import { User } from "../UserContext";

type Props = {
  contributingUsers: User[] | null | undefined;
  setShowUsers: React.Dispatch<React.SetStateAction<boolean>>;
};

const ContributingUsers = ({ contributingUsers, setShowUsers }: Props) => {
  return (
    <div className="add">
      <div className="modal userDetail_modal">
        <span className="close" onClick={() => setShowUsers(false)}>
          <ClearIcon />
        </span>
        <h2>Users Details</h2>

        <div className="users_details_list">
          {contributingUsers?.map((user) => (
            <div className="user_list_data">
              <div className="userName">{user.NAME}</div>
              <div className="user_amount">&#8377;{user.AMOUNT}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributingUsers;
