import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import UsersTable from "./UsersTable";
//import "./users.css";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [users, setUsers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingItem(user);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/users/${editingItem._id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      setActiveTab("list");
      setEditingItem(null);
      loadUsers();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save user");
    }
  };

  const handleCancel = () => {
    setActiveTab("list");
    setEditingItem(null);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold text-primary mb-0">User Management</h2>
          <p className="text-muted small mb-0">
            Manage registered users
          </p>
        </div>
      </div>

      <Nav
        variant="tabs"
        className="mb-4"
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          if (k === "list") setEditingItem(null);
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="fw-bold px-4">
            View List
          </Nav.Link>
        </Nav.Item>
        
      </Nav>

      {activeTab === "list" && (
        <UsersTable
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {activeTab === "form" && (
        <UsersForm
          initialData={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </Container>
  );
}