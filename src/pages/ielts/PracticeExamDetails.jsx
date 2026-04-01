// src/pages/PracticeExamDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  FileText,
  BookOpen,
  Headphones,
  Mic,
  Edit,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function PracticeExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ielts/practice-exams/${examId}/`);
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error("فشل في تحميل تفاصيل الامتحان");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">لم يتم العثور على الامتحان</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              إدارة Practice Exam
            </h1>
          </div>
          <p className="text-gray-600">إضافة وإدارة أسئلة الامتحان</p>
        </div>
        <Link
          to="/dashboard/ielts/skills"
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </Link>
      </div>

      {/* Exam Info Card */}
      <div className="card">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 -m-6 mb-6 rounded-t-xl">
          <div className="flex items-center gap-4">
            <FileText className="w-12 h-12 text-white" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {exam.title}
              </h2>
              <p className="text-white/90">{exam.lesson_pack_title}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">
                إجمالي الأسئلة
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {exam.questions_count || 0}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">المدة</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {exam.time_limit || 30} د
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">
                نسبة النجاح
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {exam.passing_score || 70}%
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-primary-600" />
              <span className="text-xs font-bold text-gray-600">الحالة</span>
            </div>
            <p className="text-lg font-bold text-green-600">جاهز</p>
          </div>
        </div>
      </div>

      {/* Question Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vocabulary */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Vocabulary </h3>
              <p className="text-sm text-gray-600">أسئلة المفردات</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {exam.vocabulary_count || 0}
              </span>{" "}
              سؤال
            </div>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}/add/vocabulary`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          </div>
        </div>
        {/* Grammar */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Grammar</h3>
              <p className="text-sm text-gray-600">أسئلة القواعد</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {exam.grammar_count || 0}
              </span>{" "}
              سؤال
            </div>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}/add/grammar`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          </div>
        </div>

        {/* Reading */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Reading</h3>
              <p className="text-sm text-gray-600">فقرات القراءة والأسئلة</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {exam.reading_count || 0}
              </span>{" "}
              فقرة
            </div>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}/add/reading`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          </div>
        </div>

        {/* Listening */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Headphones className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Listening</h3>
              <p className="text-sm text-gray-600">
                التسجيلات الصوتية والأسئلة
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {exam.listening_count || 0}
              </span>{" "}
              تسجيل
            </div>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}/add/listening`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          </div>
        </div>

        {/* Speaking */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Mic className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Speaking</h3>
              <p className="text-sm text-gray-600">الفيديوهات ومهام التسجيل</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {exam.speaking_count || 0}
              </span>{" "}
              مهمة
            </div>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}/add/speaking`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          </div>
        </div>

        {/* Writing */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Edit className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Writing</h3>
              <p className="text-sm text-gray-600">أسئلة الكتابة</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {exam.writing_count || 0}
              </span>{" "}
              سؤال
            </div>
            <Link
              to={`/dashboard/ielts/practice-exams/${examId}/add/writing`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </Link>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="font-bold text-blue-900 mb-2">
              كيفية إضافة الأسئلة
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• اختر نوع السؤال المناسب من الأعلى</li>
              <li>
                • أسئلة Reading و Listening تحتاج إنشاء الفقرة/التسجيل أولاً
              </li>
              <li>• يمكن إضافة عدد غير محدود من الأسئلة لكل امتحان</li>
              <li>• تأكد من ضبط درجات الأسئلة بشكل صحيح</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
