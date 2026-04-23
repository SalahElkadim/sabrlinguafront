// src/pages/programs/ProgramsList.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
  Clock,
  DollarSign,
  User,
  BookOpen,
  LayoutGrid,
  ChevronDown,
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
// Schedule Badge
// ─────────────────────────────────────────
const DAY_NAMES = {
  0: "الأحد",
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
};

function ScheduleBadge({ day_of_week, time }) {
  const dayName = DAY_NAMES[day_of_week] || day_of_week;
  return (
    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
      {dayName} · {time?.slice(0, 5)}
    </span>
  );
}

// ─────────────────────────────────────────
// Schedule Row (inside form)
// ─────────────────────────────────────────
function ScheduleRow({ index, schedule, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
      <select
        value={schedule.day_of_week}
        onChange={(e) => onChange(index, "day_of_week", Number(e.target.value))}
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      >
        {Object.entries(DAY_NAMES).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="time"
        value={schedule.time}
        onChange={(e) => onChange(index, "time", e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-8 h-8 rounded-lg hover:bg-rose-100 flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-rose-500" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Program Form Modal
// ─────────────────────────────────────────
function ProgramModal({ program, teachers, onClose, onSaved }) {
  const isEdit = !!program;
  const [form, setForm] = useState({
    teacher: program?.teacher || "",
    title: program?.title || "",
    description: program?.description || "",
    recurrence: program?.recurrence || "weekly",
    duration: program?.duration || "",
    price: program?.price || "",
    is_active: program?.is_active ?? true,
  });
  const [schedules, setSchedules] = useState(
    program?.schedules?.length
      ? program.schedules.map((s) => ({
          day_of_week: s.day_of_week,
          time: s.time,
        }))
      : [{ day_of_week: 0, time: "08:00" }]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const addSchedule = () =>
    setSchedules((p) => [...p, { day_of_week: 0, time: "08:00" }]);
  const removeSchedule = (i) =>
    setSchedules((p) => p.filter((_, idx) => idx !== i));
  const changeSchedule = (i, field, val) =>
    setSchedules((p) =>
      p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );

  const validate = () => {
    const errs = {};
    if (!form.teacher) errs.teacher = "اختر المدرس";
    if (!form.title.trim()) errs.title = "العنوان مطلوب";
    if (!form.price) errs.price = "السعر مطلوب";
    if (!form.duration.trim()) errs.duration = "المدة مطلوبة";
    if (!schedules.length) errs.schedules = "أضف موعدًا واحدًا على الأقل";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, schedules };
      if (isEdit) {
        await api.patch(`/booking/programs/${program.id}/update/`, payload);
      } else {
        await api.post("/booking/programs/create/", payload);
      }
      onSaved(isEdit ? "✅ تم تحديث البرنامج" : "✅ تم إنشاء البرنامج");
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") setErrors(data);
      else setErrors({ general: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
      errors[field]
        ? "border-rose-400 bg-rose-50"
        : "border-gray-200 bg-gray-50 focus:bg-white"
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "تعديل البرنامج" : "إنشاء برنامج جديد"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? program.title : "أدخل تفاصيل البرنامج التعليمي"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4" dir="rtl">
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.general}
            </div>
          )}

          {/* Teacher */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              المدرس <span className="text-rose-400">*</span>
            </label>
            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              className={inputClass("teacher")}
            >
              <option value="">اختر المدرس...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.subject}
                </option>
              ))}
            </select>
            {errors.teacher && (
              <p className="text-xs text-rose-500 mt-1">{errors.teacher}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              عنوان البرنامج <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="مثال: برنامج تأسيس الإنجليزي"
              className={inputClass("title")}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              وصف البرنامج
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="وصف تفصيلي للبرنامج..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Recurrence + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                نظام الحصص <span className="text-rose-400">*</span>
              </label>
              <select
                name="recurrence"
                value={form.recurrence}
                onChange={handleChange}
                className={inputClass("recurrence")}
              >
                <option value="weekly">أسبوعي</option>
                <option value="biweekly">كل أسبوعين</option>
                <option value="monthly">شهري</option>
                <option value="daily">يومي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                المدة <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="مثال: 3 أشهر"
                className={inputClass("duration")}
              />
              {errors.duration && (
                <p className="text-xs text-rose-500 mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              السعر (ريال) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="500"
              min="0"
              step="0.01"
              className={inputClass("price")}
            />
            {errors.price && (
              <p className="text-xs text-rose-500 mt-1">{errors.price}</p>
            )}
          </div>

          {/* Schedules */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                المواعيد <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={addSchedule}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة موعد
              </button>
            </div>
            <div className="space-y-2">
              {schedules.map((s, i) => (
                <ScheduleRow
                  key={i}
                  index={i}
                  schedule={s}
                  onChange={changeSchedule}
                  onRemove={removeSchedule}
                />
              ))}
            </div>
            {errors.schedules && (
              <p className="text-xs text-rose-500 mt-1">{errors.schedules}</p>
            )}
          </div>

          {/* Is Active */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className={`relative w-10 h-6 rounded-full transition-colors ${
                form.is_active ? "bg-indigo-500" : "bg-gray-300"
              }`}
              onClick={() =>
                setForm((p) => ({ ...p, is_active: !p.is_active }))
              }
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  form.is_active ? "right-1" : "right-5"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              البرنامج نشط (يظهر للطلاب)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "حفظ التعديلات" : "إنشاء البرنامج"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Delete Modal
// ─────────────────────────────────────────
function DeleteModal({ program, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/booking/programs/${program.id}/delete/`);
      onDeleted("🗑️ تم حذف البرنامج بنجاح");
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">حذف البرنامج</h3>
        <p className="text-gray-500 text-sm mb-6" dir="rtl">
          هل أنت متأكد من حذف{" "}
          <span className="font-bold text-gray-800">{program.title}</span>؟ لا
          يمكن التراجع.
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
// Program Card
// ─────────────────────────────────────────
function ProgramCard({ program, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="p-5" dir="rtl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${
                  program.is_active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {program.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              {program.title}
            </h3>
            <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {program.teacher_name}
            </p>
          </div>
          <div className="text-left flex-shrink-0">
            <p className="text-xl font-black text-indigo-600">
              {program.price}
            </p>
            <p className="text-xs text-gray-400">ريال</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> {program.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />{" "}
            {program.recurrence === "weekly"
              ? "أسبوعي"
              : program.recurrence === "daily"
              ? "يومي"
              : program.recurrence === "biweekly"
              ? "كل أسبوعين"
              : "شهري"}
          </span>
        </div>

        {/* Schedules */}
        {program.schedules?.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              {(expanded
                ? program.schedules
                : program.schedules.slice(0, 3)
              ).map((s, i) => (
                <ScheduleBadge
                  key={i}
                  day_of_week={s.day_of_week}
                  time={s.time}
                />
              ))}
              {program.schedules.length > 3 && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold px-2"
                >
                  +{program.schedules.length - 3} أكثر
                </button>
              )}
            </div>
          </div>
        )}

        {program.description && (
          <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
            {program.description}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
        <button
          onClick={() => onEdit(program)}
          className="flex items-center justify-center gap-1.5 py-3 text-xs text-indigo-600 hover:bg-indigo-50 transition-colors font-semibold"
        >
          <Edit2 className="w-3.5 h-3.5" /> تعديل
        </button>
        <button
          onClick={() => onDelete(program)}
          className="flex items-center justify-center gap-1.5 py-3 text-xs text-rose-500 hover:bg-rose-50 transition-colors font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" /> حذف
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function ProgramsList() {
  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, tRes] = await Promise.all([
        api.get("/booking/programs/"),
        api.get("/booking/teachers/"),
      ]);
      setPrograms(pRes.data.programs || []);
      setTeachers(tRes.data.teachers || []);
    } catch {
      showToast("فشل في التحميل", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type });
  const handleSaved = (msg) => {
    setModal(null);
    setSelected(null);
    showToast(msg);
    fetchAll();
  };
  const handleDeleted = (msg) => {
    setModal(null);
    setSelected(null);
    showToast(msg);
    fetchAll();
  };
  const open = (type, p = null) => {
    setSelected(p);
    setModal(type);
  };
  const close = () => {
    setModal(null);
    setSelected(null);
  };

  const filtered = programs.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.teacher_name?.toLowerCase().includes(search.toLowerCase());
    const matchTeacher = !filterTeacher || String(p.teacher) === filterTeacher;
    return matchSearch && matchTeacher;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {(modal === "add" || modal === "edit") && (
        <ProgramModal
          program={modal === "edit" ? selected : null}
          teachers={teachers}
          onClose={close}
          onSaved={handleSaved}
        />
      )}
      {modal === "delete" && (
        <DeleteModal
          program={selected}
          onClose={close}
          onDeleted={handleDeleted}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة البرامج</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {programs.length} برنامج مسجل
          </p>
        </div>
        <button
          onClick={() => open("add")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4" /> إنشاء برنامج
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "إجمالي البرامج",
            value: programs.length,
            icon: LayoutGrid,
            color: "indigo",
          },
          {
            label: "برامج نشطة",
            value: programs.filter((p) => p.is_active).length,
            icon: CheckCircle,
            color: "emerald",
          },
          {
            label: "إجمالي المدرسين",
            value: teachers.length,
            icon: User,
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
            placeholder="ابحث بعنوان البرنامج أو المدرس..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <select
          value={filterTeacher}
          onChange={(e) => setFilterTeacher(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white min-w-40"
        >
          <option value="">كل المدرسين</option>
          {teachers.map((t) => (
            <option key={t.id} value={String(t.id)}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <LayoutGrid className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <h3 className="text-gray-600 font-bold mb-1">
            {search ? "لا توجد نتائج" : "لا توجد برامج بعد"}
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            {search ? "جرب البحث بكلمة أخرى" : "ابدأ بإنشاء أول برنامج الآن"}
          </p>
          {!search && (
            <button
              onClick={() => open("add")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> إنشاء برنامج
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              onEdit={(p) => open("edit", p)}
              onDelete={(p) => open("delete", p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
