import { useEffect, useState } from "react";

export default function AchieversForm({ onSave, initialData, onCancel }) {
  const [entryType, setEntryType] = useState("image");

  const [form, setForm] = useState({
    name: "",
    batch: "",
    category: "",
    description: "",
    status: true,
    eventDate: "",
    posterImage: "",
    students: [],
  });

  // ✅ populate when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        eventDate: initialData.eventDate?.substring(0, 10) || "",
      });
      setEntryType(initialData.posterImage ? "image" : "manual");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleStudentChange = (index, field, value) => {
    const updated = [...form.students];
    updated[index][field] = value;
    setForm({ ...form, students: updated });
  };

  const handleStudentCount = (count) => {
    const students = Array.from({ length: count }, () => ({
      name: "",
      year: "",
      dept: "",
      imageUrl: "",
    }));
    setForm({ ...form, students });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <input
        name="name"
        placeholder="Achievement Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="batch"
        placeholder="Batch"
        value={form.batch}
        onChange={handleChange}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option>Academics</option>
        <option>Placement</option>
        <option>Hackathon</option>
        <option>Sports</option>
        <option>Others</option>
      </select>

      {/* RADIO */}
      <div>
        <label>
          <input
            type="radio"
            checked={entryType === "image"}
            onChange={() => setEntryType("image")}
          />
          Image URL
        </label>

        <label style={{ marginLeft: 15 }}>
          <input
            type="radio"
            checked={entryType === "manual"}
            onChange={() => setEntryType("manual")}
          />
          Manual Entry
        </label>
      </div>

      {entryType === "image" && (
        <input
          name="posterImage"
          placeholder="Poster Image URL"
          value={form.posterImage}
          onChange={handleChange}
        />
      )}

      {entryType === "manual" && (
        <>
          <input
            type="number"
            min="1"
            placeholder="Number of Students"
            onChange={(e) => handleStudentCount(Number(e.target.value))}
          />

          {form.students.map((s, i) => (
            <div key={i} className="student-box">
              <h4>Student {i + 1}</h4>
              <input
                placeholder="Name"
                value={s.name}
                onChange={(e) =>
                  handleStudentChange(i, "name", e.target.value)
                }
              />
              <input
                placeholder="Year"
                value={s.year}
                onChange={(e) =>
                  handleStudentChange(i, "year", e.target.value)
                }
              />
              <input
                placeholder="Department"
                value={s.dept}
                onChange={(e) =>
                  handleStudentChange(i, "dept", e.target.value)
                }
              />
              <input
                placeholder="Image URL"
                value={s.imageUrl}
                onChange={(e) =>
                  handleStudentChange(i, "imageUrl", e.target.value)
                }
              />
            </div>
          ))}
        </>
      )}

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="date"
        name="eventDate"
        value={form.eventDate}
        onChange={handleChange}
      />

      <label>
        Status
        <input
          type="checkbox"
          name="status"
          checked={form.status}
          onChange={handleChange}
        />
      </label>

      <button type="submit">
        {initialData ? "Update" : "Save"}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}