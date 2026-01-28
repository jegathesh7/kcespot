import { useEffect, useState } from "react";
import api from "../../api/axios";
import AchieversTable from "./AchieversTable";
import AchieversForm from "./AchieversForm";
import "./achievers.css";

export default function AchieversPage() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    const res = await api.get("/achievers");
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    await api.post("/achievers", formData);
    setShowForm(false);
    loadData();
  };

  return (
    <div>
      {/* Header row */}
      <div className="page-header">
        <h2>Achievers Data</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + ADD
        </button>
      </div>

      {/* Inline Form */}
      {showForm && <AchieversForm onSave={handleSave} />}

      {/* Table */}
      <AchieversTable data={data} />
    </div>
  );
}