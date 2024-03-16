import { useEffect } from "react";
import { get, ref, set } from "firebase/database";
import { database } from "../../../firebase";
import { Switch } from "@mui/material";
import "./AdminRoles.scss";
import { usePermissionContext } from "../../AdmissionPermission";

interface AdminProps {
  adminId: string;
}

type UsersPermission = {
  key: string;
  value: boolean;
};

const AdminRoles: React.FC<AdminProps> = ({ adminId }) => {
  const { permission, setPermission } = usePermissionContext();
  const { switched, setSwitched } = usePermissionContext();

  useEffect(() => {
    const fetchPermissionData = async () => {
      const permissionRef = ref(
        database,
        `ADMIN/SUB_ADMIN/${adminId}/PERMISSIONS`
      );

      const permissionArray: UsersPermission[] = [];

      const snapshots = await get(permissionRef);
      if (snapshots.exists()) {
        snapshots.forEach((snapshot) => {
          permissionArray.push({
            key: snapshot.key,
            value: snapshot.val(),
          });
        });
        setPermission(permissionArray);
      }
    };
    fetchPermissionData();
  }, [switched]);

  console.log(permission);

  const handleToggle = (key: string, value: boolean) => {
    const permissionRef = ref(
      database,
      `ADMIN/SUB_ADMIN/${adminId}/PERMISSIONS/${key}`
    );

    set(permissionRef, !value);
    setSwitched(!switched);
  };

  return (
    <div className="permission_container">
      <h3>
        Admin Roles <span>({adminId})</span>
      </h3>
      {permission &&
        permission.map((data) => (
          <div className="permissions" key={data.key}>
            <h4>{data.key}</h4>
            <Switch
              className="switch"
              checked={data.value}
              color="success"
              onClick={() => handleToggle(data.key, data.value)}
            />
          </div>
        ))}
    </div>
  );
};

export default AdminRoles;
