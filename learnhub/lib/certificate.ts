import jsPDF from "jspdf"

export const generateCertificate = (data: {
  studentName: string
  courseTitle: string
  date: string
  certificateNumber: string
}) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Set colors
  const primaryColor = "#7C3AED"
  const secondaryColor = "#1f2937"

  // Background
  doc.setFillColor("#ffffff")
  doc.rect(0, 0, 297, 210, "F")

  // Border
  doc.setDrawColor(primaryColor)
  doc.setLineWidth(2)
  doc.rect(5, 5, 287, 200, "S")

  // Decorative corners
  doc.setFillColor(primaryColor)
  doc.triangle(5, 5, 45, 5, 5, 45, "F")
  doc.triangle(292, 205, 252, 205, 292, 165, "F")

  // Header
  doc.setTextColor(secondaryColor)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(40)
  doc.text("LearnHub", 148, 40, { align: "center" })

  doc.setFontSize(20)
  doc.setFont("helvetica", "normal")
  doc.text("CERTIFICATE OF COMPLETION", 148, 60, { align: "center" })

  // Body
  doc.setFontSize(16)
  doc.text("This is to certify that", 148, 85, { align: "center" })

  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor)
  doc.text(data.studentName, 148, 105, { align: "center" })

  doc.setTextColor(secondaryColor)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(16)
  doc.text("has successfully completed the course", 148, 125, { align: "center" })

  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text(data.courseTitle, 148, 145, { align: "center" })

  // Footer
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Issued on ${data.date}`, 50, 180, { align: "left" })
  doc.text(`Certificate ID: ${data.certificateNumber}`, 247, 180, { align: "right" })

  // Logo Placeholder
  doc.setDrawColor(secondaryColor)
  doc.setLineWidth(0.5)
  doc.line(120, 190, 177, 190)
  doc.text("LearnHub verified", 148, 197, { align: "center" })

  // Save the PDF
  doc.save(`Certificate-${data.courseTitle.replace(/\s+/g, "-")}.pdf`)
}
