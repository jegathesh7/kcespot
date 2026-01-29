export default function AchieversTable({ data, onEdit, onDelete }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Batch</th>
          <th>Category</th>
          <th>Poster</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((a) => (
          <tr key={a._id}>
            <td>{a.name}</td>
            <td>{a.batch}</td>
            <td>{a.category}</td>
            <td>
              {a.posterImage && (
                <img src={a.posterImage} alt="" height="40" />
              )}
            </td>
            <td>{a.status ? "Enable" : "Disable"}</td>
            <td>
              <button onClick={() => onEdit(a)}>Edit</button>
              <button onClick={() => onDelete(a._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}