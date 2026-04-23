// src/pages/subscriptions/SubscriptionsList.jsx
import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  User,
  BookOpen,
  Calendar,
  DollarSign,
  CreditCard,
  Filter,
  RefreshCw,
  Clock,
} from "lucide-react";
import api from "../../api/axios";

// ─────────────────────────────────────────
// Toast
// ─────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${
        type === "success" ? "bg-emerald-500" : "bg-rose-500"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      {message}
      <button onClick={onClose}>
        <X className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    paid: {
      label: "مدفوع",
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    pending: {
      label: "معلق",
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    failed: {
      label: "فشل",
      cls: "bg-rose-50 text-rose-700 border border-rose-200",
    },
  };
  const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────
// Delete Modal
// ─────────────────────────────────────────
function DeleteModal({ subscription, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Using a generic delete endpoint; adjust if you have a specific one
      await api.delete(`/booking/subscriptions/${subscription.id}/delete/`);
      onDeleted("🗑️ تم حذف الاشتراك بنجاح");
    } catch {
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">حذف الاشتراك</h3>
        <p className="text-gray-500 text-sm mb-6" dir="rtl">
          هل تريد حذف اشتراك{" "}
          <span className="font-bold text-gray-800">
            {subscription.student_name}
          </span>{" "}
          في برنامج{" "}
          <span className="font-bold text-gray-800">
            {subscription.program?.title}
          </span>
          ؟
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} نعم، احذف
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Subscription Row (table row)
// ─────────────────────────────────────────
function SubscriptionRow({ sub, onDelete }) {
  const date = sub.created_at
    ? new Date(sub.created_at).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors group">
      <td className="px-4 py-3.5" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {sub.student_name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5" dir="rtl">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {sub.program?.title || "—"}
          </p>
          <p className="text-xs text-indigo-500 mt-0.5">
            {sub.program?.teacher_name || ""}
          </p>
        </div>
      </td>
      <td className="px-4 py-3.5 text-center">
        <StatusBadge status={sub.payment_status} />
      </td>
      <td className="px-4 py-3.5 text-center">
        <span className="text-sm font-bold text-gray-900">
          {sub.amount}{" "}
          <span className="text-xs text-gray-400 font-normal">ريال</span>
        </span>
      </td>
      <td className="px-4 py-3.5 text-center">
        <span className="text-xs text-gray-400">{date}</span>
      </td>
      <td className="px-4 py-3.5 text-center">
        <p className="text-xs font-mono text-gray-400 truncate max-w-24 mx-auto">
          {sub.payment_id || "—"}
        </p>
      </td>
      <td className="px-4 py-3.5 text-center">
        <button
          onClick={() => onDelete(sub)}
          className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-100 flex items-center justify-center transition-all mx-auto"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
        </button>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  // NOTE: The existing API only returns the logged-in student's subscriptions.
  // For admin, you'll need a new backend endpoint like GET /booking/subscriptions/all/
  // that returns all subscriptions. Update the URL below accordingly.
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/subscriptions/all/"); // ← admin endpoint
      setSubscriptions(res.data.subscriptions || []);
    } catch {
      showToast("فشل في تحميل الاشتراكات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const handleDeleted = (msg) => {
    setModal(null);
    setSelected(null);
    showToast(msg);
    fetchSubscriptions();
  };
  const open = (sub) => {
    setSelected(sub);
    setModal("delete");
  };
  const close = () => {
    setModal(null);
    setSelected(null);
  };

  const filtered = subscriptions.filter((s) => {
    const matchSearch =
      s.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.program?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || s.payment_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: subscriptions.length,
    paid: subscriptions.filter((s) => s.payment_status === "paid").length,
    revenue: subscriptions
      .filter((s) => s.payment_status === "paid")
      .reduce((sum, s) => sum + Number(s.amount || 0), 0),
  };

  return (
    <div className="space-y-6" dir="rtl">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {modal === "delete" && (
        <DeleteModal
          subscription={selected}
          onClose={close}
          onDeleted={handleDeleted}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">اشتراكات الطلاب</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {stats.total} اشتراك إجمالي
          </p>
        </div>
        <button
          onClick={fetchSubscriptions}
          className="flex items-center gap-2 border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-white"
        >
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "إجمالي الاشتراكات",
            value: stats.total,
            icon: CreditCard,
            color: "indigo",
          },
          {
            label: "اشتراكات مدفوعة",
            value: stats.paid,
            icon: CheckCircle,
            color: "emerald",
          },
          {
            label: "إجمالي الإيرادات",
            value: `${stats.revenue.toLocaleString()} ر`,
            icon: DollarSign,
            color: "violet",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-4`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 text-${color}-500`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث باسم الطالب أو البرنامج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {[
            ["all", "الكل"],
            ["paid", "مدفوع"],
            ["pending", "معلق"],
            ["failed", "فشل"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterStatus(val)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                filterStatus === val
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <CreditCard className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <h3 className="text-gray-600 font-bold mb-1">
            {search ? "لا توجد نتائج" : "لا توجد اشتراكات بعد"}
          </h3>
          <p className="text-gray-400 text-sm">
            {search
              ? "جرب البحث بكلمة أخرى"
              : "ستظهر الاشتراكات هنا عند وجودها"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "الطالب",
                    "البرنامج",
                    "الحالة",
                    "المبلغ",
                    "التاريخ",
                    "رقم الدفع",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-bold text-gray-500 text-right whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <SubscriptionRow key={sub.id} sub={sub} onDelete={open} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 text-right">
            عرض {filtered.length} من {subscriptions.length} اشتراك
          </div>
        </div>
      )}
    </div>
  );
}
