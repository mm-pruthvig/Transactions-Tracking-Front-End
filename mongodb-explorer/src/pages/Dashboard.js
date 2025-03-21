import React, { useEffect, useState } from "react";
import { fetchTopCustomersWithTransactions } from "../services/api";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#775DD0", "#F86624", "#26A69A", "#D7263D"];

const Dashboard = function () {
  const [customers, setCustomers] = useState([]);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2025-03-20");
  const [executionTime, setExecutionTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getTopCustomers();
  }, []);

  const getTopCustomers = async () => {
    const response = await fetchTopCustomersWithTransactions(startDate, endDate);
    console.log(response);
    setCustomers(response);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        MongoDB Explorer Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        API Execution Time: {executionTime} ms
      </Typography>
      
      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} sx={{ marginBottom: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/accounts")}>Accounts</Button>
        <Button variant="contained" color="secondary" onClick={() => navigate("/customer")}>Customers</Button>
        <Button variant="contained" color="success" onClick={() => navigate("/transactions")}>Transactions</Button>
      </Stack>

      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={getTopCustomers}>
          Apply Filters
        </Button>
      </Paper>

      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6">Top 10 Customers with Most Transactions</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={customers}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              dataKey="totalTransactions"
              label
            >
              {customers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`Transactions: ${value}`, `Customer: ${props.payload.name}`]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default Dashboard;
