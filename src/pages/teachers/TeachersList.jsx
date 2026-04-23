// src/pages/teachers/TeachersList.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  BookOpen,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Star,
  Eye,
  ChevronDown,
  Filter,
  MoreVertical,
  Award,
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
      className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold transition-all animate-fade-in ${
        type === "success" ? "bg-emerald-500" : "bg-rose-500"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      {message}
      <button onClick={onClose} className="opacity-60 hover:opacity-100 ml-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Stars
// ─────────────────────────────────────────
function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200 fill-gray-100"
            }`}
          />
        ))}
      </div>
      {count > 0 && (
        <span className="text-xs text-gray-400">
          {rating?.toFixed(1)} ({count})
        </span>
      )}
      {count === 0 && (
        <span className="text-xs text-gray-400 italic">لا تقييمات</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Teacher Form Modal
// ─────────────────────────────────────────
function TeacherModal({ teacher, onClose, onSaved }) {
  const isEdit = !!teacher;
  const [form, setForm] = useState({
    name: teacher?.name || "",
    subject: teacher?.subject || "",
    years_of_experience: teacher?.years_of_experience || "",
    bio: teacher?.bio || "",
    is_active: teacher?.is_active ?? true,
  });
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(teacher?.profile_picture_url || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "الاسم مطلوب";
    if (!form.subject.trim()) errs.subject = "المادة مطلوبة";
    if (!form.years_of_experience)
      errs.years_of_experience = "سنوات الخبرة مطلوبة";
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
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (picture) fd.append("profile_picture", picture);

      if (isEdit) {
        await api.patch(`/booking/teachers/${teacher.id}/update/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/booking/teachers/create/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSaved(isEdit ? "✅ تم تحديث المدرس بنجاح" : "✅ تم إضافة المدرس بنجاح");
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "تعديل بيانات المدرس" : "إضافة مدرس جديد"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? `تعديل: ${teacher.name}` : "أدخل بيانات المدرس الجديد"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
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

          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden border-2 border-indigo-100 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-indigo-300" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                الصورة الشخصية
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors">
                <Plus className="w-3.5 h-3.5" />{" "}
                {preview ? "تغيير الصورة" : "رفع صورة"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicture}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              اسم المدرس <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="مثال: أحمد محمد"
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              المادة <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="مثال: English Grammar"
              className={inputClass("subject")}
            />
            {errors.subject && (
              <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              سنوات الخبرة <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              name="years_of_experience"
              value={form.years_of_experience}
              onChange={handleChange}
              placeholder="5"
              min="0"
              className={inputClass("years_of_experience")}
            />
            {errors.years_of_experience && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.years_of_experience}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              نبذة مختصرة
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="اكتب نبذة عن المدرس..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
            />
          </div>

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
              المدرس نشط (يظهر للطلاب)
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? "حفظ التعديلات" : "إضافة المدرس"}
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
// Reviews Modal
// ─────────────────────────────────────────
function ReviewsModal({ teacher, onClose, onToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/booking/teachers/${teacher.id}/reviews/`);
      setReviews(res.data.reviews || []);
    } catch {
      onToast("فشل في تحميل التقييمات", "error");
    } finally {
      setLoading(false);
    }
  }, [teacher.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("هل تريد حذف هذا التقييم؟")) return;
    setDeleting(reviewId);
    try {
      await api.delete(`/booking/teachers/${teacher.id}/reviews/delete/`);
      onToast("تم حذف التقييم", "success");
      fetchReviews();
    } catch {
      onToast("فشل في حذف التقييم", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              تقييمات {teacher.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {reviews.length} تقييم
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">لا توجد تقييمات بعد</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3"
                dir="rtl"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-gray-800">
                      {r.student_name}
                    </span>
                    <Stars rating={r.rating} count={0} />
                  </div>
                  {r.comment && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(r.created_at).toLocaleDateString("ar")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-rose-100 flex items-center justify-center transition-colors group"
                >
                  {deleting === r.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-rose-500" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────
function DeleteModal({ teacher, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/booking/teachers/${teacher.id}/delete/`);
      onDeleted("🗑️ تم حذف المدرس بنجاح");
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">حذف المدرس</h3>
        <p className="text-gray-500 text-sm mb-6" dir="rtl">
          هل أنت متأكد من حذف{" "}
          <span className="font-bold text-gray-800">{teacher.name}</span>؟ لا
          يمكن التراجع.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-bold transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />} نعم، احذف
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Teacher Card
// ─────────────────────────────────────────
function TeacherCard({ teacher, onEdit, onDelete, onReviews }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group">
      <div className="p-5" dir="rtl">
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            {teacher.profile_picture_url ? (
              <img
                src={teacher.profile_picture_url}
                alt={teacher.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <User className="w-7 h-7 text-indigo-400" />
              </div>
            )}
            <div
              className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white ${
                teacher.is_active ? "bg-emerald-400" : "bg-gray-300"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {teacher.name}
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-lg font-semibold flex-shrink-0 ${
                  teacher.is_active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {teacher.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-indigo-600">
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-semibold">{teacher.subject}</span>
            </div>
            <div className="mt-2">
              <Stars
                rating={teacher.average_rating}
                count={teacher.reviews_count}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 bg-blue-50 rounded-xl px-3 py-2 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">خبرة</p>
              <p className="text-sm font-bold text-gray-800">
                {teacher.years_of_experience} سنة
              </p>
            </div>
          </div>
          <button
            onClick={() => onReviews(teacher)}
            className="flex-shrink-0 bg-amber-50 hover:bg-amber-100 rounded-xl px-3 py-2 flex items-center gap-2 transition-colors"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="text-right">
              <p className="text-xs text-gray-400">تقييمات</p>
              <p className="text-sm font-bold text-gray-800">
                {teacher.reviews_count}
              </p>
            </div>
          </button>
        </div>

        {teacher.bio && (
          <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
            {teacher.bio}
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
        <button
          onClick={() => onReviews(teacher)}
          className="flex items-center justify-center gap-1.5 py-3 text-xs text-amber-600 hover:bg-amber-50 transition-colors font-semibold"
        >
          <Eye className="w-3.5 h-3.5" /> التقييمات
        </button>
        <button
          onClick={() => onEdit(teacher)}
          className="flex items-center justify-center gap-1.5 py-3 text-xs text-indigo-600 hover:bg-indigo-50 transition-colors font-semibold"
        >
          <Edit2 className="w-3.5 h-3.5" /> تعديل
        </button>
        <button
          onClick={() => onDelete(teacher)}
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
export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // all | active | inactive
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete' | 'reviews'
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/teachers/");
      setTeachers(res.data.teachers || []);
    } catch {
      showToast("فشل في تحميل المدرسين", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSaved = (msg) => {
    setModal(null);
    setSelected(null);
    showToast(msg, "success");
    fetchTeachers();
  };
  const handleDeleted = (msg) => {
    setModal(null);
    setSelected(null);
    showToast(msg, "success");
    fetchTeachers();
  };

  const open = (type, teacher = null) => {
    setSelected(teacher);
    setModal(type);
  };
  const close = () => {
    setModal(null);
    setSelected(null);
  };

  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchActive =
      filterActive === "all" ||
      (filterActive === "active" ? t.is_active : !t.is_active);
    return matchSearch && matchActive;
  });

  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.is_active).length,
    avgRating: teachers.length
      ? (
          teachers.reduce((s, t) => s + (t.average_rating || 0), 0) /
          teachers.length
        ).toFixed(1)
      : "0",
  };

  return (
    <div className="space-y-6" dir="rtl">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {(modal === "add" || modal === "edit") && (
        <TeacherModal
          teacher={modal === "edit" ? selected : null}
          onClose={close}
          onSaved={handleSaved}
        />
      )}
      {modal === "delete" && (
        <DeleteModal
          teacher={selected}
          onClose={close}
          onDeleted={handleDeleted}
        />
      )}
      {modal === "reviews" && (
        <ReviewsModal teacher={selected} onClose={close} onToast={showToast} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المدرسين</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {stats.total} مدرس مسجل · {stats.active} نشط
          </p>
        </div>
        <button
          onClick={() => open("add")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4" /> إضافة مدرس
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "إجمالي المدرسين",
            value: stats.total,
            icon: User,
            color: "indigo",
          },
          {
            label: "المدرسون النشطون",
            value: stats.active,
            icon: CheckCircle,
            color: "emerald",
          },
          {
            label: "متوسط التقييم",
            value: stats.avgRating,
            icon: Star,
            color: "amber",
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
            placeholder="ابحث بالاسم أو المادة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {[
            ["all", "الكل"],
            ["active", "نشط"],
            ["inactive", "غير نشط"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterActive(val)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                filterActive === val
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">جاري التحميل...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <User className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <h3 className="text-gray-600 font-bold mb-1">
            {search ? "لا توجد نتائج" : "لا يوجد مدرسون بعد"}
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            {search ? "جرب البحث بكلمة أخرى" : "ابدأ بإضافة أول مدرس الآن"}
          </p>
          {!search && (
            <button
              onClick={() => open("add")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" /> إضافة مدرس
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TeacherCard
              key={t.id}
              teacher={t}
              onEdit={(t) => open("edit", t)}
              onDelete={(t) => open("delete", t)}
              onReviews={(t) => open("reviews", t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
