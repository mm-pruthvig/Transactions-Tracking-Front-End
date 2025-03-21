import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Customer from "./pages/Customer";
import Transaction from "./pages/Transactions";
import React from 'react';
import IndexComparison from "./pages/IndexComparison";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/index-comparison" element={<IndexComparison />} />
      </Routes>
    </Router>
  );
}

export default App;
