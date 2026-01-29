import { useEffect, useState } from "react";
import api from "../../api/axios";
import EventsForm from "./EventsForm";
import EventsTable from "./EventsTable";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const loadEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ADD or UPDATE
  const handleSave = async (data) => {
    if (editEvent) {
      await api.put(`/events/${editEvent._id}`, data);
    } else {
      await api.post("/events", data);
    }

    setShowForm(false);
    setEditEvent(null);
    loadEvents();
  };

  // EDIT
  const handleEdit = (event) => {
    setEditEvent(event);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/events/${id}`);
      loadEvents();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Events Data</h2>
        <button onClick={() => {
          setEditEvent(null);
          setShowForm(true);
        }}>
          + ADD
        </button>
      </div>

      {showForm && (
        <EventsForm
          onSave={handleSave}
          initialData={editEvent}
          onCancel={() => {
            setShowForm(false);
            setEditEvent(null);
          }}
        />
      )}

      <EventsTable
        data={events}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}