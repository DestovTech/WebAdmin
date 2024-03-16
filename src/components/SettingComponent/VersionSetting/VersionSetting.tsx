import { useEffect, useState } from "react";
import "./VersionSetting.scss";
import { get, onValue, ref, update } from "firebase/database";
import { database } from "../../../firebase";
import { toast } from "react-toastify";

type VersionDataType = {
  LATEST_VERSION: number;
  UPDATE_URL: string;
};

type AuthDataType = {
  ID: string;
  PASSWORD: string;
};

const authInitialState = { ID: "", PASSWORD: "" };

const initialState = { LATEST_VERSION: 0, UPDATE_URL: "" };

const VersionSetting = () => {
  const [versioData, setVersionData] = useState<VersionDataType>();
  const [formVersionData, setFormVersionData] =
    useState<VersionDataType>(initialState);

  const [authData, setAuthData] = useState<AuthDataType>();
  const [authFormData, setAuthFormData] =
    useState<AuthDataType>(authInitialState);

  useEffect(() => {
    const fetchVersionData = () => {
      const versionRef = ref(database, "ADMIN/GENERAL SETTINGS");

      get(versionRef).then((snapshot) => {
        const data = snapshot.val();
        setFormVersionData({
          LATEST_VERSION: data.LATEST_VERSION,
          UPDATE_URL: data.UPDATE_URL,
        });
      });

      const unsubscribe = onValue(versionRef, (snapshot) => {
        const data = snapshot.val();
        setVersionData({
          LATEST_VERSION: data.LATEST_VERSION,
          UPDATE_URL: data.UPDATE_URL,
        });
        setFormVersionData({
          LATEST_VERSION: data.LATEST_VERSION,
          UPDATE_URL: data.UPDATE_URL,
        });
      });
      return () => unsubscribe();
    };
    fetchVersionData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormVersionData((prevData) => ({
      ...prevData,
      [name]: name === "LATEST_VERSION" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const versionRef = ref(database, "ADMIN/GENERAL SETTINGS");

      await update(versionRef, {
        LATEST_VERSION: formVersionData?.LATEST_VERSION,
        UPDATE_URL: formVersionData?.UPDATE_URL,
      });

      toast.success("Version updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchAuthData = () => {
      try {
        const authRef = ref(database, "ADMIN/AUTH/admin");

        get(authRef).then((snapshot: any) => {
          setAuthFormData({
            ID: snapshot.val().ID,
            PASSWORD: snapshot.val().PASSWORD,
          });
        });

        const unsubscribe = onValue(authRef, (snapshot) => {
          setAuthFormData({
            ID: snapshot.val().ID,
            PASSWORD: snapshot.val().PASSWORD,
          });
          setAuthData({
            ID: snapshot.val().ID,
            PASSWORD: snapshot.val().PASSWORD,
          });
        });
        return () => unsubscribe();
      } catch (err) {
        console.log(err);
      }
    };
    fetchAuthData();
  }, []);

  const handleAuthInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAuthFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const authRef = ref(database, "ADMIN/AUTH/admin");

      await update(authRef, {
        ID: authFormData.ID,
        PASSWORD: authFormData.PASSWORD,
      });

      toast.success("Auth Credentials Updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Some error occured");
    }
  };

  console.log(versioData);
  console.log(authData);

  return (
    <div className="version_setting">
      <div className="user_side_container">
        <h4>USER SIDE</h4>
        <div className="version_data">
          <h3>{versioData?.LATEST_VERSION}.0</h3>
          <p>Current Version</p>
        </div>
      </div>
      <div className="second_container">
        <div className="update_container">
          <h4>UPDATE VERSION</h4>
          <form onSubmit={handleSubmit}>
            <div className="input_form">
              <label>Latest version</label>
              <input
                type="number"
                placeholder="Enter Latest Version"
                name="LATEST_VERSION"
                onChange={handleInputChange}
                value={formVersionData.LATEST_VERSION}
              />
            </div>
            <div className="input_form">
              <label>Download URL</label>
              <input
                type="text"
                placeholder="Enter Download URL"
                name="UPDATE_URL"
                onChange={handleInputChange}
                value={formVersionData.UPDATE_URL}
              />
            </div>
            <button type="submit">Update Version</button>
          </form>
        </div>
        <div className="admin_container">
          <h4>ADMIN AUTH</h4>
          <form onSubmit={handleAuthSubmit}>
            <div className="input_form">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                name="ID"
                value={authFormData.ID}
                onChange={handleAuthInputchange}
              />
            </div>
            <div className="input_form">
              <label>Password</label>
              <input
                type="text"
                placeholder="Password"
                name="PASSWORD"
                value={authFormData.PASSWORD}
                onChange={handleAuthInputchange}
              />
            </div>
            <button type="submit">Update Credential</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VersionSetting;
