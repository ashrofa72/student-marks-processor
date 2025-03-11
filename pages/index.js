import { useState } from 'react';

export default function Home() {
  const [excelFile, setExcelFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [subjectName, setSubjectName] = useState(''); // State for subject name

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('students', excelFile);
    formData.append('marks', csvFile);
    formData.append('subjectName', subjectName); // Include subject name in form data

    const response = await fetch('/api/process-files', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_marks.xlsx';
      a.click();
    }
  };

  return (
    <div className="container">
      <h1>برنامج معالجة درجات الطلاب من المنصة</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            ادخل اسم المادة
            <input
              type="text"
              placeholder="ادخل اسم المادة"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)} // Update state on change
              required
            />
          </label>
        </div>
        <div>
          <label>
          ملف بيانات الطلاب
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
            ملف الدرجات من المنصة
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              required
            />
          </label>
        </div>
        <button type="submit">معالجة الملفات</button>
      </form>
    </div>
  );
}