import "./menu.scss";
import { Link } from "react-router-dom";
import { menu } from "../../data";
import { useEffect, useState } from "react";
import { UsersPermissions, usePermissionContext } from "../AdmissionPermission";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { useAuth } from "../auth-context";

const Menu = () => {
  const [permissions, setPermissions] = useState<UsersPermissions | null>(null);
  const { permission } = usePermissionContext();
  const { isSubAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isSubAuthenticated)
      try {
        const perRef = ref(database, `ADMIN/SUB_ADMIN/${user?.ID}/PERMISSIONS`);

        // get(perRef).then((snapshot) => {
        //   if (snapshot.exists()) {
        //     setPermissions(snapshot.val());
        //   } else {
        //     setPermissions(null);
        //   }
        // });

        const unsub = onValue(perRef, (snapshot) => {
          if (snapshot.exists()) {
            setPermissions(snapshot.val());
          } else {
            setPermissions(null);
          }
        });

        return () => unsub();
      } catch (err) {
        console.log(err);
      }
  }, [permission]);

  // Filter the menu based on permissions
  const filteredMenu = menu
    .map((item) => {
      // Filter listItems based on permissions
      const filteredListItems = item.listItems.filter((listItem) => {
        // Check if permissions exist and if the permission for listItem.id is true,
        // or if the permission is not present (default to true)
        return (
          !permissions ||
          (permissions[listItem.id] === undefined &&
            isSubAuthenticated &&
            listItem.id !== "ADMIN_USERS") ||
          permissions[listItem.id]
        );
      });

      return { ...item, listItems: filteredListItems };
    })
    // Remove menu items that don't have any list items left after filtering
    .filter((item) => item.listItems.length > 0);

  return (
    <div className="menu">
      {filteredMenu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link to={listItem.url} className="listItem" key={listItem.id}>
              <img src={listItem.icon} alt="" />
              <span id={`${listItem.title}`} className="listItemTitle">
                {listItem.title}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
