import jsPDF from "jspdf";

const downloadReport = (resume) => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AI Resume Matcher", 20, 20);

    doc.setFontSize(16);
    doc.text("Resume Analysis Report", 20, 32);

    // Line
    doc.line(20, 38, 190, 38);

    // Resume Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`Filename : ${resume.filename}`, 20, 50);

    let status = "";

if (resume.atsScore >= 90)
    status = "Excellent";

else if (resume.atsScore >= 80)
    status = "Very Good";

else if (resume.atsScore >= 70)
    status = "Good";

else
    status = "Needs Improvement";

doc.text(
    `ATS Score : ${resume.atsScore}/100 (${status})`,
    20,
    60
);
    doc.text(
        `Generated : ${new Date().toLocaleString()}`,
        20,
        70
    );

    // Analysis Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("AI Analysis", 20, 90);

    // Analysis Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(
        resume.analysis || "No Analysis Available",
        170
    );

    doc.text(lines, 20, 100);

    // Footer
    doc.setFontSize(10);

    doc.text(
        "Generated using AI Resume Matcher",
        20,
        285
    );

    doc.save(`${resume.filename}_Report.pdf`);
};

export default downloadReport;