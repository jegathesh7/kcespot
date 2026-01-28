export default function AchieversTable({ data }) {
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
              <img src={a.posterImage} alt="" height="40" />
            </td>
            <td>{a.status ? "Enable" : "Disable"}</td>
            <td>Edit | Delete</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}