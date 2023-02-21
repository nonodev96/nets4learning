import React, { useState } from "react"
import { Pagination, Table } from "react-bootstrap"

export default function N4L_TablePagination({ data_head, data_body }) {

  const [activePage, setActivePage] = useState(0);

  const rowsPerPage = 10
  const rowsCount = data_body.length;
  const startPage = 0
  const pageCount = Math.ceil(data_body.length / rowsPerPage)

  const countDigit = (n) => {
    if (n / 10 === 0)
      return 0;
    return 1 + countDigit(parseInt(n / 10));
  }

  const handleClick_ChangePage = (pageNumber) => {
    setActivePage(pageNumber);
  }

  return <>
    <Table>
      <thead>
      <tr>
        <th>ID</th>
        {
          data_head.map((v, i) => {
            return <th key={"thead_" + i}>{v}</th>
          })
        }
        <th>Resultados</th>
      </tr>
      </thead>
      <tbody>
      {
        Array.from(data_body).slice(activePage * rowsPerPage, (activePage * rowsPerPage) + rowsPerPage).map((r_v, r_i) => {
          return <tr key={"tbody_" + r_i}>
            <th key={"tbody_id"}>{r_i + activePage * rowsPerPage}</th>
            {
              r_v.map((c_v, c_i) => {
                return <td key={"tbody_" + r_i + "_" + c_i}>{c_v}</td>
              })
            }
          </tr>
        })
      }
      </tbody>
    </Table>

    <Pagination size="sm" className={"n4l-pagination justify-content-center"}>
      <Pagination.First onClick={() => handleClick_ChangePage(0)}/>
      {(activePage - 1 >= startPage) &&
        <Pagination.Prev onClick={() => handleClick_ChangePage(activePage - 1)}/>
      }

      {(activePage - 3 >= startPage) &&
        <Pagination.Item onClick={() => handleClick_ChangePage(activePage - 3)}>
          {activePage - 3}
        </Pagination.Item>
      }
      {(activePage - 2 >= startPage) &&
        <Pagination.Item onClick={() => handleClick_ChangePage(activePage - 2)}>
          {activePage - 2}
        </Pagination.Item>
      }
      {(activePage - 1 >= startPage) &&
        <Pagination.Item onClick={() => handleClick_ChangePage(activePage - 1)}>
          {activePage - 1}
        </Pagination.Item>
      }
      <Pagination.Item active={true}>
        {activePage}
      </Pagination.Item>
      {(activePage + 1 < pageCount - 1) &&
        <Pagination.Item onClick={() => handleClick_ChangePage(activePage + 1)}>
          {activePage + 1}
        </Pagination.Item>
      }
      {(activePage + 2 < pageCount - 2) &&
        <Pagination.Item onClick={() => handleClick_ChangePage(activePage + 2)}>
          {activePage + 2}
        </Pagination.Item>
      }
      {(activePage + 3 < pageCount - 3) &&
        <Pagination.Item onClick={() => handleClick_ChangePage(activePage + 3)}>
          {activePage + 3}
        </Pagination.Item>
      }

      {(activePage + 1 < pageCount - 1) &&
        <Pagination.Next onClick={() => handleClick_ChangePage(activePage + 1)}/>
      }
      <Pagination.Last onClick={() => handleClick_ChangePage(pageCount - 1)}/>
    </Pagination>
  </>
}


