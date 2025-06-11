import { useEffect } from "react";
import { useUserApi } from "../api/users.api";
import DataTableComponent from "./DataTable";

const UsersComponent = () => {
  const { getUsers, users } = useUserApi();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const contentHeaders = users.length > 0
        ? ["username", "email", "role", "date"]
        : [];

  const users_data = users.map((user) => ({
      username: user.username,
      email: user.email,
      role: user.role,
      date: user.createdAt
  }));

  return (
    <div className="table-responsive w-100">
      <DataTableComponent 
        content_data={users_data}
        content_headers={contentHeaders}
      />
    </div>
  );
};

export default UsersComponent;
