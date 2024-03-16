import { get, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import ClearIcon from "@mui/icons-material/Clear";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { toast } from "react-toastify";

const initialState = {
  WHATSAPP: 0,
  YOUTUBE: "",
};

type GeneralSettingDataType = {
  WHATSAPP: number;
  YOUTUBE: string;
};

type Props = {
  setEditGeneral: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditGeneralSetting = (props: Props) => {
  const [formData, setFormData] =
    useState<GeneralSettingDataType>(initialState);

  useEffect(() => {
    const fetchData = async () => {
      const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

      try {
        const snapshot = await get(generalRef);

        if (snapshot.exists()) {
          setFormData({
            WHATSAPP: snapshot.val().WHATSAPP,
            YOUTUBE: snapshot.val().YOUTUBE,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    field: keyof GeneralSettingDataType,
    value: string | number
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

      await update(generalRef, {
        WHATSAPP: formData?.WHATSAPP,
        YOUTUBE: formData?.YOUTUBE,
      });

      toast.success("Updated Successfully");
      props.setEditGeneral(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit_general">
      <div className="modal">
        <span className="close" onClick={() => props.setEditGeneral(false)}>
          <ClearIcon />
        </span>
        <h2>Update General Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>
              Whatsapp
              <WhatsAppIcon />
            </label>
            <input
              type="tel"
              pattern="\d{10}"
              title="Please enter exactly 10 digits"
              value={formData?.WHATSAPP}
              onChange={(e) => handleChange("WHATSAPP", e.target.value)}
            />
          </div>
          <div className="item">
            <label>
              Youtube
              <YouTubeIcon />
            </label>
            <input
              type="text"
              onChange={(e) => handleChange("YOUTUBE", e.target.value)}
              value={formData?.YOUTUBE}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditGeneralSetting;
