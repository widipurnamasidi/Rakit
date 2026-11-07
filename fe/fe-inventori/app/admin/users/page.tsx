"use client";

import Badge from "@/components/Badge";
import ResourceManager from "@/components/ResourceManager";
import type { Field } from "@/components/ResourceForm";
import {
  userPayload,
  usersAdmin,
  type AppUser,
  type UserInput,
} from "@/services/users";

const fields: Field[] = [
  { name: "name", label: "Nama Lengkap", type: "text", required: true },
  { name: "email", label: "Alamat Email", type: "text", required: true },
  {
    name: "password",
    label: "Password (opsional saat buat baru, kosongkan bila tak diubah)",
    type: "password",
    required: false, // <-- Biarkan false agar form Tambah Pengguna tidak error
  },
  {
    name: "role",
    label: "Peran",
    type: "select",
    required: true,
    options: [
      { value: "technician", label: "Teknisi" },
      { value: "admin", label: "Admin" },
    ],
  },
];

export default function UsersPage() {
  return (
    <ResourceManager<AppUser, UserInput>
      title="Pengguna"
      columns={[
        { header: "Nama", render: (r) => r.name },
        { header: "Email", render: (r) => r.email },
        {
          header: "Peran",
          render: (r) => (r.role === "admin" ? "Admin" : "Teknisi"),
        },
        {
          header: "Status",
          render: (r) => (
            <Badge tone={r.isActive ? "ok" : "neutral"}>
              {r.isActive ? "Aktif" : "Menunggu Aktivasi"}
            </Badge>
          ),
        },
      ]}
      load={(page, q) =>
        usersAdmin.list({
          page,
          limit: 10,
          search: q?.search,
          role: q?.filter || undefined,
        })
      }
      searchable
      searchPlaceholder="Cari nama atau email"
      filterLabel="Peran"
      filters={[
        { value: "", label: "Semua" },
        { value: "admin", label: "Admin" },
        { value: "technician", label: "Teknisi" },
      ]}
      fields={fields}
      newValues={{ role: "technician" }}
      toValues={(r) => ({
        name: r.name,
        email: r.email,
        password: "", // Kosongkan password saat load edit
        role: r.role,
        isActive: r.isActive,
      })}
      toPayload={userPayload}
      create={(p) => usersAdmin.create(p)}
      update={(row, p) => usersAdmin.update(row._id, p)}
    />
  );
}
