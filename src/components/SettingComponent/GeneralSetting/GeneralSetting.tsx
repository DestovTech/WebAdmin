import { useEffect, useState } from "react";
import "./GeneralSetting.scss";
import { get, onValue, ref, set, update } from "firebase/database";
import { database } from "../../../firebase";
import { Switch } from "@mui/material";
import { toast } from "react-toastify";

type BonusDataType = {
  REFERRED_BY_BONUS: number;
  REFERRED_TO_BONUS: number;
  WELCOME_BONUS: number;
};

type GeneralDataType = {
  REFER_MSG: string;
  BID_RATE: number;
};

type PaymentSettingDataType = {
  WITHDRAW: boolean;
  DAILY_TRANSACTION_LIMIT: number;
  DAILY_WITHDRAW_LIMIT: number;
  WITHDRAW_CLOSE: number;
  WITHDRAW_MESSAGE: string;
  WITHDRAW_OPEN: number;
};

const getDefaultDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}T00:00`;
};

const time = (timestamp?: number) => {
  if (timestamp === undefined || isNaN(timestamp)) {
    return "00:00";
  }
  const dateObj = new Date(timestamp);

  const hours = dateObj.getHours().toString().padStart(2, "0");
  const min = dateObj.getMinutes().toString().padStart(2, "0");

  return `${hours}:${min}`;
};

const GeneralSetting = () => {
  const [bonusData, setBonusData] = useState<BonusDataType>({
    REFERRED_BY_BONUS: 0,
    REFERRED_TO_BONUS: 0,
    WELCOME_BONUS: 0,
  });
  const [generalData, setGeneralData] = useState<GeneralDataType>({
    REFER_MSG: "",
    BID_RATE: 0,
  });
  const [paymentData, setPaymentData] = useState<PaymentSettingDataType>({
    WITHDRAW: false,
    DAILY_TRANSACTION_LIMIT: 0,
    DAILY_WITHDRAW_LIMIT: 0,
    WITHDRAW_CLOSE: Number(getDefaultDateTime()),
    WITHDRAW_MESSAGE: "",
    WITHDRAW_OPEN: Number(getDefaultDateTime()),
  });

  //   const [formPaymentData,setFormPaymentData]

  const [withDrawOpen, setWithDrawOpen] = useState("00:00");
  const [withDrawClose, setWithDrawClose] = useState("00:00");

  useEffect(() => {
    const bonusRef = ref(database, "ADMIN/BONUS");

    get(bonusRef).then((snapshot) => {
      if (snapshot.exists()) {
        setBonusData({
          REFERRED_BY_BONUS: snapshot.val().REFERRED_BY_BONUS,
          REFERRED_TO_BONUS: snapshot.val().REFERRED_TO_BONUS,
          WELCOME_BONUS: snapshot.val().WELCOME_BONUS,
        });
      }
    });

    const unsubscribe = onValue(bonusRef, (snapshot) => {
      if (snapshot.exists()) {
        setBonusData({
          REFERRED_BY_BONUS: snapshot.val().REFERRED_BY_BONUS,
          REFERRED_TO_BONUS: snapshot.val().REFERRED_TO_BONUS,
          WELCOME_BONUS: snapshot.val().WELCOME_BONUS,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBonusChange = (field: keyof BonusDataType, value: number) => {
    setBonusData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleBonusSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bonusRef = ref(database, "ADMIN/BONUS");
    try {
      await update(bonusRef, {
        REFERRED_BY_BONUS: bonusData?.REFERRED_BY_BONUS,
        REFERRED_TO_BONUS: bonusData?.REFERRED_TO_BONUS,
        WELCOME_BONUS: bonusData?.WELCOME_BONUS,
      });
      toast.success("Bid Rate updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const paymentRef = ref(database, "ADMIN/PAYMENT");

    try {
      get(paymentRef).then((snapshot) => {
        if (snapshot.exists()) {
          setPaymentData({
            WITHDRAW: snapshot.val().WITHDRAW,
            DAILY_TRANSACTION_LIMIT: snapshot.val().DAILY_TRANSACTION_LIMIT,
            DAILY_WITHDRAW_LIMIT: snapshot.val().DAILY_WITHDRAW_LIMIT,
            WITHDRAW_CLOSE: snapshot.val().WITHDRAW_CLOSE,
            WITHDRAW_MESSAGE: snapshot.val().WITHDRAW_MESSAGE,
            WITHDRAW_OPEN: snapshot.val().WITHDRAW_OPEN,
          });
          setWithDrawClose(time(snapshot.val().WITHDRAW_CLOSE));
          setWithDrawOpen(time(snapshot.val().WITHDRAW_OPEN));
        } else {
          return;
        }
      });

      const unsubscribe = onValue(paymentRef, (snapshot) => {
        if (snapshot.exists()) {
          setPaymentData({
            WITHDRAW: snapshot.val().WITHDRAW,
            DAILY_TRANSACTION_LIMIT: snapshot.val().DAILY_TRANSACTION_LIMIT,
            DAILY_WITHDRAW_LIMIT: snapshot.val().DAILY_WITHDRAW_LIMIT,
            WITHDRAW_CLOSE: snapshot.val().WITHDRAW_CLOSE,
            WITHDRAW_MESSAGE: snapshot.val().WITHDRAW_MESSAGE,
            WITHDRAW_OPEN: snapshot.val().WITHDRAW_OPEN,
          });
          setWithDrawClose(time(snapshot.val().WITHDRAW_CLOSE));
          setWithDrawOpen(time(snapshot.val().WITHDRAW_OPEN));
        } else {
          return;
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const generalRef = ref(database, "ADMIN/GENERAL SETTINGS");

    get(generalRef).then((snapshot) => {
      if (snapshot.exists()) {
        setGeneralData({
          REFER_MSG: snapshot.val().REFER_MSG,
          BID_RATE: snapshot.val().BID_RATE,
        });
      }
    });

    const unsubscribe = onValue(generalRef, (snapshot) => {
      if (snapshot.exists()) {
        setGeneralData({
          REFER_MSG: snapshot.val().REFER_MSG,
          BID_RATE: snapshot.val().BID_RATE,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePaymentChange = (
    field: keyof PaymentSettingDataType,
    value: string | boolean | number
  ) => {
    setPaymentData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleGeneralChange = (
    field: keyof GeneralDataType,
    value: string | number
  ) => {
    setGeneralData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bidRef = ref(database, "ADMIN/GENERAL SETTINGS");
    try {
      await update(bidRef, { BID_RATE: generalData?.BID_RATE });
      toast.success("Bid Rate updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReferMsgSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bidRef = ref(database, "ADMIN/GENERAL SETTINGS");
    try {
      await update(bidRef, { REFER_MSG: generalData?.REFER_MSG });
      toast.success("Refer MSG updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = () => {
    const paymentRef = ref(database, "ADMIN/PAYMENT/WITHDRAW");
    set(paymentRef, !paymentData.WITHDRAW);
  };

  const handleTimeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const paymentRef = ref(database, "ADMIN/PAYMENT");

    try {
      const currentDate = new Date();
      const openDateTime = new Date(
        `${currentDate.toISOString().split("T")[0]} ${withDrawOpen}`
      );
      const closeDateTime = new Date(
        `${currentDate.toISOString().split("T")[0]} ${withDrawClose}`
      );

      await update(paymentRef, {
        WITHDRAW_OPEN: openDateTime.getTime() || paymentData.WITHDRAW_OPEN,
        WITHDRAW_CLOSE: closeDateTime.getTime() || paymentData.WITHDRAW_CLOSE,
      });

      toast.success("Withdraw Timings updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const paymentRef = ref(database, "ADMIN/PAYMENT");

    try {
      await update(paymentRef, {
        DAILY_TRANSACTION_LIMIT: paymentData.DAILY_TRANSACTION_LIMIT,
        DAILY_WITHDRAW_LIMIT: paymentData.DAILY_WITHDRAW_LIMIT,
        WITHDRAW_MESSAGE: paymentData.WITHDRAW_MESSAGE,
      });

      toast.success("Withdraw Data Updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="general_setting">
      <div className="bonus_container">
        <h4>USERS BONUS</h4>
        <form onSubmit={handleBonusSubmit}>
          <div className="input_form">
            <label>Welcome Bonus</label>
            <input
              type="number"
              value={bonusData?.WELCOME_BONUS}
              onChange={(e) =>
                handleBonusChange("WELCOME_BONUS", Number(e.target.value))
              }
            />
          </div>
          <div className="input_form">
            <label>Referred To Bonus</label>
            <input
              type="number"
              value={bonusData?.REFERRED_TO_BONUS}
              onChange={(e) =>
                handleBonusChange("REFERRED_TO_BONUS", Number(e.target.value))
              }
            />
          </div>
          <div className="input_form">
            <label>Referred By Bonus</label>
            <input
              type="number"
              value={bonusData?.REFERRED_BY_BONUS}
              onChange={(e) =>
                handleBonusChange("REFERRED_BY_BONUS", Number(e.target.value))
              }
            />
          </div>
          <button type="submit">Update Bonus</button>
        </form>
      </div>
      <div className="refer_container">
        <h4>REFER SETTINGS</h4>
        <form onSubmit={handleReferMsgSubmit}>
          <div className="input_form">
            <label>Enter Refer Message</label>
            <textarea
              rows={15}
              cols={40}
              value={generalData?.REFER_MSG}
              onChange={(e) => handleGeneralChange("REFER_MSG", e.target.value)}
            />
          </div>
          <button>Update Refer Message</button>
        </form>
      </div>
      <div className="withdraw_container">
        <div className="withdraw_header">
          <h4>WITHDRAW SETTINGS</h4>
          <Switch
            checked={paymentData?.WITHDRAW}
            color="secondary"
            size="small"
            onChange={handleToggle}
          />
        </div>
        <form onSubmit={handlePaymentSubmit}>
          <div className="input_form">
            <label>Daily Transaction Limit</label>
            <input
              type="number"
              value={paymentData?.DAILY_TRANSACTION_LIMIT}
              onChange={(e) =>
                handlePaymentChange("DAILY_TRANSACTION_LIMIT", e.target.value)
              }
              readOnly={!paymentData?.WITHDRAW}
            />
          </div>
          <div className="input_form">
            <label>Daily Withdraw Limit</label>
            <input
              type="number"
              value={paymentData?.DAILY_WITHDRAW_LIMIT}
              onChange={(e) =>
                handlePaymentChange("DAILY_WITHDRAW_LIMIT", e.target.value)
              }
              readOnly={!paymentData?.WITHDRAW}
            />
          </div>
          <div className="input_form">
            <label>Enter Withdrawal Message</label>
            <textarea
              value={paymentData?.WITHDRAW_MESSAGE}
              onChange={(e) =>
                handlePaymentChange("WITHDRAW_MESSAGE", e.target.value)
              }
              readOnly={!paymentData?.WITHDRAW}
            />
          </div>
          <button type="submit" disabled={!paymentData?.WITHDRAW}>
            Update Withdrawal Settings
          </button>
        </form>
      </div>
      <div className="withdrawTiming_container">
        <h4>WITHDRAWAL TIMING</h4>
        <form onSubmit={handleTimeSubmit}>
          <div className="input_form">
            <label>OPEN ON</label>
            <input
              type="time"
              value={withDrawOpen}
              onChange={(e) => setWithDrawOpen(e.target.value)}
            />
          </div>
          <div className="input_form">
            <label>CLOSE ON</label>
            <input
              type="time"
              value={withDrawClose}
              onChange={(e) => setWithDrawClose(e.target.value)}
            />
          </div>
          <button type="submit">Update Timing</button>
        </form>
      </div>
      <div className="bid_container">
        <h4>BID RATE SETTINGS</h4>
        <form onSubmit={handleBidSubmit}>
          <div className="input_form">
            <label>Enter Minimum Bid Rate</label>
            <input
              type="number"
              value={generalData?.BID_RATE}
              onChange={(e) => handleGeneralChange("BID_RATE", e.target.value)}
            />
          </div>
          <button type="submit">Update Minimum Bid Rate</button>
        </form>
      </div>
    </div>
  );
};

export default GeneralSetting;
