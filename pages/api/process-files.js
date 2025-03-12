import multer from 'multer';
import XLSX from 'xlsx';
import Papa from 'papaparse';

const upload = multer().fields([{ name: 'students' }, { name: 'marks' }]);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload error' });

    try {
      // Extract subject name from form data
      const subjectName = req.body.subjectName;

      // Process Excel file
      const studentsBuffer = req.files['students'][0].buffer;
      const studentsWorkbook = XLSX.read(studentsBuffer, { type: 'buffer' });
      const studentsSheet = studentsWorkbook.Sheets[studentsWorkbook.SheetNames[0]];
      const studentsData = XLSX.utils.sheet_to_json(studentsSheet, { header: 1 });

      // Extract headers and rows
      const studentsHeader = studentsData[0];
      const stnameIndex = studentsHeader.indexOf('Corrected Name');
      const classroomIndex = studentsHeader.indexOf('classroom');

      const students = studentsData.slice(1).map(row => ({
        name: row[stnameIndex],
        classroom: row[classroomIndex],
      }));

      // Process CSV file
      const marksBuffer = req.files['marks'][0].buffer;
      const marksResult = Papa.parse(marksBuffer.toString(), { header: true });
      const marks = marksResult.data.reduce((acc, row) => {
        acc[row['Full Name']] = row.Total; // Use 'Total' instead of 'Mark'
        return acc;
      }, {});

      // Combine data with subject name
      const combinedData = students.map(student => ({
        'Student Name': student.name,
        'Classroom': student.classroom,
        'Mark': marks[student.name] || 'N/A',
        'Subject Name': subjectName, // Add subject name to each student
      }));

      // Create output Excel
      const ws = XLSX.utils.json_to_sheet(combinedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Results');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=student_marks.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Processing error' });
    }
  });
}