"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useToast } from "@/components/Toast";
import LoginShell from "@/components/LoginShell";
import { normalizeError } from "@/lib/errors";
import { activateAccount } from "@/services/auth";

function ActivationForm() {
  const params = useSearchParams();
  const router = useRouter();
  const notify = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Tangkap token dari URL (?token=...)
  const token = params.get("token");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Token aktivasi tidak ditemukan atau tidak valid.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirmPassword = String(form.get("confirmPassword"));

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setError(undefined);
    try {
      await activateAccount(token, password);
      notify("Akun berhasil diaktifkan. Silakan login.", "success");
      // Redirect ke halaman login setelah sukses
      router.push("/auth/login");
    } catch (err) {
      const n = normalizeError(err);
      if (n.kind === "validation" && n.fields)
        setError(Object.values(n.fields)[0]);
      else setError(n.message || "Gagal mengaktifkan akun.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="p-4 bg-danger-surface text-danger-ink rounded-md">
        Link aktivasi tidak valid. Pastikan Anda mengklik tautan lengkap dari
        email.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Password Baru" name="password" type="password" required />
      <Input
        label="Konfirmasi Password"
        name="confirmPassword"
        type="password"
        required
      />
      {error && (
        <p role="alert" className="text-sm text-danger-ink">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading}>
        Aktifkan Akun
      </Button>
    </form>
  );
}

export default function ActivatePage() {
  return (
    <LoginShell>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold">Aktivasi Akun</h1>
          <p className="text-sm text-muted">
            Buat password baru untuk mengaktifkan akun Anda.
          </p>
        </div>
        <Suspense fallback={<p>Memuat formulir...</p>}>
          <ActivationForm />
        </Suspense>
      </div>
    </LoginShell>
  );
}
