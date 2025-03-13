import multer from 'multer';
import XLSX from 'xlsx';
import Papa from 'papaparse';

const upload = multer().fields([{ name: 'students' }, { name: 'marks' }]);

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload error' });

    try {
      // Debugging: Log uploaded files
      console.log('Uploaded Files:', req.files);

      // Extract CSV file name (excluding .csv extension)
      const csvFileName = req.files['marks'][0].originalname; // Get the original file name
      const fileNameWithoutExtension = csvFileName.split('.').slice(0, -1).join('.'); // Remove .csv

      console.log('Extracted File Name:', fileNameWithoutExtension); // Debugging line

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
        'Mark': marks[student.name] || 'غير موجود',
        'Subject Name': fileNameWithoutExtension, // Add the extracted file name as the subject name
      }));

      // Create output Excel
      const ws = XLSX.utils.json_to_sheet(combinedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Results');

      // Write to buffer
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

      // Set response headers (including the file name)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${encodeURIComponent(fileNameWithoutExtension)}.xlsx` // Ensure proper encoding
      );

      // Send the file buffer as the response
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Processing error' });
    }
  });
}