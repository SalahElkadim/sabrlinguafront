// src/pages/TeachersList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  BookOpen,
  Clock,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import api from "../../api/axios"; // عدّل المسار حسب مشروعك

// ============================================
// Toast Component
// ============================================
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg text-white transition-all ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="font-medium">{message}</span>
      <button onClick={onClose}>
        <X className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}

// ============================================
// Teacher Form Modal
// ============================================
function TeacherModal({ teacher, onClose, onSaved }) {
  const isEdit = !!teacher;
  const [form, setForm] = useState({
    name: teacher?.name || "",
    subject: teacher?.subject || "",
    years_of_experience: teacher?.years_of_experience || "",
    session_price: teacher?.session_price || "",
    bio: teacher?.bio || "",
    is_active: teacher?.is_active ?? true,
  });
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!form.subject.trim()) newErrors.subject = "المادة مطلوبة";
    if (!form.years_of_experience)
      newErrors.years_of_experience = "سنوات الخبرة مطلوبة";
    if (!form.session_price) newErrors.session_price = "تكلفة الحصة مطلوبة";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (picture) formData.append("profile_picture", picture);

      if (isEdit) {
        await api.patch(`/booking/teachers/${teacher.id}/update/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/booking/teachers/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onSaved(isEdit ? "تم تحديث المدرس بنجاح" : "تم إضافة المدرس بنجاح");
    } catch (err) {
      setErrors({ general: "حدث خطأ، يرجى المحاولة مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? "تعديل بيانات المدرس" : "إضافة مدرس جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" dir="rtl">
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المدرس <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="أدخل اسم المدرس"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المادة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="مثال: English Grammar"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.subject ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* بعد سطر الـ subject مباشرة */}
          <div className="flex items-center gap-1.5 mt-1">
            {teacher.reviews_count > 0 ? (
              <>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= Math.round(teacher.average_rating)
                          ? "text-amber-400"
                          : "text-gray-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {teacher.average_rating?.toFixed(1)} ({teacher.reviews_count}{" "}
                  تقييم)
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400 italic">
                لا يوجد تقييم بعد
              </span>
            )}
          </div>

          {/* Experience + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سنوات الخبرة <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="years_of_experience"
                value={form.years_of_experience}
                onChange={handleChange}
                placeholder="5"
                min="0"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.years_of_experience
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.years_of_experience && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.years_of_experience}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تكلفة الحصة (جنيه) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="session_price"
                value={form.session_price}
                onChange={handleChange}
                placeholder="200"
                min="0"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.session_price
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.session_price && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.session_price}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نبذة مختصرة
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="اكتب نبذة عن المدرس..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors"
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الصورة الشخصية
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPicture(e.target.files[0])}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none file:ml-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:text-xs cursor-pointer"
            />
            {isEdit && teacher?.profile_picture_url && !picture && (
              <p className="text-xs text-gray-500 mt-1">
                صورة موجودة - اترك الحقل فارغاً للإبقاء عليها
              </p>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              المدرس نشط (يظهر للطلاب)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "حفظ التعديلات" : "إضافة المدرس"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Delete Confirm Modal
// ============================================
function DeleteModal({ teacher, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/booking/teachers/${teacher.id}/delete/`);
      onDeleted("تم حذف المدرس بنجاح");
    } catch {
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">حذف المدرس</h3>
        <p className="text-gray-500 text-sm mb-6" dir="rtl">
          هل أنت متأكد من حذف{" "}
          <span className="font-semibold text-gray-800">{teacher.name}</span>؟
          لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            نعم، احذف
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Teacher Card
// ============================================
function TeacherCard({ teacher, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Top section */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {teacher.profile_picture_url ? (
              <img
                src={teacher.profile_picture_url}
                alt={teacher.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center border-2 border-primary-100">
                <User className="w-8 h-8 text-primary-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0" dir="rtl">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base truncate">
                {teacher.name}
              </h3>
              <span
                className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  teacher.is_active
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {teacher.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary-600 mb-2">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">
                {teacher.subject}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4" dir="rtl">
          <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">الخبرة</p>
              <p className="text-sm font-bold text-gray-900">
                {teacher.years_of_experience} سنوات
              </p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">الحصة</p>
              <p className="text-sm font-bold text-gray-900">
                {teacher.session_price} جنيه
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {teacher.bio && (
          <p
            className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed"
            dir="rtl"
          >
            {teacher.bio}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 flex divide-x divide-gray-100">
        <button
          onClick={() => onEdit(teacher)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
        >
          <Edit2 className="w-4 h-4" />
          تعديل
        </button>
        <button
          onClick={() => onDelete(teacher)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
          حذف
        </button>
      </div>
    </div>
  );
}

// ============================================
// Main Page
// ============================================
export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/teachers/");
      setTeachers(res.data.teachers || []);
    } catch {
      showToast("حدث خطأ في تحميل المدرسين", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSaved = (message) => {
    setModalType(null);
    setSelectedTeacher(null);
    showToast(message, "success");
    fetchTeachers();
  };

  const handleDeleted = (message) => {
    setModalType(null);
    setSelectedTeacher(null);
    showToast(message, "success");
    fetchTeachers();
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      {(modalType === "add" || modalType === "edit") && (
        <TeacherModal
          teacher={modalType === "edit" ? selectedTeacher : null}
          onClose={() => {
            setModalType(null);
            setSelectedTeacher(null);
          }}
          onSaved={handleSaved}
        />
      )}
      {modalType === "delete" && (
        <DeleteModal
          teacher={selectedTeacher}
          onClose={() => {
            setModalType(null);
            setSelectedTeacher(null);
          }}
          onDeleted={handleDeleted}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المدرسين</h1>
          <p className="text-sm text-gray-500 mt-1">
            {teachers.length} مدرس مسجل
          </p>
        </div>
        <button
          onClick={() => setModalType("add")}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة مدرس
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث بالاسم أو المادة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">جاري التحميل...</p>
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <User className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-700 font-semibold mb-1">
            {search ? "لا توجد نتائج" : "لا يوجد مدرسون بعد"}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {search ? "جرب البحث بكلمة أخرى" : "ابدأ بإضافة أول مدرس الآن"}
          </p>
          {!search && (
            <button
              onClick={() => setModalType("add")}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة مدرس
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onEdit={(t) => {
                setSelectedTeacher(t);
                setModalType("edit");
              }}
              onDelete={(t) => {
                setSelectedTeacher(t);
                setModalType("delete");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
