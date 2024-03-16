import { useEffect, useState } from "react";
import "./Settings.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaymentSetting from "../../components/SettingComponent/PaymentSetting/PaymentSetting";
import VersionSetting from "../../components/SettingComponent/VersionSetting/VersionSetting";
import GeneralSetting from "../../components/SettingComponent/GeneralSetting/GeneralSetting";
import { useAuth } from "../../components/auth-context";
import { Navigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const Settings = () => {
  const [upiSetting, setUpiSetting] = useState(false);
  const [generalSetting, setGeneralSetting] = useState(false);
  const [versionSetting, setVersionSetting] = useState(false);

  const handleUpiClick = () => {
    setUpiSetting(!upiSetting);
    setGeneralSetting(false);
    setVersionSetting(false);
  };

  const handleGeneralClick = () => {
    setUpiSetting(false);
    setGeneralSetting(!generalSetting);
    setVersionSetting(false);
  };

  const handleVersionClick = () => {
    setUpiSetting(false);
    setGeneralSetting(false);
    setVersionSetting(!versionSetting);
  };

  const { isAuthenticated, isSubAuthenticated, user } = useAuth();
  const [permission, setPermission] = useState<boolean>();

  if (!isAuthenticated && !isSubAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (isSubAuthenticated)
      try {
        const permissionRef = ref(
          database,
          `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS/SETTINGS`
        );

        const unsub = onValue(permissionRef, (snapshot) => {
          if (snapshot.exists()) {
            setPermission(snapshot.val());
          }
        });

        return () => unsub();
      } catch (err) {
        console.log(err);
      }
  }, []);

  return (
    <>
      {isAuthenticated || (isSubAuthenticated && permission) ? (
        <div className="setting">
          <h2>Settings</h2>
          <div className="setting_mainContainer">
            <div
              className={`setting_subContainer ${
                upiSetting ? "rotate-icon" : ""
              }`}
              onClick={handleUpiClick}
            >
              <h4>UPI and Payment Setting</h4>
              <ArrowForwardIosIcon className="arrow_icon" />
            </div>
            {upiSetting && <PaymentSetting />}
            <div
              className={`setting_subContainer ${
                generalSetting ? "rotate-icon" : ""
              }`}
              onClick={handleGeneralClick}
            >
              <h4>General Setting</h4>
              <ArrowForwardIosIcon className="arrow_icon" />
            </div>
            {generalSetting && <GeneralSetting />}
            <div
              className={`setting_subContainer ${
                versionSetting ? "rotate-icon" : ""
              }`}
              onClick={handleVersionClick}
            >
              <h4>Version and Admin Setting</h4>
              <ArrowForwardIosIcon className="arrow_icon" />
            </div>
            {versionSetting && <VersionSetting />}
          </div>
        </div>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </>
  );
};

export default Settings;
