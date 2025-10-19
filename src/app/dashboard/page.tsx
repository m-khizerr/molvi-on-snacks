"use client";
import { useEffect, useState, useMemo } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    (async () => {
      const [ordersRes, usersRes, itemsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/users"),
        fetch("/api/items"),
      ]);
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
      setUsers(await usersRes.json());
      setItems(await itemsRes.json());
      setLoading(false);
    })();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!startDate && !endDate) return orders;
    const s = startDate ? new Date(startDate) : new Date("2000-01-01");
    const e = endDate ? new Date(endDate) : new Date();
    return orders.filter((o) => {
      const d = new Date(o.date);
      return d >= s && d <= e;
    });
  }, [orders, startDate, endDate]);

  // ---- Aggregates ----
  const totalUsers = users.length;
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (Number(o.orderPlusDelivery) || 0),
    0
  );
  const totalProfit = filteredOrders.reduce(
    (sum, o) => sum + ((Number(o.storeAmount) || 0) - (Number(o.deliveryCost) || 0)),
    0
  );
  const avgOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const recentOrders = [...filteredOrders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ---- Monthly Data ----
  const monthlyRevenue = Array(12).fill(0);
  const monthlyProfit = Array(12).fill(0);
  const now = new Date();
  for (const o of filteredOrders) {
    const d = new Date(o.date);
    const monthDiff =
      now.getMonth() - d.getMonth() + 12 * (now.getFullYear() - d.getFullYear());
    if (monthDiff < 12 && monthDiff >= 0) {
      const idx = 11 - monthDiff;
      monthlyRevenue[idx] += Number(o.orderPlusDelivery) || 0;
      monthlyProfit[idx] +=
        (Number(o.storeAmount) || 0) - (Number(o.deliveryCost) || 0);
    }
  }
  const monthlyLabels = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i);
    return d.toLocaleString("default", { month: "short" });
  });

  // ---- Chart Data ----
  const lineData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Revenue (₨)",
        data: monthlyRevenue,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Revenue",
        backgroundColor: "#3b82f6",
        data: monthlyRevenue,
      },
      {
        label: "Profit",
        backgroundColor: "#10b981",
        data: monthlyProfit,
      },
    ],
  };

  const itemSales: Record<string, number> = {};
  for (const o of filteredOrders) {
    if (Array.isArray(o.items)) {
      for (const it of o.items) {
        const found = items.find((x) => x._id === it.item);
        if (!found) continue;
        itemSales[found.name] = (itemSales[found.name] || 0) + (it.quantity || 1);
      }
    }
  }
  const pieData = {
    labels: Object.keys(itemSales),
    datasets: [
      {
        data: Object.values(itemSales),
        backgroundColor: [
          "#3b82f6",
          "#f97316",
          "#10b981",
          "#eab308",
          "#a855f7",
          "#ef4444",
          "#06b6d4",
        ],
      },
    ],
  };

  if (loading) return <div className="p-10 text-gray-500">Loading analytics...</div>;

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-semibold text-gray-800">📊 Dashboard Analytics</h1>

        <div className="flex gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard
          title="Net Profit / Loss"
          value={`₨ ${totalProfit.toLocaleString()}`}
          color={totalProfit >= 0 ? "text-green-600" : "text-red-600"}
        />
        <StatCard
          title="Average Order Value"
          value={`₨ ${avgOrderValue.toFixed(0).toLocaleString()}`}
        />
      </div>

      {/* Charts in one row */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <ChartCard title="📈 Revenue Trend">
          <div className="h-[250px]">
            <Line
              data={lineData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </ChartCard>

        <ChartCard title="💰 Revenue vs Profit">
          <div className="h-[250px]">
            <Bar
              data={barData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </ChartCard>

        <ChartCard title="🥧 Item Sales Share">
          <div className="h-[250px] flex items-center justify-center">
            {Object.keys(itemSales).length > 0 ? (
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">No sales data available.</p>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">🕒 Recent Orders</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Payment</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-mono">{o.orderNo}</td>
                <td className="px-4 py-2">
                  {typeof o.customer === "string" ? o.customer : o.customer?.name}
                </td>
                <td className="px-4 py-2">
                  ₨ {Number(o.orderPlusDelivery || 0).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(o.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-gray-600">{o.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extra Insights */}
      <div className="grid md:grid-cols-2 gap-8">
        <ChartCard title="💳 Payment Method Breakdown">
          <PaymentMethodBreakdown orders={filteredOrders} />
        </ChartCard>
        <ChartCard title="⭐ Top Customers">
          <TopCustomers orders={filteredOrders} />
        </ChartCard>
      </div>
    </div>
  );
}

/* --- Components --- */
function StatCard({ title, value, color }: { title: string; value: any; color?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${color || "text-gray-800"}`}>{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function PaymentMethodBreakdown({ orders }: any) {
  const methods: Record<string, number> = {};
  for (const o of orders)
    methods[o.paymentMethod] = (methods[o.paymentMethod] || 0) + 1;

  const total = Object.values(methods).reduce((a, b) => a + b, 0);
  if (!total) return <p className="text-sm text-gray-500">No data available.</p>;
  return (
    <ul className="space-y-2 text-sm">
      {Object.entries(methods).map(([method, count]) => (
        <li key={method} className="flex justify-between border-b pb-1">
          <span>{method}</span>
          <span className="font-medium">
            {((count / total) * 100).toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

function TopCustomers({ orders }: any) {
  const customers: Record<string, number> = {};
  for (const o of orders) {
    const name =
      typeof o.customer === "string" ? o.customer : o.customer?.name || "Unknown";
    const total = parseFloat(o.orderPlusDelivery) || 0;
    customers[name] = (customers[name] || 0) + total;
  }

  const sorted = Object.entries(customers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (!sorted.length)
    return <p className="text-sm text-gray-500">No customers yet.</p>;

  return (
    <ul className="space-y-2 text-sm">
      {sorted.map(([name, amount]) => (
        <li key={name} className="flex justify-between border-b pb-1">
          <span>{name}</span>
          <span className="font-medium text-gray-800">
            ₨ {Math.round(amount).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
