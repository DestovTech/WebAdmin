import { get, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
// import { usePermissionContext } from "../subAdminPermission";
import "./AdminUsersComponent.scss";
import { RiAdminFill } from "react-icons/ri";
import AddSubAdmin from "./AddSubAdmin/AddSubAdmin";
import { toast } from "react-toastify";
import EditSubAdmin from "./EditSubAdmin/EditSubAdmin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth-context";

export type SubAdminDataType = {
  ID: string;
  PASSWORD: string;
  FULL_NAME: string;
};

const AdminUsersComponent = () => {
  //   const { permissions } = usePermissionContext();
  const [subAdminData, setSubAdminData] = useState<SubAdminDataType[] | null>(
    null
  );

  const navigate = useNavigate();

  const [addAdmin, setAddAdmin] = useState(false);
  const [editAdmin, setEditAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [dataChanged, setDataChanged] = useState(false); // Track changes in data

  useEffect(() => {
    const getSubAdminData = async () => {
      const adminRef = ref(database, `ADMIN/SUB_ADMIN`);

      const snapshots = await get(adminRef);
      const subAdminDataArray: SubAdminDataType[] | null = [];

      snapshots.forEach((snapshot) => {
        const data = snapshot.val().AUTH;
        subAdminDataArray.push({
          ...data,
        });
      });
      setSubAdminData(subAdminDataArray);
    };

    getSubAdminData();
  }, [addAdmin, dataChanged, editAdmin]);

  const handleDelete = (username: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete admin ${username}?`
    );

    if (!userConfirmed) {
      return;
    }

    const adminRef = ref(database, `ADMIN/SUB_ADMIN/${username}`);
    remove(adminRef).then(() => {
      toast.success("Admin deleted successfully");
      setDataChanged(!dataChanged);
    });
  };

  const handleEdit = (username: string) => {
    setUserName(username);
    setEditAdmin(!editAdmin);
  };

  const handleRoles = (username: string) => {
    navigate(`/subAdmin/adminRoles___${username}`);
  };

  const { isSubAuthenticated } = useAuth();

  return (
    <>
      {!isSubAuthenticated ? (
        <div className="admin_users">
          {editAdmin && (
            <EditSubAdmin setEditAdmin={setEditAdmin} userName={userName} />
          )}
          {addAdmin && <AddSubAdmin setAddAdmin={setAddAdmin} />}
          <div className="admin_header">
            <h2>Admin Users</h2>
            <div
              className="add_admin_button"
              onClick={() => setAddAdmin(!addAdmin)}
            >
              Add New <RiAdminFill />
            </div>
          </div>
          {subAdminData ? (
            <div className="table_container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Actions</th>
                    <th>Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {subAdminData &&
                    subAdminData.map((data) => (
                      <tr key={data.ID}>
                        <td>{data.FULL_NAME}</td>
                        <td>{data.ID}</td>
                        <td>{data.PASSWORD}</td>
                        <td>
                          <div className="actions">
                            <img
                              src="view.svg"
                              alt=""
                              onClick={() => handleEdit(data.ID)}
                            />
                            <img
                              src="delete.svg"
                              alt=""
                              onClick={() => handleDelete(data.ID)}
                            />
                          </div>
                        </td>
                        <td>
                          <img
                            src="admin-roles.png"
                            alt=""
                            className="admin_roles_img"
                            onClick={() => handleRoles(data.ID)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <img src="/noData.gif" alt="" className="no-data-img" />
            </div>
          )}
        </div>
      ) : (
        <p>No access to this data!!!</p>
      )}
    </>
  );
};

export default AdminUsersComponent;
