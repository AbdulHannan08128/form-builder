// exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (submissions, headers) => {
    const worksheet = XLSX.utils.json_to_sheet(submissions.map(submission => {
        const row = { 'Submission Time': new Date(submission.createdAt).toLocaleString() };
        headers.forEach(header => {
            row[header] = submission.responses[header.replace(/ /g, '_')] || 'N/A';
        });
        return row;
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    XLSX.writeFile(workbook, 'submissions.xlsx');
};

export const exportToPDF = (submissions, headers) => {
    const doc = new jsPDF();
    doc.text('Submissions', 10, 10);
    
    const tableData = submissions.map(submission => {
        const row = [new Date(submission.createdAt).toLocaleString()];
        headers.forEach(header => {
            row.push(submission.responses[header.replace(/ /g, '_')] || 'N/A');
        });
        return row;
    });

    doc.autoTable({
        head: [ ['Submission Time', ...headers] ],
        body: tableData,
        startY: 20,
    });

    doc.save('submissions.pdf');
};
 