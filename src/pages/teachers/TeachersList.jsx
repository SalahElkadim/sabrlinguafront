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
  Mail,
} from "lucide-react";
import api from "../../api/axios";

/* ─── Glassmorphism Styles ─────────────────────────────────────────────── */
const STYLES = `
  .gl-page { --accent:#4f7cff; --accent-2:#8b5cf6; --accent-glow:rgba(79,124,255,0.22); }

  /* Cards */
  .gl-card {
    background: var(--glass-bg);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.4s ease;
  }
  .gl-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(79,124,255,0.12);
  }

  /* Stat cards */
  .gl-stat {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 16px;
    transition: background 0.4s ease;
  }

  /* Inputs */
  .gl-input {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    color: var(--text-primary);
    transition: all 0.2s ease, background 0.4s ease;
    outline: none;
  }
  .gl-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    background: var(--glass-active);
  }
  .gl-input::placeholder { color: var(--text-secondary); }

  /* Buttons */
  .gl-btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border: none; border-radius: 12px; color: #fff;
    font-weight: 700; font-size: 13px;
    box-shadow: 0 4px 20px var(--accent-glow);
    transition: all 0.2s ease; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .gl-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 28px var(--accent-glow); }
  .gl-btn-primary:disabled { opacity: 0.6; transform: none; }

  .gl-btn-ghost {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px; color: var(--text-primary);
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s ease;
  }
  .gl-btn-ghost:hover { background: var(--glass-hover); }

  .gl-filter-btn {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 10px; padding: 8px 16px;
    color: var(--text-secondary); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease;
  }
  .gl-filter-btn.active {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 16px var(--accent-glow);
  }
  .gl-filter-btn:not(.active):hover { background: var(--glass-hover); color: var(--text-primary); }

  /* Modal */
  .gl-modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .gl-modal {
    background: var(--dropdown-bg);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.2);
    width: 100%; max-width: 520px;
    max-height: 90vh; overflow-y: auto;
    animation: modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes modalIn {
    from { opacity:0; transform:scale(0.93) translateY(12px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }

  /* Form inputs inside modal */
  .gl-form-input {
    width: 100%; padding: 10px 16px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px; color: var(--text-primary);
    font-size: 13.5px; font-family: 'Sora', sans-serif;
    outline: none; transition: all 0.2s ease;
  }
  .gl-form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    background: var(--glass-active);
  }
  .gl-form-input::placeholder { color: var(--text-secondary); }
  .gl-form-input.error { border-color: var(--danger); background: var(--danger-bg); }
  .gl-form-input option { background: var(--dropdown-bg); color: var(--text-primary); }

  /* Avatar ring */
  .teacher-avatar {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(79,124,255,0.15), rgba(139,92,246,0.15));
    border: 1.5px solid rgba(79,124,255,0.2);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
  }
  .teacher-avatar img { width:100%; height:100%; object-fit:cover; }

  /* Status dot */
  .status-dot {
    width: 10px; height: 10px; border-radius: 50%;
    border: 2px solid var(--glass-bg);
  }
  .status-dot.active  { background: #34d399; }
  .status-dot.inactive { background: #9ca3af; }

  /* Badge */
  .gl-badge {
    font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 8px;
  }
  .gl-badge.active   { background: rgba(52,211,153,0.15); color: #10b981; border: 1px solid rgba(52,211,153,0.25); }
  .gl-badge.inactive { background: var(--glass-bg); color: var(--text-secondary); border: 1px solid var(--glass-border); }

  /* Card action strip */
  .card-actions {
    border-top: 1px solid var(--glass-border);
    display: grid; grid-template-columns: 1fr 1fr 1fr;
  }
  .card-action-btn {
    background: none; border: none; cursor: pointer;
    padding: 11px 0; font-size: 12px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: background 0.15s ease; font-family: 'Sora', sans-serif;
  }
  .card-action-btn:not(:last-child) { border-left: 1px solid var(--glass-border); }
  .card-action-btn.amber { color: #f59e0b; }
  .card-action-btn.amber:hover { background: rgba(245,158,11,0.1); }
  .card-action-btn.indigo { color: var(--accent); }
  .card-action-btn.indigo:hover { background: rgba(79,124,255,0.1); }
  .card-action-btn.danger { color: var(--danger); }
  .card-action-btn.danger:hover { background: var(--danger-bg); }

  /* Toggle switch */
  .gl-toggle { position:relative; width:40px; height:24px; cursor:pointer; flex-shrink:0; }
  .gl-toggle input { opacity:0; width:0; height:0; }
  .gl-toggle-track {
    position:absolute; inset:0; border-radius:99px;
    background: #d1d5db; transition:background 0.2s;
  }
  .gl-toggle input:checked + .gl-toggle-track { background: var(--accent); }
  .gl-toggle-thumb {
    position:absolute; top:3px; left:3px;
    width:18px; height:18px; border-radius:50%;
    background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.2);
    transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .gl-toggle input:checked ~ .gl-toggle-thumb { transform:translateX(16px); }

  /* Skeleton / loading */
  .gl-spinner { color: var(--accent); }

  /* Toast */
  .gl-toast {
    position: fixed; top: 20px; right: 20px; z-index: 999;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 16px;
    font-size: 13.5px; font-weight: 600; color: #fff;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateX(24px) scale(0.95); }
    to   { opacity:1; transform:translateX(0) scale(1); }
  }
  .gl-toast.success { background: linear-gradient(135deg,#10b981,#059669); }
  .gl-toast.error   { background: linear-gradient(135deg,#ef4444,#dc2626); }

  /* Section label */
  .gl-label {
    font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
    color: var(--text-secondary); margin-bottom: 6px;
  }

  /* Divider stripe */
  .gl-divider { border: none; border-top: 1px solid var(--glass-border); margin: 0; }

  /* Review card */
  .review-card {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: 14px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 12px;
  }

  /* Empty state */
  .gl-empty {
    text-align: center; padding: 80px 24px;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    border: 1.5px dashed var(--glass-border);
    border-radius: 20px;
  }
  .gl-empty-icon { color: var(--text-secondary); opacity: 0.3; margin: 0 auto 16px; }

  /* Page title */
  .gl-page-title { font-size: 22px; font-weight: 800; color: var(--text-primary); }
  .gl-page-subtitle { font-size: 12.5px; color: var(--text-secondary); margin-top: 2px; }

  /* Stat icon circle */
  .stat-icon-wrap {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Scrollbar */
  .gl-scroll::-webkit-scrollbar { width: 4px; }
  .gl-scroll::-webkit-scrollbar-track { background: transparent; }
  .gl-scroll::-webkit-scrollbar-thumb { background: var(--scroll-thumb); border-radius: 99px; }
`;

function injectStyles() {
  const id = "gl-teachers-styles";
  if (!document.getElementById(id)) {
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`gl-toast ${type}`}>
      {type === "success" ? (
        <CheckCircle size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      {message}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.7)",
          display: "flex",
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

/* ─── Stars ──────────────────────────────────────────────────────────────── */
function Stars({ rating, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            style={{
              color:
                s <= Math.round(rating) ? "#fbbf24" : "var(--glass-border)",
              fill: s <= Math.round(rating) ? "#fbbf24" : "transparent",
            }}
          />
        ))}
      </div>
      {count > 0 ? (
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
          {rating?.toFixed(1)} ({count})
        </span>
      ) : (
        <span
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            fontStyle: "italic",
          }}
        >
          لا تقييمات
        </span>
      )}
    </div>
  );
}

/* ─── Teacher Modal ──────────────────────────────────────────────────────── */
function TeacherModal({ teacher, onClose, onSaved }) {
  const isEdit = !!teacher;
  const [form, setForm] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
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
    if (!form.email.trim()) errs.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "البريد غير صحيح";
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
      if (isEdit)
        await api.patch(`/booking/teachers/${teacher.id}/update/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      else
        await api.post("/booking/teachers/create/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      onSaved(isEdit ? "✅ تم تحديث المدرس بنجاح" : "✅ تم إضافة المدرس بنجاح");
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") setErrors(data);
      else setErrors({ general: "حدث خطأ، حاول مرة أخرى" });
    } finally {
      setLoading(false);
    }
  };

  const ic = (f) => `gl-form-input${errors[f] ? " error" : ""}`;

  return (
    <div
      className="gl-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gl-modal">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 28px 18px",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {isEdit ? "تعديل بيانات المدرس" : "إضافة مدرس جديد"}
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginTop: 3,
              }}
            >
              {isEdit ? `تعديل: ${teacher.name}` : "أدخل بيانات المدرس الجديد"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="gl-btn-ghost"
            style={{
              width: 34,
              height: 34,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={15} color="var(--text-secondary)" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
          dir="rtl"
        >
          {errors.general && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "var(--danger-bg)",
                border: "1px solid var(--danger)",
                borderRadius: 12,
                color: "var(--danger)",
                fontSize: 13,
              }}
            >
              <AlertCircle size={15} />
              {errors.general}
            </div>
          )}

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <div
                className="teacher-avatar"
                style={{ width: 72, height: 72, borderRadius: 18 }}
              >
                {preview ? (
                  <img src={preview} alt="" />
                ) : (
                  <User size={28} color="var(--accent)" />
                )}
              </div>
            </div>
            <div>
              <div className="gl-label">الصورة الشخصية</div>
              <label
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                <Plus size={13} />
                {preview ? "تغيير الصورة" : "رفع صورة"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicture}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <div className="gl-label">
              اسم المدرس <span style={{ color: "var(--danger)" }}>*</span>
            </div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="مثال: أحمد محمد"
              className={ic("name")}
            />
            {errors.name && (
              <p style={{ fontSize: 11, color: "var(--danger)", marginTop: 4 }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="gl-label">
              البريد الإلكتروني{" "}
              <span style={{ color: "var(--danger)" }}>*</span>
            </div>
            <div style={{ position: "relative" }}>
              <Mail
                size={14}
                color="var(--text-secondary)"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                dir="ltr"
                className={ic("email")}
                style={{ paddingRight: 36 }}
              />
            </div>
            {errors.email && (
              <p style={{ fontSize: 11, color: "var(--danger)", marginTop: 4 }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <div className="gl-label">
              المادة <span style={{ color: "var(--danger)" }}>*</span>
            </div>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="مثال: English Grammar"
              className={ic("subject")}
            />
            {errors.subject && (
              <p style={{ fontSize: 11, color: "var(--danger)", marginTop: 4 }}>
                {errors.subject}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <div className="gl-label">
              سنوات الخبرة <span style={{ color: "var(--danger)" }}>*</span>
            </div>
            <input
              type="number"
              name="years_of_experience"
              value={form.years_of_experience}
              onChange={handleChange}
              placeholder="5"
              min="0"
              className={ic("years_of_experience")}
            />
            {errors.years_of_experience && (
              <p style={{ fontSize: 11, color: "var(--danger)", marginTop: 4 }}>
                {errors.years_of_experience}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="gl-label">نبذة مختصرة</div>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="اكتب نبذة عن المدرس..."
              rows={3}
              className="gl-form-input"
              style={{ resize: "none", lineHeight: 1.6 }}
            />
          </div>

          {/* Toggle */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <label className="gl-toggle">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((p) => ({ ...p, is_active: e.target.checked }))
                }
              />
              <div className="gl-toggle-track" />
              <div className="gl-toggle-thumb" />
            </label>
            <span
              style={{
                fontSize: 13.5,
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              المدرس نشط (يظهر للطلاب)
            </span>
          </label>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button
              type="submit"
              disabled={loading}
              className="gl-btn-primary"
              style={{ flex: 1, padding: "12px 0", justifyContent: "center" }}
            >
              {loading && (
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              {isEdit ? "حفظ التعديلات" : "إضافة المدرس"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="gl-btn-ghost"
              style={{ flex: 1, padding: "12px 0" }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Reviews Modal ──────────────────────────────────────────────────────── */
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
      className="gl-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gl-modal">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 28px 18px",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              تقييمات {teacher.name}
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginTop: 3,
              }}
            >
              {reviews.length} تقييم
            </p>
          </div>
          <button
            onClick={onClose}
            className="gl-btn-ghost"
            style={{
              width: 34,
              height: 34,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={15} color="var(--text-secondary)" />
          </button>
        </div>
        <div
          className="gl-scroll"
          style={{
            overflowY: "auto",
            maxHeight: 460,
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "48px 0",
              }}
            >
              <Loader2
                size={32}
                className="gl-spinner"
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "var(--text-secondary)",
              }}
            >
              <Star size={40} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
              <p style={{ fontWeight: 600 }}>لا توجد تقييمات بعد</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="review-card" dir="rtl">
                <div
                  className="teacher-avatar"
                  style={{ width: 36, height: 36, borderRadius: 10 }}
                >
                  <User size={15} color="var(--accent)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {r.student_name}
                    </span>
                    <Stars rating={r.rating} count={0} />
                  </div>
                  {r.comment && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        marginTop: 4,
                        lineHeight: 1.6,
                      }}
                    >
                      {r.comment}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      opacity: 0.5,
                      marginTop: 4,
                    }}
                  >
                    {new Date(r.created_at).toLocaleDateString("ar")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deleting === r.id}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {deleting === r.id ? (
                    <Loader2
                      size={13}
                      style={{
                        animation: "spin 1s linear infinite",
                        color: "var(--danger)",
                      }}
                    />
                  ) : (
                    <Trash2 size={13} color="var(--text-secondary)" />
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

/* ─── Delete Modal ───────────────────────────────────────────────────────── */
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
    <div className="gl-modal-overlay">
      <div className="gl-modal" style={{ maxWidth: 380 }}>
        <div style={{ padding: "32px 28px", textAlign: "center" }} dir="rtl">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "var(--danger-bg)",
              border: "1px solid var(--danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <Trash2 size={28} color="var(--danger)" />
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            حذف المدرس
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            هل أنت متأكد من حذف{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {teacher.name}
            </strong>
            ؟ لا يمكن التراجع.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px 0",
                background: "var(--danger)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading && (
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              نعم، احذف
            </button>
            <button
              onClick={onClose}
              className="gl-btn-ghost"
              style={{ flex: 1, padding: "12px 0" }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Teacher Card ───────────────────────────────────────────────────────── */
function TeacherCard({ teacher, onEdit, onDelete, onReviews }) {
  return (
    <div className="gl-card" style={{ overflow: "hidden" }}>
      <div style={{ padding: 20 }} dir="rtl">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div className="teacher-avatar">
              {teacher.profile_picture_url ? (
                <img src={teacher.profile_picture_url} alt={teacher.name} />
              ) : (
                <User size={24} color="var(--accent)" />
              )}
            </div>
            <div
              className={`status-dot ${
                teacher.is_active ? "active" : "inactive"
              }`}
              style={{ position: "absolute", bottom: -2, left: -2 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                }}
              >
                {teacher.name}
              </h3>
              <span
                className={`gl-badge ${
                  teacher.is_active ? "active" : "inactive"
                }`}
              >
                {teacher.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 5,
                color: "var(--accent)",
              }}
            >
              <BookOpen size={12} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                {teacher.subject}
              </span>
            </div>
            {teacher.email && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 4,
                  color: "var(--text-secondary)",
                }}
              >
                <Mail size={12} />
                <span style={{ fontSize: 11, direction: "ltr" }}>
                  {teacher.email}
                </span>
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <Stars
                rating={teacher.average_rating}
                count={teacher.reviews_count}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <div
            style={{
              flex: 1,
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              className="stat-icon-wrap"
              style={{ background: "rgba(79,124,255,0.1)" }}
            >
              <Clock size={14} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>
                خبرة
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {teacher.years_of_experience} سنة
              </p>
            </div>
          </div>
          <button
            onClick={() => onReviews(teacher)}
            style={{
              flexShrink: 0,
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              className="stat-icon-wrap"
              style={{ background: "rgba(251,191,36,0.12)" }}
            >
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>
                تقييمات
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {teacher.reviews_count}
              </p>
            </div>
          </button>
        </div>

        {teacher.bio && (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              marginTop: 12,
              lineHeight: 1.7,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {teacher.bio}
          </p>
        )}
      </div>
      <div className="card-actions">
        <button
          className="card-action-btn amber"
          onClick={() => onReviews(teacher)}
        >
          <Eye size={13} />
          التقييمات
        </button>
        <button
          className="card-action-btn indigo"
          onClick={() => onEdit(teacher)}
        >
          <Edit2 size={13} />
          تعديل
        </button>
        <button
          className="card-action-btn danger"
          onClick={() => onDelete(teacher)}
        >
          <Trash2 size={13} />
          حذف
        </button>
      </div>
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, iconBg, iconColor, valueColor }) {
  return (
    <div className="gl-stat">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div className="stat-icon-wrap" style={{ background: iconBg }}>
          <Icon size={15} color={iconColor} />
        </div>
        <span
          style={{
            fontSize: 11.5,
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: valueColor || "var(--text-primary)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function TeachersList() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [modal, setModal] = useState(null);
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
    showToast(msg);
    fetchTeachers();
  };
  const handleDeleted = (msg) => {
    setModal(null);
    setSelected(null);
    showToast(msg);
    fetchTeachers();
  };
  const open = (type, t = null) => {
    setSelected(t);
    setModal(type);
  };
  const close = () => {
    setModal(null);
    setSelected(null);
  };

  const filtered = teachers.filter((t) => {
    const ms =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const ma =
      filterActive === "all" ||
      (filterActive === "active" ? t.is_active : !t.is_active);
    return ms && ma;
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
    <div
      className="gl-page"
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
      dir="rtl"
    >
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h1 className="gl-page-title">إدارة المدرسين</h1>
          <p className="gl-page-subtitle">
            {stats.total} مدرس مسجل · {stats.active} نشط
          </p>
        </div>
        <button
          onClick={() => open("add")}
          className="gl-btn-primary"
          style={{ padding: "10px 20px" }}
        >
          <Plus size={15} />
          إضافة مدرس
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
        }}
      >
        <StatCard
          label="إجمالي المدرسين"
          value={stats.total}
          icon={User}
          iconBg="rgba(79,124,255,0.12)"
          iconColor="var(--accent)"
          valueColor="var(--accent)"
        />
        <StatCard
          label="المدرسون النشطون"
          value={stats.active}
          icon={CheckCircle}
          iconBg="rgba(52,211,153,0.12)"
          iconColor="#10b981"
          valueColor="#10b981"
        />
        <StatCard
          label="متوسط التقييم"
          value={stats.avgRating}
          icon={Star}
          iconBg="rgba(251,191,36,0.12)"
          iconColor="#f59e0b"
          valueColor="#f59e0b"
        />
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search
            size={15}
            color="var(--text-secondary)"
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="ابحث بالاسم أو المادة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gl-input"
            style={{
              width: "100%",
              padding: "10px 44px 10px 16px",
              fontSize: 13.5,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["all", "الكل"],
            ["active", "نشط"],
            ["inactive", "غير نشط"],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterActive(val)}
              className={`gl-filter-btn ${
                filterActive === val ? "active" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "80px 0",
            gap: 12,
          }}
        >
          <Loader2
            size={36}
            className="gl-spinner"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            جاري التحميل...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="gl-empty">
          <User size={52} className="gl-empty-icon" />
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            {search ? "لا توجد نتائج" : "لا يوجد مدرسون بعد"}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginBottom: 20,
            }}
          >
            {search ? "جرب البحث بكلمة أخرى" : "ابدأ بإضافة أول مدرس الآن"}
          </p>
          {!search && (
            <button
              onClick={() => open("add")}
              className="gl-btn-primary"
              style={{ padding: "10px 20px" }}
            >
              <Plus size={14} />
              إضافة مدرس
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 16,
          }}
        >
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

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
