import { Switch } from "@mui/material";
import "./PaymentSetting.scss";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { get, off, onValue, ref, remove, set } from "firebase/database";
import { database } from "../../../firebase";
import EditGeneralSetting from "./EditGeneralSetting";
import EditPayment from "./EditPayment";
import AddUpi from "./AddUpi";
import { toast } from "react-toastify";

export type GeneralSettingDataType = {
  WHATSAPP: number;
  YOUTUBE: string;
};

export type PaymentDataType = {
  GAPY_AUTO: boolean;
  MIN_ADD: number;
  MIN_WITHDRAW: number;
};

export type UPIDataType = {
  DEFAULT: string;
  IDS: string;
};

const PaymentSetting = () => {
  const [generalSettingData, setGeneralSettingData] =
    useState<GeneralSettingDataType | null>(null);

  const [paymentData, setPaymentData] = useState<PaymentDataType | null>(null);
  const [editGeneral, setEditGeneral] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  const [upiData, setUpiData] = useState<UPIDataType>({
    DEFAULT: "",
    IDS: "",
  });
  const [addUpi, setAddUpi] = useState(false);

  useEffect(() => {
    const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

    try {
      const unsubscribe = onValue(generalRef, (snapshot) => {
        if (snapshot.exists()) {
          setGeneralSettingData({
            WHATSAPP: snapshot.val().WHATSAPP,
            YOUTUBE: snapshot.val().YOUTUBE,
          });
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }, [editGeneral]);

  useEffect(() => {
    const paymentRef = ref(database, "ADMIN/PAYMENT");

    try {
      const handlePaymentData = (snapshot: any) => {
        if (snapshot.exists()) {
          setPaymentData({
            GAPY_AUTO: snapshot.val().GAPY_AUTO,
            MIN_ADD: snapshot.val().MIN_ADD,
            MIN_WITHDRAW: snapshot.val().MIN_WITHDRAW,
          });
        } else {
          return;
        }
      };

      onValue(paymentRef, handlePaymentData);

      return () => {
        off(paymentRef, "value", handlePaymentData);
      };
    } catch (err) {
      console.log(err);
    }
  }, [editPayment]);

  useEffect(() => {
    const upiRef = ref(database, "ADMIN/UPI");

    try {
      get(upiRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUpiData(snapshot.val());
        }
      });

      const unsubscribe = onValue(upiRef, (snapshot) => {
        if (snapshot.exists()) {
          setUpiData(snapshot.val());
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const defaultId = Object.keys(upiData?.IDS).find(
    (id) => id === upiData?.DEFAULT
  );

  const handleToggle = () => {
    const gpayRef = ref(database, "ADMIN/PAYMENT/GAPY_AUTO");

    set(gpayRef, !paymentData?.GAPY_AUTO);
  };

  const handleGeneralClick = () => {
    setEditGeneral(!editGeneral);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentClick = () => {
    setEditPayment(!editPayment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddUpi = () => {
    setAddUpi(!addUpi);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClick = async (key: string) => {
    // Update the database with the new IDS
    const defaultRef = ref(database, "ADMIN/UPI/DEFAULT");
    await set(defaultRef, key);
  };

  const handleDelete = async (key: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete UPI: ${key}?`
    );

    if (!userConfirmed) {
      // User canceled the deletion
      return;
    }
    const upiRef = ref(database, `ADMIN/UPI/IDS/${key}`);

    const snapshot = await get(upiRef);

    if (snapshot.val()) {
      toast.error("Please firstly set the default UPI");
    } else {
      remove(upiRef).then(() => {
        toast.success("UPI deleted successfully");
      });
    }
  };

  // console.log(upiData);

  return (
    <div className="paymentSetting">
      {editGeneral && <EditGeneralSetting setEditGeneral={setEditGeneral} />}
      {editPayment && <EditPayment setEditPayment={setEditPayment} />}
      {addUpi && <AddUpi setAddUpi={setAddUpi} />}
      <div className="first_container">
        <div className="general_setting_header">
          <h4>GENERAL SETTINGS</h4>
          <div onClick={handleGeneralClick}>
            <EditIcon className="edit_icon" />
          </div>
        </div>
        <div className="whatsapp_num">
          <span>Whatsapp</span> +91 {generalSettingData?.WHATSAPP}
        </div>
        <div className="whatsapp_num">
          <span>Youtube</span> {generalSettingData?.YOUTUBE}
        </div>

        <div className="payment_setting">
          <div className="payment_setting_header">
            <h4>PAYMENT SETTINGS</h4>
            <div onClick={handlePaymentClick}>
              <EditIcon className="edit_icon" />
            </div>
          </div>
          <div className="auto_payment_setting">
            <p>GPay Auto Payment</p>
            <Switch
              checked={paymentData?.GAPY_AUTO}
              className="switch"
              color="secondary"
              size="small"
              onClick={handleToggle}
            />
          </div>
          <div className="min_amount">
            <div className="min_deposit">
              <span>{paymentData?.MIN_ADD}</span>
              <p>Min Deposit</p>
            </div>
            <div className="min_withdraw">
              <span>{paymentData?.MIN_WITHDRAW}</span>
              <p>Min Withdraw</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fourth_container">
        <div className="default_upi">
          <h4>DEFAULT UPI</h4>
          <div className="default_upi_id">
            {upiData?.DEFAULT.replace("*", ".")}
          </div>
        </div>
        <div className="upi_ids_header">
          <h4>ALL UPI IDS</h4>
          <button onClick={handleAddUpi}>Add New UPI</button>
        </div>

        <div className="upi_id_container">
          <div className="upi_id">
            {defaultId}
            <button className="default">DEFAULT</button>
          </div>
          <img
            className="delete_icon"
            src="delete.svg"
            alt=""
            onClick={() => handleDelete(defaultId ?? "")}
          />
        </div>
        {Object.keys(upiData.IDS).map((id) => {
          if (id !== defaultId) {
            const formattedId = id.replace("*", ".");
            return (
              <div key={id} className="upi_id_container">
                <div className="upi_id">
                  {formattedId}
                  <button
                    className="set_as_default"
                    onClick={() => handleClick(id)}
                  >
                    Set as Default
                  </button>
                </div>
                <img
                  className="delete_icon"
                  src="delete.svg"
                  alt=""
                  onClick={() => handleDelete(id)}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default PaymentSetting;
