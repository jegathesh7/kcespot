import { useState } from "react";

export default function EventsForm({ onSave }) {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
   // const fd = new FormData();
    //Object.keys(form).forEach((key) => fd.append(key, form[key]));
    onSave(form);
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <input name="title" placeholder="Event Title" onChange={handleChange} required />

      <input type="date" name="startDate" placeholder="Start Date" onChange={handleChange} />
      <input type="date" name="endDate" placeholder="End Date" onChange={handleChange} />

      <input name="campus" placeholder="Campus" onChange={handleChange} />
      <input name="venue" placeholder="Venue" onChange={handleChange} />

      <select name="mode" onChange={handleChange}>
        <option value="">Mode of Event</option>
        <option>Online</option>
        <option>Offline</option>
      </select>

      <input name="organizer" placeholder="Organizer" onChange={handleChange} />

      <select name="type" onChange={handleChange}>
        <option value="">Event Type</option>
        <option>Workshop</option>
        <option>Competition</option>
        <option>Hackathon</option>
        <option>Cultural</option>
        <option>Seminar</option>
        <option>Others</option>
      </select>

      <select name="visibility" onChange={handleChange}>
        <option value="">Visibility</option>
        <option>KCE</option>
        <option>KIT</option>
        <option>KAHE</option>
        <option>All Colleges</option>
      </select>

      <input
        name="targetAudience"
        placeholder="Target Audience"
        onChange={handleChange}
      />

      <input type="date" name="eventDate" onChange={handleChange} />

      <label className="toggle">
        Status
        <input
          type="checkbox"
          name="status"
          checked={form.status}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Save</button>
    </form>
  );
}