import mongoose from "mongoose";
import * as Yup from "yup";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // UBAH 1: Password dibuat TIDAK WAJIB karena akan diisi via link email
    password: { type: String, required: false, select: false },
    role: {
      type: String,
      enum: ["admin", "technician"],
      default: "technician",
    },
    // UBAH 2: Default isActive jadi false (karena harus nunggu aktivasi)
    isActive: { type: Boolean, default: false },
    isFormer: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// UBAH 3: Validasi password dihapus dari proses Create
export const userCreateDTO = Yup.object({
  name: Yup.string().trim().required("Nama wajib diisi"),
  email: Yup.string()
    .trim()
    .email("Email tidak valid")
    .required("Email wajib diisi"),
  role: Yup.string()
    .oneOf(["admin", "technician"], "Role tidak valid")
    .default("technician"),
  isFormer: Yup.boolean().default(false),
});

export const userUpdateDTO = Yup.object({
  name: Yup.string().trim().min(1, "Nama wajib diisi"),
  email: Yup.string().trim().email("Email tidak valid"),
  // Password dibiarkan opsional saat update
  password: Yup.string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .min(8, "Password minimal 8 karakter")
    .matches(/[A-Za-z]/, "Password harus mengandung huruf")
    .matches(/[0-9]/, "Password harus mengandung angka"),
  role: Yup.string().oneOf(["admin", "technician"], "Role tidak valid"),
  isActive: Yup.boolean(),
  isFormer: Yup.boolean(),
});

const UserModel = mongoose.models.User || mongoose.model("User", schema);
export default UserModel;
