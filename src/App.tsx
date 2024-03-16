import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/Users";
import Games from "./pages/games/Games";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/user/User";
import Game from "./pages/game/Game";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TemporaryDrawer from "./components/menu/TemporaryDrawer";
import Deposit from "./pages/Deposit/Deposit";
import Withdraw from "./pages/Withdraw/Withdraw";
import { AuthProvider, useAuth } from "./components/auth-context";
import GameRate from "./pages/GameRate/GameRate";
import GameSettings from "./pages/GameSettings/GameSettings";
import Notification from "./pages/Notification/Notification";
import Bid from "./pages/Bid/Bid";
import BidDetails from "./pages/Bid/BidDetails";
import Win from "./pages/Win/Win";
import WinDetail from "./pages/Win/WinDetail";
import { BidComponentProvider } from "./components/BidComponent/BidComponentContext";
import Payout from "./pages/Payout/Payout";
import Settings from "./pages/Settings/Settings";
import ManualRequest from "./pages/ManualRequest/ManualRequest";
import Rewards from "./pages/games/Rewards/Rewards";
import {
  PermissionProvider,
  usePermissionContext,
} from "./components/AdmissionPermission";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import { useEffect } from "react";
import { get, ref } from "firebase/database";
import { database } from "./firebase";
import AdminRole from "./pages/AdminUsers/AdminRoles/AdminRole";
import GameChart from "./pages/GameChart/GameChart";
import GameResult from "./pages/GameChart/GameResult";
import NotFoundPage from "./components/NotFoundComponent/NotFoundPage";

const Layout = () => {
  const { isAuthenticated, isSubAuthenticated } = useAuth();

  const { setPermissions } = usePermissionContext();
  const { username, setUsername, switched, permission } =
    usePermissionContext();

  useEffect(() => {
    const fetchPermissions = async () => {
      const userString = localStorage.getItem("user");
      if (userString !== null) {
        const user = await JSON.parse(userString);
        setUsername(user.ID);
      }
      if (!username) return;

      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${username}/PERMISSIONS`
      );

      const permissionSnapshot = await get(permissionRef);
      if (permissionSnapshot.exists()) {
        setPermissions(permissionSnapshot.val());
      }
    };

    fetchPermissions();
  }, [username, switched, permission]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          // Use the service worker for push notifications
          console.log("Service registered", registration);
          // messaging.useServiceWorker(registration);
        })
        .catch((error) => {
          console.error("Error registering service worker:", error);
        });
    }
  }, []);

  return (
    <div>
      {isAuthenticated || isSubAuthenticated ? (
        <div className={`main ${isSubAuthenticated ? "sub_main" : ""}`}>
          <div className="main_navbar">
            <div className="menu_drawer">
              <TemporaryDrawer />
            </div>
            <Navbar />
          </div>
          <div className="container">
            <div
              className={`menuContainer ${
                isSubAuthenticated ? "sub_menuContainer" : ""
              }`}
            >
              <Menu />
            </div>
            <div className="contentContainer">
              <BidComponentProvider>
                <Outlet />
              </BidComponentProvider>
            </div>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      ) : (
        // Render only the login page when not authenticated
        <Login />
      )}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/payout",
        element: <Payout />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/market",
        element: <Games />,
      },
      {
        path: "/rewards/:id",
        element: <Rewards />,
      },
      {
        path: "/users/:id",
        element: <User />,
      },
      {
        path: "/games/:id",
        element: <Game />,
      },
      {
        path: "/deposit",
        element: <Deposit />,
      },
      {
        path: "/withdraw",
        element: <Withdraw />,
      },
      {
        path: "/bid",
        element: <Bid />,
      },
      {
        path: "/win",
        element: <Win />,
      },
      {
        path: "/gameRate",
        element: <GameRate />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/gameSettings",
        element: <GameSettings />,
      },
      {
        path: "/notifications",
        element: <Notification />,
      },
      {
        path: "/manualRequest",
        element: <ManualRequest />,
      },
      {
        path: "/bid/:id",
        element: <BidDetails />,
      },
      {
        path: "/win/:id",
        element: <WinDetail />,
      },
      {
        path: "/subAdmin",
        element: <AdminUsers />,
      },
      {
        path: "/subAdmin/:id",
        element: <AdminRole />,
      },
      {
        path: "/gameChart",
        element: <GameChart />,
      },
      {
        path: "/gameChart/:id",
        element: <GameResult />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <PermissionProvider>
          <>
            <ToastContainer />
            <RouterProvider router={router} />
          </>
        </PermissionProvider>
      </AuthProvider>
    </>
  );
}

export default App;
