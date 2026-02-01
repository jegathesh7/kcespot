import React from 'react'
import {
  Table,
  Placeholder,
} from "react-bootstrap";
const TablePlaceholder = () => {
  return (
    <div className="table-responsive bg-white rounded shadow-sm border">
        <Table className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="py-3 ps-4 text-secondary small text-uppercase fw-bold">
                Title
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Title
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Title
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Title
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Title
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold text-center">
                Title
              </th>
              <th className="py-3 pe-4 text-end text-secondary small text-uppercase fw-bold">
                Title
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i}>
                <td className="ps-4">
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={8} /> <br />
                    <Placeholder xs={5} size="xs" />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={6} /> <br />
                    <Placeholder xs={4} size="xs" />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={5} />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder as="div" animation="glow">
                    <Placeholder
                      xs={3}
                      style={{
                        height: "30px",
                        width: "30px",
                        display: "inline-block",
                      }}
                    />
                  </Placeholder>
                </td>
                <td>
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                </td>
                <td className="text-center">
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                </td>
                <td className="text-end pe-4">
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
  )
}

export default TablePlaceholder