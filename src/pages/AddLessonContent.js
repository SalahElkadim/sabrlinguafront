import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import AddReadingContent from "./Addreadingcontent";
import AddListeningContent from "./Addlisteningcontent";
import AddSpeakingContent from "./Addspeakingcontent";
import AddWritingContent from "./Addwritingcontent";

export default function AddLessonContent() {
  const { lessonId } = useParams();
  const [lessonType, setLessonType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLessonType();
  }, [lessonId]);

  const fetchLessonType = async () => {
    try {
      const response = await fetch(
        `https://sabrlinguaa-production.up.railway.app/levels/lessons/${lessonId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("فشل تحميل بيانات الدرس");

      const data = await response.json();
      setLessonType(data.lesson_type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // أثناء التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // في حالة حدوث خطأ
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Navigate to={`/dashboard/lessons/${lessonId}`} replace />
        </div>
      </div>
    );
  }

  // ✅ توجيه تلقائي حسب نوع الدرس
  switch (lessonType) {
    case "READING":
      return <AddReadingContent />;
    case "LISTENING":
      return <AddListeningContent />;
    case "SPEAKING":
      return <AddSpeakingContent />;
    case "WRITING":
      return <AddWritingContent />;
    default:
      return <Navigate to={`/dashboard/lessons/${lessonId}`} replace />;
  }
}
