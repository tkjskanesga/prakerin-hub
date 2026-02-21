export default {
  db: {
    school_type: ["smk", "sma", "ma", "smalb", "kuliah", "other"],
    school_status: ["negeri", "swasta", "universitas", "other"],
    role_users: [
      "participant",
      "mentor",
      "mentor-high",
      "admin",
      "default-admin",
    ],
    default_worker_duration: 30 * 4, // 4 month
    default_minimum_group: 1, // 1 person
    default_maximum_group: 4, // 4 person
  },
  scrapper_SekolahKita: {
    school_type: ["SMK", "SMA", "MA"],
  },
};
