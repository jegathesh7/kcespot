import { useEffect, useState } from "react";
import api from "../../api/axios";
import AchieversTable from "./AchieversTable";
import AchieversForm from "./AchieversForm";

export default function AchieversPage() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editAchiever, setEditAchiever] = useState(null);

  const loadData = async () => {
    const res = await api.get("/achievers");
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    if (editAchiever) {
      await api.put(`/achievers/${editAchiever._id}`, formData);
    } else {
      await api.post("/achievers", formData);
    }

    setShowForm(false);
    setEditAchiever(null);
    loadData();
  };

  const handleEdit = (row) => {
    setEditAchiever(row);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this achiever?")) {
      await api.delete(`/achievers/${id}`);
      loadData();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Achievers Data</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditAchiever(null);
            setShowForm(true);
          }}
        >
          + ADD
        </button>
      </div>

      {showForm && (
        <AchieversForm
          onSave={handleSave}
          initialData={editAchiever}
          onCancel={() => {
            setShowForm(false);
            setEditAchiever(null);
          }}
        />
      )}

      <AchieversTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}