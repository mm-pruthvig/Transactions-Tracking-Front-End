import React, { useEffect, useState } from "react";
import { fetchCustomers } from "../services/api";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const CustomerList = function () {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));

  useEffect(() => {
    const getCustomers = async () => {
      const result = await fetchCustomers(page + 1, rowsPerPage);
      setCustomers(result.data);
      setTotalRecords(result.totalRecords);
    };
    getCustomers();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredCustomers = customers
    .filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{ marginRight: 2 }}
        />
      </Paper>

      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleSort("name")}
                sx={{ color: "white", "&.Mui-active": { color: "white" } }}
              >
                Name
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>Username</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Accounts</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <StyledTableCell>{customer.name}</StyledTableCell>
              <StyledTableCell>{customer.userName}</StyledTableCell>
              <StyledTableCell>{customer.email}</StyledTableCell>
              <StyledTableCell>{customer.accounts ? customer.accounts.join(", ") : "-"}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalRecords}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate("/")}>
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default CustomerList;
