import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import AchieversTable from "./AchieversTable";
import AchieversForm from "./AchieversForm";
import "./achievers.css";
export default function AchieversPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    const res = await api.get("/achievers");
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/achievers/${editingItem._id}`, formData);
      } else {
        await api.post("/achievers", formData);
      }
      setActiveTab("list");
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error("Failed to save achievement", error);
      alert("Failed to save achievement");
    }
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    await api.delete(`/achievers/${id}`);
    loadData();
  };
  const handleCancel = () => {
    setActiveTab("list");
    setEditingItem(null);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold text-primary mb-0">Achievers Management</h2>
          <p className="text-muted small mb-0">
            Record and manage student achievements
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
          else if (k === "form" && !editingItem) setEditingItem(null);
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="fw-bold px-4">
            View List
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="fw-bold px-4">
            {editingItem ? "Edit Entry" : "Add New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <AchieversTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {activeTab === "form" && (
        <AchieversForm
          initialData={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </Container>
  );
}
