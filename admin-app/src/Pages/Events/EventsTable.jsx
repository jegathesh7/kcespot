export default function EventsTable({ data, onEdit, onDelete }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Campus</th>
          <th>Mode</th>
          <th>Type</th>
          <th>Visibility</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((e) => (
          <tr key={e._id}>
            <td>{e.title}</td>
            <td>{e.campus}</td>
            <td>{e.mode}</td>
            <td>{e.type}</td>
            <td>{e.visibility}</td>
            <td>{e.status ? "Enable" : "Disable"}</td>
            <td>
              <button onClick={() => onEdit(e)}>Edit</button>
              <button onClick={() => onDelete(e._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}