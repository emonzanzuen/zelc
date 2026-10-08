import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface CertificatePdfData {
  name: string;
  courseTitle: string;
  certNumber: string;
  score: number;
  issuedAt: Date;
  signerName?: string;
}

// Generator PDF sertifikat sesuai spesifikasi konten di PRD §19 (A4 landscape, nama,
// course, skor, nomor sertifikat, tanggal terbit, nama penandatangan). Logo platform
// sengaja belum disertakan — belum ada aset logo, tinggal tambahkan page.drawImage()
// begitu asetnya tersedia.
//
// STATUS: fungsi ini sudah bekerja (hasilkan Buffer PDF valid) tapi BELUM dipanggil
// di alur manapun (mis. saat quiz lulus di quiz.service.ts). Menunggu instruksi
// eksplisit untuk di-wire + diupload ke Cloudinary, sesuai FR-21/22.
export async function generateCertificatePdf(data: CertificatePdfData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape (pt)
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const centerText = (text: string, y: number, size: number, bold = false) => {
    const font = bold ? fontBold : fontRegular;
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color: rgb(0.1, 0.1, 0.15) });
  };

  // Border dekoratif sederhana
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.49, 0.23, 0.93), // primary-600 (#7C3AED)
    borderWidth: 3,
  });

  centerText('SERTIFIKAT KELULUSAN', height - 120, 28, true);
  centerText('Diberikan kepada', height - 170, 14);
  centerText(data.name, height - 205, 24, true);
  centerText('atas kelulusan kelas', height - 240, 14);
  centerText(data.courseTitle, height - 270, 18, true);
  centerText(`dengan skor akhir ${data.score}`, height - 300, 14);

  const issuedDate = data.issuedAt.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  centerText(`Diterbitkan pada ${issuedDate}`, height - 340, 12);
  centerText(`Nomor Sertifikat: ${data.certNumber}`, 80, 11);
  centerText(data.signerName ?? 'Tim LMS Bahasa Inggris', 120, 12, true);

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
