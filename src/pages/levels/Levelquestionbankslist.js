// src/pages/LevelQuestionBanksList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  ChevronRight,
  Loader2,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { levelQuestionBanksAPI } from "../services/levelsService";

export default function LevelQuestionBanksList() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, unit, level

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await levelQuestionBanksAPI.getAll();
      setBanks(response.banks || []);
    } catch (err) {
      setError(err.response?.data?.error || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const filteredBanks = banks.filter((bank) => {
    // Search filter
    const matchesSearch =
      bank.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType =
      filterType === "all" ||
      (filterType === "unit" && bank.unit) ||
      (filterType === "level" && bank.level);

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchBanks} className="btn btn-primary">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const levelColors = {
    A1: "bg-green-100 text-green-700",
    A2: "bg-blue-100 text-blue-700",
    B1: "bg-purple-100 text-purple-700",
    B2: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          بنوك أسئلة المستويات
        </h1>
        <p className="text-gray-600">
          إدارة بنوك الأسئلة للوحدات والمستويات التعليمية
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في البنوك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input pr-10"
            >
              <option value="all">جميع البنوك</option>
              <option value="unit">بنوك الوحدات</option>
              <option value="level">بنوك المستويات</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي البنوك</p>
              <p className="text-2xl font-bold text-gray-900">{banks.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">بنوك الوحدات</p>
              <p className="text-2xl font-bold text-gray-900">
                {banks.filter((b) => b.unit).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">بنوك المستويات</p>
              <p className="text-2xl font-bold text-gray-900">
                {banks.filter((b) => b.level).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banks List */}
      <div className="card">
        {filteredBanks.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">لا توجد بنوك</p>
            <p className="text-sm text-gray-500">
              {searchTerm || filterType !== "all"
                ? "جرب البحث بكلمات مختلفة"
                : "سيتم إنشاء البنوك تلقائياً عند إنشاء الوحدات/المستويات"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBanks.map((bank) => (
              <Link
                key={bank.id}
                to={`/dashboard/level-question-banks/${bank.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
                          {bank.title}
                        </h3>
                        {bank.level_code && (
                          <span
                            className={`px-2 py-1 text-xs rounded font-bold ${
                              levelColors[bank.level_code]
                            }`}
                          >
                            {bank.level_code}
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            bank.unit
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {bank.unit ? "بنك وحدة" : "بنك مستوى"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {bank.unit_title || bank.level_code || bank.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        إجمالي الأسئلة: {bank.total_questions || 0}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
