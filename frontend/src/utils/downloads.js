import jsPDF from "jspdf";

export const downloadTextDocument = ({ filename, content }) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
};

export const downloadPdfDocument = ({ title, sections, filename }) => {
  const document = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const leftPadding = 48;
  const maxWidth = 500;
  let currentY = 56;

  document.setFont("helvetica", "bold");
  document.setFontSize(18);
  document.text(title, leftPadding, currentY);

  currentY += 28;

  sections.forEach((section, sectionIndex) => {
    document.setFont("helvetica", "bold");
    document.setFontSize(12);
    document.text(section.heading, leftPadding, currentY);

    currentY += 18;
    document.setFont("helvetica", "normal");
    document.setFontSize(11);

    const lines = document.splitTextToSize(section.body, maxWidth);

    lines.forEach((line) => {
      if (currentY > 760) {
        document.addPage();
        currentY = 56;
      }

      document.text(line, leftPadding, currentY);
      currentY += 16;
    });

    if (sectionIndex < sections.length - 1) {
      currentY += 18;
    }
  });

  document.save(filename);
};
