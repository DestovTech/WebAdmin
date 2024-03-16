// TemporaryDrawer.tsx
import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./menu.scss";
import { menu } from "../../data";
import { Link } from "react-router-dom";
import {
  //   Box,
  Drawer,
  List,
  //   ListItem,
  //   ListItemButton,
  //   ListItemIcon,
  //   ListItemText,
} from "@mui/material";
import { UsersPermissions, usePermissionContext } from "../AdmissionPermission";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { useAuth } from "../auth-context";

type Anchor = "left";

export default function TemporaryDrawer() {
  const [permissions, setPermissions] = useState<UsersPermissions | null>(null);
  const { user, isSubAuthenticated } = useAuth();
  const { permission } = usePermissionContext();

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

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <List
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="temp_menu_drawer">
        {filteredMenu.map((item) => (
          <div className="item" key={item.id}>
            <span className="title">{item.title}</span>
            {item.listItems.map((listItem) =>
              isSubAuthenticated && listItem.title === "Admin Users" ? null : (
                <Link to={listItem.url} className="listItem" key={listItem.id}>
                  <img src={listItem.icon} alt="" className="listItem_icon" />
                  {/* <ListItemText primary={listItem.title} /> */}
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              )
            )}
          </div>
        ))}
      </div>
    </List>
  );

  return (
    <div className="menuDrawer">
      <IconButton
        onClick={toggleDrawer("left", true)}
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer("left", false)}
      >
        <div style={{ background: "#F5F5F5" }}>{list("left")}</div>
      </Drawer>
    </div>
  );
}
