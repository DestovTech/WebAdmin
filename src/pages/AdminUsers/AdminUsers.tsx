import AdminUsersComponent from "../../components/AdminUsersComponent/AdminUsersComponent";
import { useAuth } from "../../components/auth-context";
import "./AdminUsers.scss";

const AdminUsers = () => {
  const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  return (
    <div>
      {isAuthenticated ? (
        <AdminUsersComponent />
      ) : (
        <p>No access to this data!!!</p>
      )}
    </div>
  );
};

export default AdminUsers;
