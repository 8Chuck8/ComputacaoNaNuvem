import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UserFormModal = ({ show, onClose, mode, userData, onSubmit }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

  useEffect(() => {
    if (mode === "edit" && userData) {
      setForm({ ...userData, password: "" });
    } else {
      setForm({ username: "", email: "", password: "", role: "user" });
    }
  }, [mode, userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(form);
    if (result?.success) {
        onClose(); // Only close if successful
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "edit" ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Form.Group>

          {/* Password (only if adding) */}
          {mode === "add" && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Form.Group>
          )}

          {/* Role */}
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">{mode === "edit" ? "Update" : "Create"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserFormModal;