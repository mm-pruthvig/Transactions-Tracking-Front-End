import React, { useEffect, useState } from "react";
import { fetchTransactions, fetchTransactionDetails } from "../services/api";
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
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

const Transactions = function () {
  const [transactions, setTransactions] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("transaction_Count");
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [transactionDetails, setTransactionDetails] = useState({});
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
    const getTransactions = async function () {
      const response = await fetchTransactions(page + 1, rowsPerPage);
      setTransactions(response.data);
      setTotalRecords(response.totalRecords);
      setExecutionTime(response.executionTime);
    };
    getTransactions();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = function (event) {
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

  const handleExpandClick = async (transactionId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [transactionId]: !prev[transactionId],
    }));

    if (!transactionDetails[transactionId]) {
      const response = await fetchTransactionDetails(transactionId);
      console.log(response);
      setTransactionDetails((prev) => ({
        ...prev,
        [transactionId]: response,
      }));
    }
  };

  const filteredTransactions = transactions
    .filter((transaction) => String(transaction.account_Id || "").includes(search))
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
        Transactions
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        API Execution Time: {executionTime} ms
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
      </Paper>

      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "account_Id"}
                direction={orderBy === "account_Id" ? order : "asc"}
                onClick={() => handleSort("account_Id")}
              >
                Account ID
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "transaction_Count"}
                direction={orderBy === "transaction_Count" ? order : "asc"}
                onClick={() => handleSort("transaction_Count")}
                sx={{ color: "white", "&.Mui-active": { color: "white" } }}
              >
                Transaction Count
              </TableSortLabel>
            </StyledTableCell>

            <StyledTableCell>Bucket Start Date</StyledTableCell>
            <StyledTableCell>Bucket End Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <TableRow>
                <StyledTableCell>
                  <IconButton onClick={() => handleExpandClick(transaction.id)}>
                    {expandedRows[transaction.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </StyledTableCell >
                <StyledTableCell >{transaction.account_Id}</StyledTableCell >
                <StyledTableCell >{transaction.transaction_Count}</StyledTableCell >
                <StyledTableCell >{new Date(transaction.bucket_Start_Date).toLocaleDateString()}</StyledTableCell>
                <StyledTableCell >{new Date(transaction.bucket_End_Date).toLocaleDateString()}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={5}>
                  <Collapse in={expandedRows[transaction.id]} timeout="auto" unmountOnExit>
                    <Typography variant="h6" sx={{ margin: 2 }}>
                      Transaction Details
                    </Typography>
                    {transactionDetails[transaction.id] ? (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Transaction Code</StyledTableCell>
                            <StyledTableCell>Symbol</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>Total</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transactionDetails[transaction.id].map((detail, index) => (
                            <TableRow key={index}>
                              <StyledTableCell>{new Date(detail.date).toLocaleDateString()}</StyledTableCell>
                              <StyledTableCell>{detail.amount}</StyledTableCell>
                              <StyledTableCell>{detail.transaction_Code}</StyledTableCell>
                              <StyledTableCell>{detail.symbol}</StyledTableCell>
                              <StyledTableCell>{detail.price}</StyledTableCell>
                              <StyledTableCell>{detail.total}</StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography sx={{ margin: 2 }}>Loading...</Typography>
                    )}
                  </Collapse>
                </StyledTableCell>
              </TableRow>
            </React.Fragment>
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

export default Transactions;
