import { useEffect, useState } from "react";
import api from "../../api/axios";
import EventsForm from "./EventsForm";
import EventsTable from "./EventsTable";
import "./events.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSave = async (formData) => {
    await api.post("/events", formData);
    setShowForm(false);
    loadEvents();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Events Data</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + ADD
        </button>
      </div>

      {showForm && <EventsForm onSave={handleSave} />}

      <EventsTable data={events} />
    </div>
  );
}