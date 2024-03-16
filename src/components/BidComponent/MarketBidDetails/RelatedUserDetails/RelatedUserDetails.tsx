import { useEffect, useRef } from "react";
import { ClickPosition, UserDetailsType } from "../MarketBidDetails";
import "./RelatedUserDetails.scss";
import ClearIcon from "@mui/icons-material/Clear";

interface UserDetailsProps {
  userDetails: UserDetailsType[];
  setClickedNumber: React.Dispatch<React.SetStateAction<boolean>>;
  bidNumber: number | undefined;
  clickPosition: ClickPosition | null;
}

const RelatedUserDetails: React.FC<UserDetailsProps> = ({
  userDetails,
  setClickedNumber,
  bidNumber,
  clickPosition,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Update the position of the modal when clickPosition changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.left = `${clickPosition?.x}px`;
      modalRef.current.style.top = `${clickPosition?.y}px`;
    }
  }, [clickPosition]);

  return (
    <div className="details_container" style={{ top: `${clickPosition?.y}px` }}>
      <div className="modal">
        <span className="close" onClick={() => setClickedNumber(false)}>
          <ClearIcon />
        </span>
        <div className="userDetails_header">
          <h3>
            User Details (BID - <span>{bidNumber}</span>)
          </h3>
        </div>
        <div className="details_main_container">
          {userDetails &&
            userDetails.map((user) => (
              <div key={user.phoneNumber} className="user_details">
                <div className="userName_num">
                  <span className="username">{user.userName}</span> (+91
                  {user.phoneNumber})
                </div>
                <div className="user_amount">{user.points} &#8377;</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedUserDetails;
