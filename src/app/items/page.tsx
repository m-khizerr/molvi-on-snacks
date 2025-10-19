"use client";
import { useEffect, useState } from "react";
import { Modal, Input, Button, Select } from "@/components/UI";

type Variation = {
  label: string;
  baseCost: number;
  price: number;
  quantity: number;
};

type Item = {
  _id: string;
  name: string;
  category: "ice_cream" | "samosa";
  images: string[];
  variations: Variation[];
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    category: "ice_cream",
    images: [],
    variations: [],
  });
  const [files, setFiles] = useState<File[]>([]);

  const fetchItems = async () => {
    const res = await fetch("/api/items");
    setItems(await res.json());
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onChange = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  // Add or remove variations
  const addVariation = () => {
    setForm((f: any) => ({
      ...f,
      variations: [...f.variations, { label: "", baseCost: 0, price: 0, quantity: 0 }],
    }));
  };

  const updateVariation = (idx: number, key: string, value: any) => {
    setForm((f: any) => {
      const updated = [...f.variations];
      updated[idx][key] = value;
      return { ...f, variations: updated };
    });
  };

  const removeVariation = (idx: number) => {
    setForm((f: any) => ({
      ...f,
      variations: f.variations.filter((_: any, i: number) => i !== idx),
    }));
  };

  const submit = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/items/${editing._id}` : "/api/items";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("variations", JSON.stringify(form.variations));
    files.forEach((file) => formData.append("images", file));

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (!res.ok) return alert("Failed to save item");

    setOpen(false);
    setEditing(null);
    setFiles([]);
    fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">🧃 Items</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              category: "ice_cream",
              unit: "",
              baseCost: 0,
              price: 0,
              images: [],
              variations: [],
            });
            setFiles([]);
            setOpen(true);
          }}
        >
          + New Item
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {["Image", "Name", "Category", "Variations", ""].map(
                (h) => (
                  <th key={h} className="text-left px-4 py-3">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {it.images?.length > 0 ? (
                    <img
                      src={it.images[0]}
                      alt={it.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{it.name}</td>
                <td className="px-4 py-3 capitalize text-gray-800">{it.category}</td>
                <td className="px-4 py-3 text-gray-800 flex flex-col gap-1">
                  {it.variations?.length > 0
                    ? it.variations.map((v) => `${v.label} (${v.quantity})`).join(", ")
                    : "-"}
                </td>
                <td className="px-4 py-3 space-x-2 text-right">
                  <Button
                    onClick={() => {
                      setEditing(it);
                      setForm(it);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button color="red" onClick={() => del(it._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="text-center py-10 text-gray-400" colSpan={8}>
                  No items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal
          title={editing ? "Edit Item" : "Add Item"}
          onClose={() => setOpen(false)}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e: any) => onChange("name", e.target.value)}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(e: any) => onChange("category", e.target.value)}
              options={[
                { label: "Ice Cream", value: "ice_cream" },
                { label: "Samosa", value: "samosa" },
              ]}
            />

            {/* 🧩 Variations Section */}
            <div className="col-span-2 border-t mt-4 pt-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 text-sm">Variations</h3>
                <Button size="sm" onClick={addVariation}>
                  + Add Variation
                </Button>
              </div>

              {form.variations.map((v: Variation, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 mb-2 bg-gray-50 rounded-lg p-3"
                >
                  <Input
                    label="Label"
                    value={v.label}
                    onChange={(e: any) => updateVariation(i, "label", e.target.value)}
                  />
                  <Input
                    label="Base Cost"
                    type="number"
                    value={v.baseCost}
                    onChange={(e: any) =>
                      updateVariation(i, "baseCost", parseFloat(e.target.value))
                    }
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={v.price}
                    onChange={(e: any) =>
                      updateVariation(i, "price", parseFloat(e.target.value))
                    }
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    value={v.quantity}
                    onChange={(e: any) =>
                      updateVariation(i, "quantity", parseInt(e.target.value))
                    }
                  />
                  <div className="col-span-4 text-right">
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => removeVariation(i)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🖼️ Image Upload Section */}
            <div className="col-span-2 mt-4">
              <span className="text-xs font-medium text-gray-600">Images</span>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  setFiles((prev) => [...prev, ...droppedFiles]);
                }}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-gray-500 transition"
              >
                <label className="block text-sm text-gray-600 cursor-pointer">
                  Drag & drop or click to select
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {files.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${i}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-5 h-5 hidden group-hover:flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {!files.length &&
                  editing &&
                  form.images?.map((url: string, i: number) => (
                    <div key={i} className="relative w-20 h-20 group">
                      <img
                        src={url}
                        alt="existing"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <Button onClick={submit}>
              {editing ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
