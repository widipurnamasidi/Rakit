import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { verifyToken } from "../utils/jwt";
import { hashPassword } from "../utils/password";
import response from "../utils/response";

export default {
  async activateUser(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      if (!token || !password)
        return response.error(res, null, "Token dan password wajib diisi");

      // Verifikasi token aktivasi
      const decoded: any = verifyToken(token);
      if (decoded.type !== "activation")
        return response.error(res, null, "Token tidak valid");

      // Cari user berdasarkan ID dari token
      const user = await UserModel.findById(decoded.id);
      if (!user) return response.notFound(res, "User tidak ditemukan");
      if (user.isActive)
        return response.conflict(res, "Akun sudah aktif sebelumnya");

      // Set password baru dan aktifkan akun
      user.password = hashPassword(password);
      user.isActive = true;
      await user.save();

      response.success(res, null, "Akun berhasil diaktifkan");
    } catch (error) {
      response.error(res, error, "Token kedaluwarsa atau tidak valid");
    }
  },
};
