import { useState } from 'react';

export default function Home() {
  const [excelFile, setExcelFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send files
    const formData = new FormData();
    formData.append('students', excelFile);
    formData.append('marks', csvFile);

    try {
      // Send the files to the API route
      const response = await fetch('/api/process-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Get the file as a blob
        const blob = await response.blob();

        // Extract the file name from the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'student_marks.xlsx'; // Default name
        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '');
        }

        // Trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Use the extracted file name
        a.click();
      } else {
        console.error('Error processing files:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container">
      <h1>Student Marks Processor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Students Excel File:
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setExcelFile(e.target.files[0])}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Marks CSV File:
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              required
            />
          </label>
        </div>
        <button type="submit">Process Files</button>
      </form>
    </div>
  );
}