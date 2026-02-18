const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module");
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
  path.resolve(__dirname, "../template/suratpengajuanpkl.docx"),
);

const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
  modules: [
    // new ImageModule({
    //   getImage: (tagValue) => {
    //     return fs.readFileSync(path.resolve(__dirname, tagValue));
    //   },
    //   getSize: (imgBuffer) => {
    //     return [100, 100];
    //   },
    //   centered: true,
    // })
  ],
  paragraphLoop: true,
  linebreaks: true,
});

try {
  doc.render({
    short_date: "17 Februari 2026",
    office: "PT. Maju Mundur Digital",
    classes: "XI Administrasi Perkantoran 1",
    participants: [
      {
        key: "1",
        student_national: "0051234567",
        student_number: "14042",
        fullname: "RIZA NUR FAJRI",
        gender: "L",
      },
      {
        key: "2",
        student_national: "0059876543",
        student_number: "14021",
        fullname: "ANDRIYAN",
        gender: "L",
      },
    ],
    mailsigned: "./image.png",
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
