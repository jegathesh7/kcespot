import { Table, Badge, Button, Image } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AchieversTable({ data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <div className="text-center p-5 text-muted">No achievements found.</div>;
  }

  return (
    <div className="table-responsive bg-white rounded shadow-sm border">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-light">
          <tr>
            <th className="py-3 ps-4 text-secondary small text-uppercase fw-bold">Achievement Info</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold">Batch</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold">Category</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold">Evidence</th>
            <th className="py-3 text-secondary small text-uppercase fw-bold text-center">Status</th>
            <th className="py-3 pe-4 text-end text-secondary small text-uppercase fw-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a._id}>
              <td className="ps-4">
                <div className="fw-bold text-dark">{a.name}</div>
                {a.eventDate && <div className="small text-muted">{new Date(a.eventDate).toLocaleDateString()}</div>}
              </td>
              <td className="text-secondary small fw-medium">{a.batch}</td>
              <td>
                 <Badge bg="info" className="text-white bg-opacity-75">{a.category}</Badge>
              </td>
              <td>
                {a.posterImage ? (
                  <Image src={a.posterImage} alt="Poster" thumbnail style={{ height: '50px', width: '50px', objectFit: 'cover' }} />
                ) : (
                  <span className="text-muted small italic">No Image</span>
                )}
              </td>
              <td className="text-center">
                 <Badge bg={a.status ? "success" : "secondary"} pill>
                    {a.status ? "Active" : "Inactive"}
                 </Badge>
              </td>
              <td className="pe-4 text-end">
                 <Button 
                   variant="link" 
                   size="sm" 
                   className="text-primary p-0 me-3"
                   onClick={() => onEdit(a)}
                 >
                   <EditIcon fontSize="small" />
                 </Button>
                 <Button 
                   variant="link" 
                   size="sm" 
                   className="text-danger p-0"
                   onClick={() => onDelete(a._id)}
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