import { FaCopy } from "react-icons/fa";
import "./copy.scss";

const Copy: React.FC<{ PhoneNumber: string | null; data: string | null }> = ({
  PhoneNumber,
  data,
}) => {
  const copyPhoneNumber = async () => {
    if (PhoneNumber)
      try {
        await navigator.clipboard.writeText(`+91 ${PhoneNumber}`);
        alert("Phone number copied to clipboard: " + `+91 ${PhoneNumber}`);
      } catch (err) {
        console.error("Failed to copy phone number to clipboard", err);
      }
  };

  const copyData = async () => {
    if (data)
      try {
        await navigator.clipboard.writeText(data);
        alert("Copied to clipboard");
      } catch (err) {
        console.error("Failed to copy phone number to clipboard", err);
      }
  };

  return (
    <div className="copy_icon" onClick={data ? copyData : copyPhoneNumber}>
      <FaCopy />
    </div>
  );
};

export default Copy;
