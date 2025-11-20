import React, { useEffect, useState } from "react";
import "./style.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [sortField, setSortField] = useState("first_name");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 4; // How many users per page

  // Fetch JSON only once
  useEffect(() => {
    setLoading(true);

    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.data) {
          setUsers([]);
          setFiltered([]);
          setLoading(false);
          return;
        }

        setUsers(data.data);
        setFiltered(data.data);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setFiltered([]);
        setLoading(false);
      });
  }, []);

  // Search + Filter + Sort
  useEffect(() => {
    setBusy(true);

    setTimeout(() => {
      let result = [...users];

      // Search
      if (query.trim()) {
        result = result.filter(
          (u) =>
            u.first_name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Filter Domain
      if (domain.trim()) {
        result = result.filter((u) => u.email.endsWith(domain));
      }

      // Sort
      result.sort((a, b) => a[sortField].localeCompare(b[sortField]));

      setFiltered(result);
      setPage(1); // reset to page 1 after filter change
      setBusy(false);
    }, 400);
  }, [query, domain, sortField, users]);

  // Pagination data slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container">
      
      <header className="hero">
        <div className="hero-inner">
          <h1>User Directory</h1>
          <p className="lead">Search, filter, sort and paginate — live demo</p>
        </div>
      </header>

      {/* Controls */}
      <div className="controls">
        <input
          className="input"
          placeholder='Search by name or email (try "George")'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="input"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="first_name">Sort by First Name</option>
          <option value="email">Sort by Email</option>
        </select>

        <select
          className="input"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="">All Email Domains</option>
          <option value="@reqres.in">@reqres.in</option>
        </select>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* Busy Spinner (search/filter) */}
          {busy && <div className="spinner small"></div>}

          {/* Table */}
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>First Name</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <img src={u.avatar} className="avatar" alt="avatar" />
                      </td>
                      <td>{u.first_name}</td>
                      <td>{u.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-data">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ⬅ Prev
            </button>

            <span className="page-number">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
