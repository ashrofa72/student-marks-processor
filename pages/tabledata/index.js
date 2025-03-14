import { useState } from 'react';
import * as XLSX from 'xlsx'; // Correct import for xlsx library
import styles from '../../styles/Table.module.css';
import Navbar from '../components/Navbar';

export default function Home() {
  const [data, setData] = useState([]); // State to store Excel data
  const [columns, setColumns] = useState([]); // State to store column headers

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const buffer = event.target.result;
          console.log('Buffer:', buffer); // Debugging line
          const workbook = XLSX.read(buffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // Get the first sheet
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON

          // Extract columns and rows
          const cols = jsonData[0]; // First row contains headers
          const rows = jsonData.slice(1); // Remaining rows contain data

          setColumns(cols);
          setData(rows);
        } catch (error) {
          console.error('Error reading Excel file:', error);
          alert('Please upload a valid Excel file.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Print the table
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div>
      <Navbar />
      </div>
      <h1>عرض درجات المادة حسب الفصول</h1>

      {/* File Upload Input */}
      <div className={styles.uploadSection}>
        <label htmlFor="file-upload" className={styles.uploadButton}>
         اضغط لرفع ملف الاكسل
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          style={{display: 'none' }}
        />
      </div>

      {/* Table to Display Data */}
      {columns.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Button */}
      {columns.length > 0 && (
        <button className={styles.printButton} onClick={handlePrint}>
          طباعة الجدول
        </button>
      )}
    </div>
  );
}