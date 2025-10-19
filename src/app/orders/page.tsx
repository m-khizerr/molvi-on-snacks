"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Types ---------- */
type User = { _id: string; name: string; phone?: string };
type Variation = { label: string; price: number; baseCost: number; quantity: number };
type Item = { _id: string; name: string; category: string; variations: Variation[] };
type OrderItem = { item: string; variation: string; quantity: number };

/* ---------- Page ---------- */
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [form, setForm] = useState<any>({
    customer: "",
    customerPhone: "",
    items: [{ item: "", variation: "", quantity: 1 }],
    deliveryFee: 0,
    deliveryCost: 0,
    paymentMethod: "Cash (CoD)",
    storeAmount: 0,
    orderAmount: 0,
    orderPlusDelivery: 0,
    date: new Date().toISOString().substring(0, 10),
  });

  const onChange = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    (async () => {
      const [u, i, o] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/items"),
        fetch("/api/orders"),
      ]);
      setUsers(await u.json());
      setItems(await i.json());
      const odata = await o.json();
      setOrders(odata.orders);
      setStats(odata.stats);
    })();
  }, []);

  /* ---------- Customer Suggestions ---------- */
  useEffect(() => {
    if (!form.customer.trim()) return setSuggestions([]);
    const match = users.filter((u) =>
      u.name.toLowerCase().includes(form.customer.toLowerCase())
    );
    setSuggestions(match);
  }, [form.customer, users]);

  /* ---------- Handle Item/Variation Changes ---------- */
  const handleItemChange = (idx: number, key: string, value: any) => {
    const updated = [...form.items];
    updated[idx][key] = value;

    // reset variation when item changes
    if (key === "item") updated[idx].variation = "";
    setForm({ ...form, items: updated });
  };

  const addItem = () =>
    setForm({ ...form, items: [...form.items, { item: "", variation: "", quantity: 1 }] });

  const removeItem = (i: number) =>
    setForm({ ...form, items: form.items.filter((_: any, x: number) => x !== i) });

  /* ---------- Auto-Totals ---------- */
  useEffect(() => {
    let orderAmount = 0;
    for (const it of form.items) {
      const found = items.find((x) => x._id === it.item);
      const v = found?.variations?.find((vv) => vv.label === it.variation);
      if (v) orderAmount += v.price * (it.quantity || 0);
    }
    const orderPlusDelivery = orderAmount + (form.deliveryFee || 0);
    const storeAmount =
      form.deliveryCost > 0 ? orderAmount : orderAmount + (form.deliveryFee || 0);

    setForm((f: any) => ({ ...f, orderAmount, orderPlusDelivery, storeAmount }));
  }, [form.items, form.deliveryFee, form.deliveryCost, items]);

  /* ---------- Submit ---------- */
  const submit = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      alert("Failed to create order: " + err.error);
      return;
    }
    const saved = await res.json();
    setOrders([saved, ...orders]);
    setOpen(false);
  };

  /* ---------- Render ---------- */
  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">📦 Orders Dashboard</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl shadow-sm transition"
        >
          + New Order
        </button>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <SummaryCard title="Orders This Month" value={stats.totalOrdersThisMonth || 0} />
        <SummaryCard title="Total Orders" value={stats.totalOrders || 0} />
        <SummaryCard
          title="Earnings This Month"
          value={`₨ ${stats.earningsThisMonth?.toLocaleString() || 0}`}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {["#", "Customer", "Date", "Amount", "Total", "Payment"].map((h) => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o._id}
                onClick={() => setSelectedOrder(o)}
                className="border-t hover:bg-gray-100 cursor-pointer transition"
              >
                <td className="px-4 py-3 font-mono text-gray-800">{o.orderNo}</td>
                <td className="px-4 py-3 text-gray-800">
                  {typeof o.customer === "string" ? o.customer : o.customer?.name}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {new Date(o.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  ₨ {o.orderAmount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  ₨ {(o.orderAmount + o.deliveryFee + o.deliveryCost).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">{o.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Order */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} items={items} onClose={() => setSelectedOrder(null)} />
      )}

      {/* New Order */}
      {open && (
        <Modal title="New Order" onClose={() => setOpen(false)}>
          <div className="space-y-6">
            {/* Customer */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                value={form.customer}
                onChange={(e: any) => onChange("customer", e.target.value)}
              />
              <Input
                label="Customer Phone"
                value={form.customerPhone}
                onChange={(e: any) => onChange("customerPhone", e.target.value)}
              />
            </div>

            {/* Date & Payment */}
            <Input
              type="date"
              label="Date"
              value={form.date}
              onChange={(e: any) => onChange("date", e.target.value)}
            />
            <Select
              label="Payment Method"
              value={form.paymentMethod}
              onChange={(e: any) => onChange("paymentMethod", e.target.value)}
              options={[
                "Cash (CoD)",
                "Online (EasyPaisa)",
                "Bank Transfer",
                "Card Payment",
              ].map((p) => ({ label: p, value: p }))}
            />

            {/* Items Section */}
            <div className="space-y-4 border-t pt-5">
              <h3 className="font-semibold text-gray-800 text-lg">Items</h3>
              {form.items.map((it: OrderItem, idx: number) => {
                const found = items.find((x) => x._id === it.item);
                const selectedVar = found?.variations?.find(
                  (v) => v.label === it.variation
                );
                const subtotal = selectedVar ? selectedVar.price * it.quantity : 0;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:items-center">
                      {/* Item */}
                      <select
                        value={it.item}
                        onChange={(e) =>
                          handleItemChange(idx, "item", e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 w-full md:w-[200px]"
                      >
                        <option value="">Select Item</option>
                        {items.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.category})
                          </option>
                        ))}
                      </select>

                      {/* Variation */}
                      <select
                        value={it.variation}
                        onChange={(e) =>
                          handleItemChange(idx, "variation", e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 w-full md:w-[180px]"
                        disabled={!found}
                      >
                        <option value="">Select Variation</option>
                        {found?.variations?.map((v) => (
                          <option key={v.label} value={v.label}>
                            {v.label} — ₨ {v.price}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", parseInt(e.target.value))
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-20"
                        placeholder="Qty"
                      />
                    </div>

                    <div className="flex justify-between md:justify-end items-center w-full md:w-auto">
                      <p className="text-gray-700 font-medium text-sm">
                        Subtotal:{" "}
                        <span className="text-gray-900 font-semibold">
                          ₨ {subtotal.toLocaleString()}
                        </span>
                      </p>
                      <button
                        onClick={() => removeItem(idx)}
                        className="ml-3 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={addItem}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-xl font-medium"
              >
                + Add Item
              </button>
            </div>

            {/* Delivery */}
            <Input
              type="number"
              label="Delivery Fee (Customer Pays)"
              value={form.deliveryFee}
              onChange={(e: any) => onChange("deliveryFee", parseFloat(e.target.value))}
            />
            <Input
              type="number"
              label="Delivery Cost (You Pay)"
              value={form.deliveryCost}
              onChange={(e: any) => onChange("deliveryCost", parseFloat(e.target.value))}
            />

            {/* Summary */}
            <div className="border-t pt-4 space-y-1 text-gray-700 font-medium">
              <div className="flex justify-between">
                <span>Order Amount:</span>
                <span>₨ {form.orderAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total (Customer Pays):</span>
                <span>₨ {form.orderPlusDelivery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Store Amount:</span>
                <span>₨ {form.storeAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end border-t pt-4">
              <button
                onClick={submit}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-xl font-medium transition"
              >
                Create Order
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Shared Components ---------- */
function SummaryCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-[min(750px,95vw)] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              ✕
            </button>
          </div>
          <div className="pt-4">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Input({ label, ...props }: any) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <input
        {...props}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-gray-800/30 outline-none transition"
      />
    </label>
  );
}

function Select({ label, value, options, onChange }: any) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:ring-2 focus:ring-gray-800/30 outline-none transition cursor-pointer"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function OrderDetailsModal({ order, onClose }: any) {
  return (
    <Modal title={`Order #${order.orderNo} — ${order.status || "Pending"}`} onClose={onClose}>
      <div className="space-y-8 text-gray-800">
        {/* 🧍 Customer Info */}
        <section className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Customer Name</p>
            <p className="text-base font-semibold">{order.customer?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-base">{order.customer?.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Customer Type</p>
            <p className="text-base">{order.type || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Payment Method</p>
            <p className="text-base">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Order Date</p>
            <p className="text-base">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-base">
              {new Date(order.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </section>

        {/* 🛒 Items Table */}
        <section>
          <h3 className="font-semibold text-lg mb-3">🛍️ Ordered Items</h3>
          <table className="w-full text-sm border">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-3 py-2">Item Name</th>
                <th className="text-left px-3 py-2">Variation</th>
                <th className="text-right px-3 py-2">Base Cost</th>
                <th className="text-right px-3 py-2">Price</th>
                <th className="text-center px-3 py-2">Qty</th>
                <th className="text-right px-3 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it: any, idx: number) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {it.nameSnapshot || "Unknown Item"}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {it.variationSnapshot?.label || "-"}
                  </td>
                  <td className="text-right px-3 py-2 text-gray-700">
                    ₨ {it.variationSnapshot?.baseCost?.toLocaleString() || 0}
                  </td>
                  <td className="text-right px-3 py-2 text-gray-800 font-semibold">
                    ₨ {it.variationSnapshot?.price?.toLocaleString() || 0}
                  </td>
                  <td className="text-center px-3 py-2">{it.quantity}</td>
                  <td className="text-right px-3 py-2 font-semibold">
                    ₨ {it.subtotal?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 💰 Financial Summary */}
        <section className="border-t pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Order Amount:</span>
            <span>₨ {order.orderAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>₨ {order.discount?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee (Customer Pays):</span>
            <span>₨ {order.deliveryFee?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Cost (You Pay):</span>
            <span>₨ {order.deliveryCost?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
            <span>Net Amount (Customer Pays):</span>
            <span>
              ₨ {(order.orderAmount - (order.discount || 0) + order.deliveryFee).toLocaleString()}
            </span>
          </div>
        </section>

        {/* ⚙️ Order Meta Info */}
        <section className="border-t pt-4 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-800">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-medium text-gray-800">Status:</span>{" "}
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                order.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-800">Last Updated:</span>{" "}
            {new Date(order.updatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </section>
      </div>
    </Modal>
  );
}

