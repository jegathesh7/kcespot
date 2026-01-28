import { useState } from "react";

export default function AchieversForm({ onSave }) {
  const [entryType, setEntryType] = useState("image"); // image | manual
  const [studentCount, setStudentCount] = useState(0);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle student field change
  const handleStudentChange = (index, field, value) => {
    const updated = [...form.students];
    updated[index][field] = value;
    setForm({ ...form, students: updated });
  };

  // When number of students changes
  const handleStudentCount = (count) => {
    setStudentCount(count);
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
      <input name="name" placeholder="Achievement Name" onChange={handleChange} required />
      <input name="batch" placeholder="Batch" onChange={handleChange} />

      <select name="category" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option>Academics</option>
        <option>Placement</option>
        <option>Hackathon</option>
        <option>Sports</option>
        <option>Others</option>
      </select>

      {/* RADIO BUTTONS */}
      <div>
        <label>
          <input
            type="radio"
            name="entryType"
            value="image"
            checked={entryType === "image"}
            onChange={() => setEntryType("image")}
          />
          Image URL
        </label>

        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            name="entryType"
            value="manual"
            checked={entryType === "manual"}
            onChange={() => setEntryType("manual")}
          />
          Manual Entry
        </label>
      </div>

      {/* IMAGE URL OPTION */}
      {entryType === "image" && (
        <input
          type="text"
          placeholder="Poster Image URL"
          name="posterImage"
          onChange={handleChange}
        />
      )}

      {/* MANUAL ENTRY OPTION */}
      {entryType === "manual" && (
        <>
          <input
            type="number"
            min="1"
            placeholder="Number of Students"
            onChange={(e) => handleStudentCount(Number(e.target.value))}
          />

          {form.students.map((student, index) => (
            <div key={index} className="student-box">
              <h4>Student {index + 1}</h4>

              <input
                placeholder="Name"
                onChange={(e) =>
                  handleStudentChange(index, "name", e.target.value)
                }
              />

              <input
                placeholder="Year"
                onChange={(e) =>
                  handleStudentChange(index, "year", e.target.value)
                }
              />

              <input
                placeholder="Department"
                onChange={(e) =>
                  handleStudentChange(index, "dept", e.target.value)
                }
              />

              <input
                placeholder="Image URL"
                onChange={(e) =>
                  handleStudentChange(index, "imageUrl", e.target.value)
                }
              />
            </div>
          ))}
        </>
      )}

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <input type="date" name="eventDate" onChange={handleChange} />

      <label>
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