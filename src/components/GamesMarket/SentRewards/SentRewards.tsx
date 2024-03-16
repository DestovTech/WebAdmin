import { get, onValue, ref, remove, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import "./SentRewards.scss";
import { toast } from "react-toastify";

type RewardsProps = {
  gameId: string;
};

type UserListDataType = {
  gameRate: number;
  number: string;
  userName: string;
  gameName: string;
  phone: string;
  points: number;
};

const SentRewards: React.FC<RewardsProps> = ({ gameId }) => {
  const [openMarketResult, setOpenMarketResult] = useState("");
  const [closeMarketResult, setCloseMarketResult] = useState("");
  const [usersList, setUsersList] = useState<UserListDataType[] | null>(null);
  const [showOpenWinners, setShowOpenWinners] = useState(false);
  const [rewardSentMap, setRewardSentMap] = useState<{
    [key: string]: boolean | null;
  }>({});

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const date = currentDate.getDate().toString().padStart(2, "0");
  const hour = (currentDate.getHours() % 12 || 12).toString().padStart(2, "0");
  const min = currentDate.getMinutes().toString().padStart(2, "0");
  const sec = currentDate.getSeconds().toString().padStart(2, "0");

  const meridiem = currentDate.getHours() >= 12 ? "PM" : "AM";

  const dateString = `${date}-${month}-${year} | ${hour}:${min}:${sec} ${meridiem}`;

  useEffect(() => {
    try {
      const rewardsOpenRef = ref(
        database,
        `RESULTS/${gameId.split("___")[0]}/${year}/${month}/${date}/OPEN`
      );

      const rewardsCloseRef = ref(
        database,
        `RESULTS/${gameId.split("___")[0]}/${year}/${month}/${date}/CLOSE`
      );

      get(rewardsOpenRef).then((snapshot: any) => {
        if (snapshot.exists()) {
          setOpenMarketResult(snapshot.val());
        }
      });

      get(rewardsCloseRef).then((snapshot: any) => {
        if (snapshot.exists()) {
          setCloseMarketResult(snapshot.val());
        }
      });

      const unsubscribeOpen = onValue(rewardsOpenRef, (snapshot) => {
        if (snapshot.exists()) {
          setOpenMarketResult(snapshot.val());
        }
      });

      const unsubscribeClose = onValue(rewardsCloseRef, (snapshot) => {
        if (snapshot.exists()) {
          setCloseMarketResult(snapshot.val());
        }
      });

      return () => {
        unsubscribeOpen(), unsubscribeClose();
      };
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getGameName = (marketResult: string): string => {
    // Your logic to determine the game name based on the market result
    // Example logic:
    const a = parseInt(marketResult[0]);
    const b = parseInt(marketResult[1]);
    const c = parseInt(marketResult[2]);
    if (a === b && b === c) {
      return "Triple Panel";
    } else if (a === b || b === c || a === c) {
      return "Double Panel";
    } else {
      return "Single Panel";
    }
  };

  const getGameAbbreviation = (gameName: string): string => {
    if (gameName === "Triple Panel") {
      return "TP";
    } else if (gameName === "Double Panel") {
      return "DP";
    } else {
      return "SP";
    }
  };

  const fetchUsers = async (
    marketResult: string,
    marketType: string,
    userListArray: UserListDataType[]
  ) => {
    let gameName: string;
    let game: string;

    if (marketResult.length === 1) {
      gameName = "Single Digit";
      game = "SD";
    } else if (marketResult.length === 2) {
      gameName = "Jodi Digit";
      game = "JD";
    } else if (marketResult.length === 3) {
      gameName = getGameName(marketResult);
      game = getGameAbbreviation(gameName);
    } else if (marketResult.replace("-", "").length === 4) {
      gameName = "Half Sangam";
      game = "HS";
    } else {
      gameName = "Full Sangam";
      game = "FS";
    }

    const rateRef = ref(database, `ADMIN/GAME RATE/${game}`);
    const userRewardsRef = ref(
      database,
      `TOTAL TRANSACTION/BIDS/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }/${marketType}/${gameName}/${marketResult}/USERS`
    );

    const [rateSnapshot, usersnapshot] = await Promise.all([
      get(rateRef),
      get(userRewardsRef),
    ]);

    const gameRate = rateSnapshot.exists() ? rateSnapshot.val() : 0;
    const promises: Promise<void>[] = [];

    usersnapshot.forEach((userSnapshot) => {
      const phone = userSnapshot.key;
      const points = userSnapshot.val();

      const userRef = ref(database, `USERS/${phone}`);
      const promise = get(userRef).then((userSnapshot: any) => {
        if (userSnapshot.exists()) {
          const userName = userSnapshot.val().NAME;
          const number = marketResult;

          checkRewards(phone, gameName, number, marketType);

          userListArray.push({
            gameRate,
            number,
            userName,
            gameName,
            phone,
            points,
          });
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
  };

  const [openLoading, setOpenLoading] = useState(true);

  const fetchOpenUsers = async () => {
    try {
      const openSingleNumber =
        (parseInt(openMarketResult[0]) +
          parseInt(openMarketResult[1]) +
          parseInt(openMarketResult[2])) %
        10;

      const userListArray: UserListDataType[] = [];

      await Promise.all([
        fetchUsers(openMarketResult, "OPEN", userListArray), // Pass userListArray as an argument
        fetchUsers(String(openSingleNumber), "OPEN", userListArray), // Pass userListArray as an argument
      ]);

      setUsersList(userListArray); // Set userListArray after both calls to fetchUsers
    } catch (err) {
      console.log(err);
    } finally {
      setOpenLoading(false);
    }
  };

  const fetchCloseUsers = async () => {
    setOpenLoading(true);
    try {
      const openSingleNumber =
        (parseInt(openMarketResult[0]) +
          parseInt(openMarketResult[1]) +
          parseInt(openMarketResult[2])) %
        10;

      const closeSingleNumber =
        (parseInt(closeMarketResult[0]) +
          parseInt(closeMarketResult[1]) +
          parseInt(closeMarketResult[2])) %
        10;

      const jodiNumber = `${openSingleNumber}${closeSingleNumber}`;

      const HSnumber1 = `${openMarketResult}-${closeSingleNumber}`;
      const HSnumber2 = `${openSingleNumber}-${closeMarketResult}`;

      const FSNumber = `${openMarketResult}-${jodiNumber}-${closeMarketResult}`;

      const userListArray: UserListDataType[] = [];

      await Promise.all([
        fetchUsers(closeMarketResult, "CLOSE", userListArray), // Pass userListArray as an argument
        fetchUsers(String(closeSingleNumber), "CLOSE", userListArray), // Pass userListArray as an argument
        fetchUsers(jodiNumber, "OPEN", userListArray), // Pass userListArray as an argument
        fetchUsers(HSnumber1, "OPEN", userListArray), // Pass userListArray as an argument
        fetchUsers(HSnumber2, "OPEN", userListArray), // Pass userListArray as an argument
        fetchUsers(FSNumber, "OPEN", userListArray), // Pass userListArray as an argument
      ]);

      setUsersList(userListArray);
    } catch (err) {
      console.log(err);
    } finally {
      setOpenLoading(false);
    }
  };

  const handleOpenClick = () => {
    fetchOpenUsers();
    setShowOpenWinners(!showOpenWinners);
  };

  const hanldeCloseClick = () => {
    fetchCloseUsers();
    setShowOpenWinners(!showOpenWinners);
  };

  const checkRewards = async (
    phone: string,
    gameName: string,
    number: string,
    openClose: string
  ) => {
    const usersRef = ref(
      database,
      `USERS TRANSACTION/${phone}/WIN/DATE WISE/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }`
    );

    const snapshot = await get(usersRef);

    snapshot.forEach((winSnapshot) => {
      if (
        winSnapshot.val().NUMBER === number &&
        winSnapshot.val().OPEN_CLOSE === openClose
      ) {
        setRewardSentMap((prevData) => ({
          ...prevData,
          [`${phone}${gameName}${openClose}${number}`]: true,
        }));
      }
    });
  };

  // useEffect(() => {});
  // const [timeKey, setTimeKey] = useState("");

  const returnRewards = async (
    phone: string,
    gameName: string,
    number: string,
    winPoints: number
  ) => {
    const userRef = ref(database, `USERS/${phone}`);
    const userDayRef = ref(
      database,
      `USERS TRANSACTION/${phone}/WIN/DATE WISE/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }`
    );

    const openClose =
      gameName === "Jodi Digit" ||
      gameName === "Half Sangam" ||
      gameName === "Full Sangam"
        ? "OPEN"
        : gameId.split("___")[2];

    console.log(gameName, openClose, number);

    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const previousAmount = snapshot.val().AMOUNT;

      const currentAmount = Math.abs(winPoints - previousAmount);

      await update(userRef, { AMOUNT: currentAmount });
    }

    const promises: Promise<void>[] = [];

    const promise = get(userDayRef).then((userDaySnapshot) => {
      userDaySnapshot.forEach((timeSnap) => {
        if (
          timeSnap.val().OPEN_CLOSE === openClose &&
          timeSnap.val().NUMBER === number
        ) {
          const timeKey = timeSnap.key;

          const totalTransactionTotalRef = ref(
            database,
            `TOTAL TRANSACTION/WIN/TOTAL/${gameId.split("___")[0]}/${timeKey}`
          );
          const totalTransactionDateWiseRef = ref(
            database,
            `TOTAL TRANSACTION/WIN/DATE WISE/${year}/${month}/${date}/${
              gameId.split("___")[0]
            }/${timeKey}`
          );

          console.log(timeKey);

          const userTransactionDateWiseRef = ref(
            database,
            `USERS TRANSACTION/${phone}/WIN/DATE WISE/${year}/${month}/${date}/${
              gameId.split("___")[0]
            }/${timeKey}`
          );

          const userTransactionTotalRef = ref(
            database,
            `USERS TRANSACTION/${phone}/WIN/TOTAL/${
              gameId.split("___")[0]
            }/${timeKey}`
          );

          const promise1 = remove(userTransactionDateWiseRef).then(() => {
            remove(totalTransactionTotalRef);
            remove(totalTransactionDateWiseRef);
            remove(userTransactionTotalRef);
          });

          setRewardSentMap((prevData) => ({
            ...prevData,
            [`${phone}${gameName}${openClose}${number}`]: false,
          }));

          promises.push(promise1);

          toast.success("Win points returned");
        }
      });
    });
    promises.push(promise);

    await Promise.all(promises);
  };

  // Function to check if all rewards are sent
  const checkUsersRewards = () => {
    if (!rewardSentMap) return false;
    return Object.values(rewardSentMap).every((value) => value === false);
  };

  useEffect(() => {
    checkUsersRewards();
  }, [rewardSentMap]);

  const sendRewards = async (
    userName: string,
    phone: string,
    gameName: string,
    number: string,
    points: number,
    winPoints: number
  ) => {
    const timestamp = Date.now();

    const usersAmountRef = ref(database, `USERS/${phone}`);
    const userSnapshot = await get(usersAmountRef);
    const previousPoints = userSnapshot.val().AMOUNT;
    const newPoints = previousPoints + winPoints;

    await update(usersAmountRef, { AMOUNT: newPoints });

    const openClose =
      gameName === "Jodi Digit" ||
      gameName === "Half Sangam" ||
      gameName === "Full Sangam"
        ? "OPEN"
        : gameId.split("___")[2];

    const transactionData = {
      DATE: dateString,
      MARKET_ID: gameId.split("___")[0],
      MARKET_NAME: gameId.split("___")[1],
      NAME: userName,
      NEW_POINTS: newPoints,
      NUMBER: number,
      OPEN_CLOSE: openClose,
      PHONE: phone,
      POINTS: String(points),
      PREVIOUS_POINTS: previousPoints,
      TYPE: gameName,
      WIN_POINTS: winPoints,
    };

    const totalTransactionTotalRef = ref(
      database,
      `TOTAL TRANSACTION/WIN/TOTAL/${gameId.split("___")[0]}/${timestamp}`
    );
    const totalTransactionDateWiseRef = ref(
      database,
      `TOTAL TRANSACTION/WIN/DATE WISE/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }/${timestamp}`
    );
    const userTransactionDateWiseRef = ref(
      database,
      `USERS TRANSACTION/${phone}/WIN/DATE WISE/${year}/${month}/${date}/${
        gameId.split("___")[0]
      }/${timestamp}`
    );
    const userTransactionTotalRef = ref(
      database,
      `USERS TRANSACTION/${phone}/WIN/TOTAL/${
        gameId.split("___")[0]
      }/${timestamp}`
    );

    await Promise.all([
      set(totalTransactionTotalRef, transactionData),
      set(totalTransactionDateWiseRef, transactionData),
      set(userTransactionDateWiseRef, transactionData),
      set(userTransactionTotalRef, transactionData),
    ]);

    await checkRewards(phone, gameName, number, openClose);
  };

  // console.log(usersList);

  const sendAllRewards = async () => {
    if (usersList) {
      for (const users of usersList) {
        if (
          !rewardSentMap[
            `${users.phone}${users.gameName}${
              users.gameName === "Jodi Digit" ||
              users.gameName === "Half Sangam" ||
              users.gameName === "Full Sangam"
                ? "OPEN"
                : gameId.split("___")[2]
            }${users.number}`
          ]
        )
          await sendRewards(
            users.userName,
            users.phone,
            users.gameName,
            users.number,
            users.points,
            users.points * (users.gameRate / 10)
          );
      }
    }

    checkAllRewards();
    toast.success("Rewards successfully sent to all winners");
  };

  const [allRewardsSent, setAllRewardsSent] = useState(false);

  useEffect(() => {
    checkAllRewards();
  }, [rewardSentMap]);

  const checkAllRewards = () => {
    console.log(usersList);
    if (
      usersList &&
      usersList.every(
        (user) =>
          rewardSentMap[
            `${user.phone}${user.gameName}${
              user.gameName === "Jodi Digit" ||
              user.gameName === "Half Sangam" ||
              user.gameName === "Full Sangam"
                ? "OPEN"
                : gameId.split("___")[2]
            }${user.number}`
          ]
      )
    ) {
      setAllRewardsSent(true);
    } else {
      setAllRewardsSent(false);
    }
  };

  return (
    <div className="rewards">
      {gameId.split("___")[2] === "OPEN" && (
        <div className="rewards_container">
          <label>Market Result</label>
          <input
            type="text"
            placeholder="Enter 3 digits"
            pattern="[0-9]{3}" // Restrict to only numeric entries with exactly 3 digits
            title="Please enter exactly 3 numeric digits"
            maxLength={3}
            inputMode="numeric"
            value={openMarketResult}
            readOnly
            //   onChange={handleOpenInputChnage}
          />
          <button onClick={handleOpenClick}>Search Winners</button>
        </div>
      )}
      {gameId.split("___")[2] === "CLOSE" && (
        <div className="rewards_container">
          <label>Market Result</label>
          <input
            type="text"
            placeholder="Enter 3 digits"
            pattern="[0-9]{3}" // Restrict to only numeric entries with exactly 3 digits
            title="Please enter exactly 3 numeric digits"
            maxLength={3}
            inputMode="numeric"
            value={closeMarketResult}
            //   onChange={handleOpenInputChnage}
          />
          <button onClick={hanldeCloseClick}>Search Winners</button>
        </div>
      )}

      {!showOpenWinners ? (
        ""
      ) : openLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {usersList && usersList.length > 0 ? (
            <div className="winning_users_container">
              <div className="header_winners">
                <h3>Winning Users</h3>
                <button
                  onClick={sendAllRewards}
                  disabled={allRewardsSent}
                  className={allRewardsSent ? "rewards_sent" : ""}
                >
                  {allRewardsSent ? (
                    <p className="button_text">
                      ✓ Sent <span>Rewards</span>
                    </p>
                  ) : (
                    <>
                      Send <span>Rewards</span>
                      <img src="/gift.png" alt="" />
                    </>
                  )}
                </button>
              </div>

              <ul>
                {usersList.map((users) => (
                  <li key={`${users.phone}${users.gameName}`}>
                    <div className="users_list">
                      <div className="phone_gameName">
                        <div className="phone">
                          +91 {users.phone}{" "}
                          <span>({users.userName.split(" ")[0]})</span>
                        </div>
                        <div className="gameName">
                          {users.gameName} <span>({users.number})</span>
                        </div>
                      </div>
                      <div className="winning_button">
                        <div className="winning_points">
                          {users.points} &#8377; x {users.gameRate / 10} Rate{" "}
                          <span className="equal">=</span>
                          <span>
                            {users.points * (users.gameRate / 10)} &#8377;
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            returnRewards(
                              users.phone,
                              users.gameName,
                              users.number,
                              users.points * (users.gameRate / 10)
                            )
                          }
                          disabled={
                            !rewardSentMap[
                              `${users.phone}${users.gameName}${
                                users.gameName === "Jodi Digit" ||
                                users.gameName === "Half Sangam" ||
                                users.gameName === "Full Sangam"
                                  ? "OPEN"
                                  : gameId.split("___")[2]
                              }${users.number}`
                            ]
                          }
                          className={
                            rewardSentMap[
                              `${users.phone}${users.gameName}${
                                users.gameName === "Jodi Digit" ||
                                users.gameName === "Half Sangam" ||
                                users.gameName === "Full Sangam"
                                  ? "OPEN"
                                  : gameId.split("___")[2]
                              }${users.number}`
                            ] || allRewardsSent
                              ? "rewards_sent"
                              : ""
                          }
                        >
                          {rewardSentMap[
                            `${users.phone}${users.gameName}${
                              users.gameName === "Jodi Digit" ||
                              users.gameName === "Half Sangam" ||
                              users.gameName === "Full Sangam"
                                ? "OPEN"
                                : gameId.split("___")[2]
                            }${users.number}`
                          ] ? (
                            <>
                              <span>Return</span>
                              <img src="/gift.png" alt="" />
                            </>
                          ) : (
                            <>
                              <p className="button_text">
                                {checkUsersRewards() ? "..." : "✓ Returned"}
                              </p>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="no-data">
              <img src="/noData.gif" alt="" className="no-data-img" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SentRewards;
