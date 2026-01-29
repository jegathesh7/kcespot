import { Table, Button, Badge } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UsersTable({ data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-5 text-muted">
        No users found.
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white rounded shadow-sm border">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 text-uppercase small fw-bold">Name</th>
            <th className="text-uppercase small fw-bold">College</th>
            <th className="text-uppercase small fw-bold">Batch</th>
            <th className="text-uppercase small fw-bold">Email</th>
            <th className="text-uppercase small fw-bold text-center">
              Status
            </th>
            <th className="pe-4 text-end text-uppercase small fw-bold">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((u) => (
            <tr key={u._id}>
              <td className="ps-4 fw-medium">{u.name}</td>
              <td>{u.collegeName}</td>
              
              <td className="text-muted small">{u.email}</td>
              <td className="text-center">
                <Badge bg={u.status ? "success" : "secondary"} pill>
                  {u.status ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="pe-4 text-end">
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary p-0 me-3"
                  onClick={() => onEdit(u)}
                >
                  <EditIcon fontSize="small" />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0"
                  onClick={() => onDelete(u._id)}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}