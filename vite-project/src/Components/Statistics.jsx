import  { useMemo } from 'react';
import '../assets/styles/Statistics.css';

const Statistics = ({ selectedMonth, data }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const saleDate = new Date(item.dateOfSale);
      return saleDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
    });
  }, [data, selectedMonth]);

  const totalSale = filteredData.reduce((sum, item) => sum + item.price, 0);
  const totalSoldItems = filteredData.filter(item => item.sold).length;
  const totalNotSoldItems = filteredData.length - totalSoldItems;

  return (
    <div className="statistics-container">
      <h2 className="statistics-heading">
        Statistics - {selectedMonth}
      </h2>
      <div className="statistics-box">
        <div className="statistics-row">
          <p className="statistics-label">Total sale</p>
          <span>{totalSale}</span>
        </div>
        <div className="statistics-row">
          <p className="statistics-label">Total sold item</p>
          <span>{totalSoldItems}</span>
        </div>
        <div className="statistics-row">
          <p className="statistics-label">Total not sold item</p>
          <span>{totalNotSoldItems}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
