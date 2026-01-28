import { Table, Badge, Button } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EventsTable({ data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <div className="text-center p-5 text-muted">No events found.</div>;
  }

  return (
    <div className="table-responsive bg-white rounded shadow-sm border">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-light">
          <tr>
            <th className="py-3 ps-4 text-secondary small text-uppercase fw-bold">Title</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold">Location</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold">Classification</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold">Visibility</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold text-center">Status</th>
            <th className="py-3 pe-4 text-end text-secondary small text-uppercase fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e._id}>
              <td className="ps-4">
                <div className="fw-bold text-dark">{e.title}</div>
                <div className="small text-muted">{e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'No Date'}</div>
              </td>
              <td>
                <div className="text-dark small">{e.campus}</div>
                <div className="text-muted small">{e.venue}</div>
              </td>
              <td>
                 <Badge bg="light" text="dark" className="border me-1">{e.mode}</Badge>
                 <span className="small text-muted">{e.type}</span>
              </td>
              <td>
                <span className="small fw-medium">{e.visibility}</span>
              </td>
              <td className="text-center">
                 <Badge bg={e.status ? "success" : "secondary"} pill>
                    {e.status ? "Active" : "Inactive"}
                 </Badge>
              </td>
              <td className="pe-4 text-end">
                 <Button 
                   variant="link" 
                   size="sm" 
                   className="text-primary p-0 me-3"
                   onClick={() => onEdit(e)}
                 >
                   <EditIcon fontSize="small" />
                 </Button>
                 <Button 
                   variant="link" 
                   size="sm" 
                   className="text-danger p-0"
                   onClick={() => onDelete(e._id)}
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