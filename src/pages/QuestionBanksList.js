import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Database,
  Search,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useQuestionBanksStore } from "../store/questionbanksstore";

export default function QuestionBanksList() {
  const { banks, fetchBanks, deleteBank, loading, error } =
    useQuestionBanksStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const filteredBanks = banks?.filter(
    (bank) =>
      bank.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (bankId) => {
    setDeleting(true);
    try {
      await deleteBank(bankId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !banks) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">بنوك الأسئلة</h1>
          <p className="text-gray-600 mt-1">إدارة جميع بنوك الأسئلة المتاحة</p>
        </div>
        <Link
          to="/dashboard/question-banks/create"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إنشاء بنك جديد
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن بنك أسئلة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pr-10"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Banks List */}
      {filteredBanks?.length === 0 ? (
        <div className="card text-center py-12">
          <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "لا توجد نتائج للبحث"
              : "لا توجد بنوك أسئلة حتى الآن"}
          </p>
          {!searchQuery && (
            <Link
              to="/dashboard/question-banks/create"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إنشاء أول بنك أسئلة
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBanks?.map((bank) => (
            <div
              key={bank.id}
              className="card hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{bank.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(bank.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>
                {bank.is_ready ? (
                  <span className="badge badge-success flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    جاهز
                  </span>
                ) : (
                  <span className="badge badge-warning flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    قيد الإنشاء
                  </span>
                )}
              </div>

              {/* Description */}
              {bank.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {bank.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {bank.total_questions}
                  </p>
                  <p className="text-xs text-gray-500">إجمالي الأسئلة</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {bank.vocabulary_count}
                  </p>
                  <p className="text-xs text-gray-500">مفردات</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {bank.grammar_count}
                  </p>
                  <p className="text-xs text-gray-500">قواعد</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/question-banks/${bank.id}`}
                  className="flex-1 btn bg-primary-600 text-white hover:bg-primary-700 text-sm py-2 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  عرض
                </Link>
                <Link
                  to={`/dashboard/question-banks/${bank.id}/edit`}
                  className="flex-1 btn btn-secondary text-sm py-2 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </Link>
                <button
                  onClick={() => setDeleteConfirm(bank.id)}
                  className="btn bg-red-600 text-white hover:bg-red-700 text-sm py-2 px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">تأكيد الحذف</h3>
                <p className="text-sm text-gray-600">
                  هل أنت متأكد من حذف هذا البنك؟
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              سيتم حذف جميع الأسئلة المرتبطة بهذا البنك بشكل نهائي. لا يمكن
              التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 btn btn-danger disabled:opacity-50"
              >
                {deleting ? "جاري الحذف..." : "نعم، احذف"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 btn btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
