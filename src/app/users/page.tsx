"use client";
import { useEffect, useState } from "react";
import { Modal, Input, Button } from "@/components/UI";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  role: "Admin" | "Customer";
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    phone: "",
    email: "",
    role: "Customer",
    password: "",
  });

  const [showAdmins, setShowAdmins] = useState(true);
  const [showCustomers, setShowCustomers] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const onChange = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/users/${editing._id}` : "/api/users";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return alert("Failed to save user");
    setOpen(false);
    setEditing(null);
    fetchUsers();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const admins = users.filter((u) => u.role === "Admin");
  const customers = users.filter((u) => u.role === "Customer");

  return (
    <div className="p-8 bg-[#f9fafb] min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          👥 Users
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", phone: "", email: "", role: "Customer", password: "" });
            setOpen(true);
          }}
        >
          + New User
        </Button>
      </div>

      <UserTable
        title="Admin Users"
        users={admins}
        show={showAdmins}
        toggleShow={() => setShowAdmins((s) => !s)}
        onEdit={(u:any) => {
          setEditing(u);
          setForm({ ...u, password: "" });
          setOpen(true);
        }}
        onDelete={del}
      />

      <UserTable
        title="Customer Users"
        users={customers}
        show={showCustomers}
        toggleShow={() => setShowCustomers((s) => !s)}
        onEdit={(u: any) => {
          setEditing(u);
          setForm({ ...u, password: "" });
          setOpen(true);
        }}
        onDelete={del}
      />

      {open && (
        <Modal title={editing ? "Edit User" : "Add User"} onClose={() => setOpen(false)}>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e: any) => onChange("name", e.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(e: any) => onChange("phone", e.target.value)} />
            <Input label="Email" value={form.email} onChange={(e: any) => onChange("email", e.target.value)} />
            <Input
              label="Password"
              type="password"
              placeholder={editing ? "Leave blank to keep existing" : "Enter password"}
              value={form.password}
              onChange={(e: any) => onChange("password", e.target.value)}
            />
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600">Role</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800"
                value={form.role}
                onChange={(e) => onChange("role", e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <Button onClick={submit}>{editing ? "Save Changes" : "Create User"}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UserTable({ title, users, show, toggleShow, onEdit, onDelete }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-gray-50 transition"
        onClick={toggleShow}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {show ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  {["Name", "Phone", "Email", "Role", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-700">{u.phone || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{u.role}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button onClick={() => onEdit(u)}>Edit</Button>
                      <Button color="red" onClick={() => onDelete(u._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="text-center py-8 text-gray-400" colSpan={5}>
                      No users in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
