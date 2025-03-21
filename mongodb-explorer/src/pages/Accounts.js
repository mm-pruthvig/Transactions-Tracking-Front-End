import React, { useEffect, useState } from "react";
import { fetchAccounts } from "../services/api";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Accounts = function () {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("accountId");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAccounts = async () => {
      const response = await fetchAccounts(page + 1, rowsPerPage);
      setAccounts(response.data);
      setTotalRecords(response.totalRecords);
    };
    getAccounts();
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredAccounts = accounts
    .filter((account) => account.accountId.toString().includes(search))
    .filter((account) => (filter ? account.products.includes(filter) : true))
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
        Accounts
      </Typography>
      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <TextField
          label="Search by Account ID"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{ marginRight: 2 }}
        />
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter by Product</InputLabel>
          <Select value={filter} onChange={handleFilterChange} label="Filter by Product">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Derivatives">Derivatives</MenuItem>
            <MenuItem value="InvestmentStock">InvestmentStock</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "accountId"}
                direction={orderBy === "accountId" ? order : "asc"}
                onClick={() => handleSort("accountId")}
                sx={{ color: "white", "&.Mui-active": { color: "white" } }}
              >
                Account ID
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "limit"}
                direction={orderBy === "limit" ? order : "asc"}
                onClick={() => handleSort("limit")}
              >
                Limit
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>Products</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAccounts.map((account) => (
            <TableRow key={account.accountId}>
              <StyledTableCell>{account.accountId}</StyledTableCell>
              <StyledTableCell>{account.limit}</StyledTableCell>
              <StyledTableCell>{account.products ? account.products.join(", ") : "-"}</StyledTableCell>
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

      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => navigate("/")}>Go to Dashboard</Button>
    </Container>
  );
};

export default Accounts;