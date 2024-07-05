import React, { useState, useEffect } from "react";
import Barchart from "./Barchart";
import "../assets/styles/Home.css";
import Statistics from "./Statistics";
import StickyTable from "./StickyTable";

const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <section className="home-section">
      <div className="container-fluid">
        <div className="container">
          <div className="month-selector-wrapper row">
            <div className="col-4">
              <p className="home-text">Select month:- </p>
            </div>
            <div className="col-3 d-flex justify-content-center">
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-6 chart-wrapper">
              <div className="card">
                <div className="card-body">
                  <Barchart data={data} selectedMonth={selectedMonth} />
                </div>
              </div>
            </div>
            <div className="col-6 statistics-card">
              <div className="card">
                <div className="card-body">
                  <Statistics selectedMonth={selectedMonth} data={data} />
                </div>
              </div>
            </div>
          </div>
          <div className="table-wrapper">
            <div className="card">
              <div className="card-body">
                <StickyTable data={data} selectedMonth={selectedMonth} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
