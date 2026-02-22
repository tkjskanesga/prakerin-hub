import "./dotenv";
import axios from "axios";
import FormData from "form-data";
import logger from "./logger";

const endpoint_gotenberg = String(process.env.GOTENBERG_URL || "http://localhost:3000")

export async function docxToPdf(docxBuffer) {
  const logdocx = logger.child({ file: "docx-to-pdf.js" })
  try {
    const form = new FormData()
    form.append("files", docxBuffer, "input.docx")
    const response = await axios.post(`${endpoint_gotenberg}/forms/libreoffice/convert`, form, {
      headers: {
        ...form.getHeaders(),
      },
      responseType: "arraybuffer",
    })
    return {
      data: {
        type: "buffer",
        file: Buffer.from(response.data)
      }
    }
  } catch(e) {
    if(e.response) {
      logdocx.error({ error: e.response.data })
      return {
        error: "docxtopdf:gotenberg-cannot-convert-error"
      }
    }
    logdocx.error({ error: e })
    return {
      error: "docxtopdf:gotenberg-cannot-reach-connection"
    }
  }
}