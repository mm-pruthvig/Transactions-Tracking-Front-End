const API_BASE_URL = "https://localhost:7078/api";

export const fetchAccounts = async (page = 1, pageSize = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) throw new Error("Failed to fetch accounts");
    return await response.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return { data: [], totalRecords: 0 };
  }
};

export const fetchAllAccounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/GetAll`);
    if (!response.ok) throw new Error("Failed to fetch accounts");
    return await response.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
};

export const fetchFilteredAccounts = async (fromLimit, toLimit) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/accounts/filtered?fromLimit=${fromLimit}&toLimit=${toLimit}`
    );
    if (!response.ok) throw new Error("Failed to fetch filtered accounts");
    return await response.json();
  } catch (error) {
    console.error("Error fetching filtered accounts:", error);
    return { data: [], totalRecords: 0 };
  }
};

export const fetchCustomers = async (page = 1, pageSize = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) throw new Error("Failed to fetch customers");
    return await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { data: [], totalRecords: 0 };
  }
};

export const fetchTransactions = async (page = 1, pageSize = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { data: [], totalRecords: 0 };
  }
};

export const fetchFilteredTransactions = async (accountId = 0, minTransCount = 0, maxTransCount = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Transactions/filtered?accountId=${accountId}&minTransCount=${minTransCount}&maxTransCount=${maxTransCount}`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { data: [], totalRecords: 0 };
  }
};

export const fetchTopCustomersWithTransactions = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/customers/top-transactions?startDate=${startDate}&endDate=${endDate}`
    );
    if (!response.ok) throw new Error("Failed to fetch top customers");
    return await response.json();
  } catch (error) {
    console.error("Error fetching top customers:", error);
    return [];
  }
};

export const fetchTransactionDetails = async (transactionId) => {
  const response = await fetch(`${API_BASE_URL}/Transactions/transactionsDetails?transactionId=${transactionId}`);
  return response.json();
};
