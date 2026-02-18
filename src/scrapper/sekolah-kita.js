import axios from "axios";

export async function FindCardSearch({
  type_school = "SMK",
  search = "",
  page = 0,
}) {
  try {
    const reqdata = await axios.post(
      "https://sekolah.data.kemendikdasmen.go.id/v1/sekolah-service/sekolah/cari-sekolah",
      {
        page: page,
        size: 20,
        keyword: String(search),
        kabupaten_kota: "",
        bentuk_pendidikan: String(type_school),
        status_sekolah: "",
      },
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 14; SM-G996B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
        },
      },
    );
    const schoolList = reqdata.data.data || [];
    return {
      status: 200,
      data: {
        list: schoolList.map((items) => {
          return {
            id: String(items?.sekolah_id || ""),
            detail:
              "/api/fetcher/school/sekolah-kita?id=" +
              String(items?.sekolah_id || ""),
            name: String(items?.nama || ""),
            image: String(items?.path_file || ""),
            code_pos: String(items?.kode_pos || ""),
            address: String(items?.alamat_jalan || ""),
            npsn: String(items?.npsn || "").toLowerCase(),
            school_type: String(items?.bentuk_pendidikan || "").toLowerCase(),
            school_status: String(items?.status_sekolah || "").toLowerCase(),
          };
        }),
      },
    };
  } catch (e) {
    console.log("[sekolahkitas FindCardSearch Error]:", e.stack);
    return {
      status: 500,
      message: "Some logic error on backend!",
    };
  }
}

export async function GetDetailSchool({ id = "" }) {
  try {
    const reqdata = await axios.get(
      "https://sekolah.data.kemendikdasmen.go.id/v1/sekolah-service/sekolah/full-detail/" +
        String(id).toUpperCase(),
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 14; SM-G996B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
        },
      },
    );
    const returnJson = reqdata.data.data;
    const schoolDetail = returnJson.sekolah[0];
    return {
      status: 200,
      data: {
        id: String(schoolDetail?.sekolah_id || ""),
        name: String(schoolDetail?.nama || ""),
        address: String(schoolDetail?.alamat_jalan || ""),
        npsn: String(schoolDetail?.npsn || "").toLowerCase(),
        code_pos: String(schoolDetail?.kode_pos || ""),
        school_type: String(
          schoolDetail?.bentuk_pendidikan || "",
        ).toLowerCase(),
        school_status: String(schoolDetail?.status_sekolah || "").toLowerCase(),
        web: String(schoolDetail?.website || ""),
        email: String(schoolDetail?.email || ""),
        subdistrict: String(schoolDetail?.kecamatan || ""),
        principal: String(returnJson?.kepala_sekolah[0]?.nama || ""),
      },
    };
  } catch (e) {
    console.log("[sekolahkitas GetDetailSchool Error]:", e.stack);
    return {
      status: 500,
      message: "Some logic error on backend!",
    };
  }
}
