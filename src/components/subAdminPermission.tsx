// import { get, ref } from "firebase/database";
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { database } from "../firebase";

// type UsersPermissions = {
//   USERS: boolean;
//   USERS_DEPOSIT: boolean;
//   USERS_WITHDRAW: boolean;
// };

// interface PermissionContextProps {
//   permissions: UsersPermissions | null;
//   setPermissions: (data: UsersPermissions | null) => void;
// }

// const PermissionContext = createContext<PermissionContextProps | undefined>(
//   undefined
// );

// export const PermissionProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [permissions, setPermissions] = useState<UsersPermissions | null>(null);
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const handleUserChange = () => {
//       const userString = localStorage.getItem("user");
//       if (userString !== null) {
//         const user = JSON.parse(userString);
//         setUsername(user.ID);
//       }
//     };

//     // Listen to storage events to detect changes in localStorage
//     window.addEventListener("storage", handleUserChange);

//     // Initial check to set the username on component mount
//     handleUserChange();

//     return () => {
//       // Remove the event listener when the component unmounts
//       window.removeEventListener("storage", handleUserChange);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       if (!username) return;

//       const permissionRef = ref(
//         database,
//         `ADMIN/SUB_ADMIN/${username}/PERMISSIONS`
//       );

//       const permissionSnapshot = await get(permissionRef);
//       if (permissionSnapshot.exists()) {
//         setPermissions(permissionSnapshot.val());
//       }
//     };

//     fetchPermissions();
//   }, [username]);

//   return (
//     <PermissionContext.Provider
//       value={{
//         permissions,
//         setPermissions,
//       }}
//     >
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// export const usePermissionContext = () => {
//   const context = useContext(PermissionContext);
//   if (!context) {
//     throw new Error(
//       "usePermissionContext must be used within an PermissionProvider"
//     );
//   }
//   return context;
// };
