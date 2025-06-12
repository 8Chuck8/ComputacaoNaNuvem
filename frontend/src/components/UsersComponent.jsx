import { useEffect, useState } from "react";
import { useUserApi } from "../api/users.api";
import DataTableComponent from "./DataTable";
import UserFormModal from "./userFormModal"; // ⬅️ import the modal
import $ from 'jquery';
import toast from "react-hot-toast";

const UsersComponent = () => {
  const { getUsers, users } = useUserApi();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleEditContent = (id) => {
    console.log("Editing user with id:", id);
    const user = users.find((u) => u._id === id);
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddUser = () => {
    console.log("Opening modal to add user");
    setSelectedUser(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleFormSubmit = async (form) => {
    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(`/api/users/${form._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "add" ? "User created" : "User updated");
        setShowModal(false);
        setSelectedUser(null);
        getUsers();
        return { success: true };
      } else {
        toast.error(data.message || "Failed");
        return { success: false };
      }
    } catch (err) {
      toast.error("An error occurred");
      console.error(err);
      return { success: false };
    }
  };



  const contentHeaders = users.length > 0
    ? ["username", "email", "role", "date"]
    : [];

  const users_data = users.map((user) => ({
    _id: user._id, 
    username: user.username,
    email: user.email,
    role: user.role,
    date: user.createdAt
  }));

  return (
    <div className="table-responsive w-100">

      {/* ✅ Add User button */}
      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleAddUser}>
          + Add User
        </button>
      </div>

      <DataTableComponent
        content_data={users_data}
        content_headers={contentHeaders}
        handleEditContent={handleEditContent}
        type={'user'}
      />

      <UserFormModal
        show={showModal}
        onClose={() => {setShowModal(false); setSelectedUser(null);}}
        mode={modalMode}
        userData={selectedUser}
        onSubmit={handleFormSubmit}
        onDataChanged={getUsers}
      />
    </div>
  );
};

export default UsersComponent;
