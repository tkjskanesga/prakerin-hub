const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
  path.resolve(__dirname, "../template/suratpengajuanpkl.docx"),
);
const signed = fs.readFileSync(
  path.resolve(__dirname, "../template/signed.png"),
);

const zip = new PizZip(content);

const imageOptions = {
  getImage: (tagValue) => {
    return signed;
  },
  getSize: () => {
    return [150, 150 / 2];
  },
};

const doc = new Docxtemplater(zip, {
  modules: [new ImageModule(imageOptions)],
  paragraphLoop: true,
  linebreaks: true,
});

try {
  doc.render({
    short_date: "22 Febuari 2026",
    office: "PT. Tonggak Teknologi Netikom",
    classes: "XI TKJ 2",
    participants: [
      {
        key: "1",
        student_national: "0051234567",
        student_number: "14042",
        fullname: "Alif Nur Rahmadhani N.",
        gender: "L",
      },
      {
        key: "2",
        student_national: "0059876543",
        student_number: "14021",
        fullname: "Andriyan Saputra",
        gender: "L",
      },
    ],
    mailsigned: "image.png",
  });

  const finalBuf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  fs.writeFileSync(
    path.resolve(__dirname, "suratpengajuanpkl_final.docx"),
    finalBuf,
  );
  console.log("File berhasil dibuat!");
} catch (error) {
  console.error(error, JSON.stringify(error, null, 2));
}
