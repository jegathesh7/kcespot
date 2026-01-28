import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import EventsTable from "./EventsTable";
import EventsForm from "./EventsForm";
import "./events.css";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [events, setEvents] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const loadEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (error) {
       console.error("Failed to load events", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEdit = (event) => {
    setEditingItem(event);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        loadEvents();
      } catch (error) {
         console.error("Failed to delete event", error);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/events/${editingItem._id}`, formData);
      } else {
        await api.post("/events", formData);
      }
      setActiveTab("list");
      setEditingItem(null);
      loadEvents();
    } catch (error) {
       console.error("Failed to save event", error);
       alert("Failed to save event");
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
           <h2 className="fw-bold text-primary mb-0">Events Management</h2>
           <p className="text-muted small mb-0">Create and manage upcoming college events</p>
        </div>
      </div>

      <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={(k) => {
          setActiveTab(k);
          if (k === "list") setEditingItem(null);
          else if (k === "form" && !editingItem) setEditingItem(null);
      }}>
        <Nav.Item>
          <Nav.Link eventKey="list" className="fw-bold px-4">View List</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="fw-bold px-4">{editingItem ? "Edit Event" : "Add New"}</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <EventsTable data={events} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {activeTab === "form" && (
        <EventsForm 
           initialData={editingItem} 
           onSave={handleSave} 
           onCancel={handleCancel} 
        />
      )}
    </Container>
  );
}