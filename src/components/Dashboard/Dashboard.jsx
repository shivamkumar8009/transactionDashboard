import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://66346c589bb0df2359a17e03.mockapi.io/api/tasks`,
        {
          params: {
            month: selectedMonth,
          },
        }
      );
      setData(response.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, currentPage]); // Fetch transactions when month or page changes

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `https://66346c589bb0df2359a17e03.mockapi.io/api/transactions`,
        {
          params: {
            month: selectedMonth,
            page: currentPage,
            limit: 3, // Limiting to 5 transactions per page
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1); // Reset page to 1 when month changes
  };

  const handleSearch = async () => {
    try {
      let filteredTransactions = [...transactions];
      if (searchText.trim() !== "") {
        // Filter transactions based on title, description, or price containing the search text
        filteredTransactions = transactions.filter(
          (transaction) =>
            transaction.title
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            transaction.description
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            String(transaction.price).includes(searchText)
        );
      }
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error searching transactions:", error);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    fetchTransactions();
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="dashboard-container">
        <h1>Transaction Details</h1>
        <div className="controls">
          <div className="month-dropdown">
            <label htmlFor="month">Select Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search transaction..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={clearSearch}>Clear</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
                <td>
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="transaction-image"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button onClick={handleNextPage}>Next</button>
        </div>
      </div>
      <div className="dashboard-container">
        <h1>Monthly Sales Data</h1>
        {/* <div className="controls">
          <div className="month-dropdown">
            <label htmlFor="month">Select Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        </div> */}
        {data ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Sales</td>
                <td>${data.totalSales}</td>
              </tr>
              <tr>
                <td>Total Sold Items</td>
                <td>{data.totalSoldItems}</td>
              </tr>
              <tr>
                <td>Total Non-Sold Items</td>
                <td>{data.totalNonSoldItems}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No data available for the selected month.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
