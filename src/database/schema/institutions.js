import { pgTable, text, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core";
import globalVariable from "@/lib/global-variable";

export const institutionsTypeEnum = pgEnum("type", globalVariable.db.school_type);
export const institutionsStatusEnum = pgEnum("status", globalVariable.db.school_status);

export const institutions = pgTable("institutions", {
  id: uuid("id").primaryKey().defaultRandom(), // ID
  regis_number: text("regis_number").unique().notNull(), // NPSN (Sekolah) / PT.Code (Universitas)
  icon: text("icon").default(null), // Icon (?)
  name: text("name").notNull(), // Name Sekolah/Universitas
  address: text("address").notNull(), // Alamat
  postal_code: text("postal_code").notNull(), // Kode Pos
  leader_name: text("leader_name").notNull(), // Kepala Sekolah/Rektor (Universitas)
  web: text("web").default("-"), // Website (?)
  phone: text("phone").default("-"), // Telepon (?)
  email: text("email").default("-"), // Email (?)
  subdistrict: text("subdistrict").default("-"), // Kecamatan (?)
  type: institutionsTypeEnum("type"), // Jenis Sekolah (SMK, SMA, MA, MAK, Kuliah, Lainnya)
  status: institutionsStatusEnum("status"), // Status Sekolah (Negeri, Swasta, Universitas, Lainnya)
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(), // Created At
  updated_at: timestamp("updated_at", { withTimezone: true }), // Updated At
  deleted_at: timestamp("deleted_at", { withTimezone: true }), // Deleted At
});