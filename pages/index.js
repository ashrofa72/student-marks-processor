import { useState } from 'react';


export default function Home() {
  const [excelFile, setExcelFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('students', excelFile);
    formData.append('marks', csvFile);

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
            ملف بيانات الطلاب بالصفوف:
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
            ملف درجات الطلاب من المنصة:
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              required
            />
          </label>
        </div>
        <button type="submit">معالجة ملف الدرجات</button>
      </form>
      <div><p>تم اعداد البرمجة بواسطة المبرمج / أشرف الطيب</p></div>
    </div>
  );
}