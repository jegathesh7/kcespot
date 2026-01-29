import { useEffect, useState } from "react";

export default function EventsForm({ onSave, initialData, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    campus: "",
    venue: "",
    mode: "",
    organizer: "",
    type: "",
    visibility: "",
    targetAudience: "",
    status: true,
    eventDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        startDate: initialData.startDate?.substring(0, 10) || "",
        endDate: initialData.endDate?.substring(0, 10) || "",
        eventDate: initialData.eventDate?.substring(0, 10) || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      {/* Text inputs */}
      <input
        name="title"
        placeholder="Event Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="startDate"
        placeholder="Start Date"
        value={form.startDate}
        onChange={handleChange}
      />

      <input
        type="date"
        name="endDate"
        placeholder="End Date"
        value={form.endDate}
        onChange={handleChange}
      />

      <input
        name="campus"
        placeholder="Campus"
        value={form.campus}
        onChange={handleChange}
      />

      <input
        name="venue"
        placeholder="Venue"
        value={form.venue}
        onChange={handleChange}
      />

      <input
        name="organizer"
        placeholder="Organizer"
        value={form.organizer}
        onChange={handleChange}
      />

      <input
        name="targetAudience"
        placeholder="Target Audience"
        value={form.targetAudience}
        onChange={handleChange}
      />

      {/* Select with placeholder */}
      <select name="mode" value={form.mode} onChange={handleChange}>
        <option value="" disabled>
          Select Mode
        </option>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
      </select>

      <select name="type" value={form.type} onChange={handleChange}>
        <option value="" disabled>
          Select Event Type
        </option>
        <option value="Workshop">Workshop</option>
        <option value="Competition">Competition</option>
        <option value="Hackathon">Hackathon</option>
        <option value="Cultural">Cultural</option>
        <option value="Seminar">Seminar</option>
        <option value="Others">Others</option>
      </select>

      <select name="visibility" value={form.visibility} onChange={handleChange}>
        <option value="" disabled>
          Select Visibility
        </option>
        <option value="KCE">KCE</option>
        <option value="KIT">KIT</option>
        <option value="KAHE">KAHE</option>
        <option value="All Colleges">All Colleges</option>
      </select>

      {/* Status */}
      <label className="toggle">
        Status
        <input
          type="checkbox"
          name="status"
          checked={form.status}
          onChange={handleChange}
        />
      </label>

      {/* Buttons */}
      <button type="submit">
        {initialData ? "Update Event" : "Save Event"}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}