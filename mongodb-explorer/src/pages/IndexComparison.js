import React, { useState } from "react";
import { fetchFilteredAccounts } from "../services/api";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Box,
  Button,
} from "@mui/material";

const IndexDemo = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromLimit, setFromLimit] = useState("");
  const [toLimit, setToLimit] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Function to fetch filtered data from API
  const fetchData = async () => {
    if (fromLimit && toLimit) {
      const response = await fetchFilteredAccounts(fromLimit, toLimit);
      console.log(response);
      setAccounts(response.data);
      setExecutionTime(response.executionTime); // Capture execution time
    } else {
      setAccounts([]);
      setExecutionTime(null);
    }
    setPage(0); // Reset to first page
  };

  const handleClear = () => {
    setAccounts([]);
    setExecutionTime(null);
    setFromLimit("");
    setToLimit("");
    setPage(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        MongoDB Indexing Demo
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <input
          type="number"
          placeholder="From Limit"
          value={fromLimit}
          onChange={(e) => setFromLimit(e.target.value)}
        />
        <input
          type="number"
          placeholder="To Limit"
          value={toLimit}
          onChange={(e) => setToLimit(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={fetchData}>
          Apply Filter
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </Box>

      {/* Execution Time Display */}
      {executionTime !== null && (
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Query Execution Time: <strong>{executionTime} ms</strong>
        </Typography>
      )}

      {/* Results Table */}
      {accounts.length > 0 ? (
        <Paper sx={{ padding: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account ID</TableCell>
                <TableCell>Limit</TableCell>
                <TableCell>Products</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((account) => (
                <TableRow key={account.accountId}>
                  <TableCell>{account.accountId}</TableCell>
                  <TableCell>{account.limit}</TableCell>
                  <TableCell>{account.products?.join(", ") || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={accounts.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </Paper>
      ) : (
        <Typography variant="body1">No records found.</Typography>
      )}
    </Container>
  );
};

export default IndexDemo;
