// src/pages/STEPProgress.jsx
import { useState, useEffect } from "react";
import {
  BarChart2,
  TrendingUp,
  BookOpen,
  Volume2,
  PenTool,
  FileText,
} from "lucide-react";
import { stepProgressAPI } from "../services/stepService";

const skillTypeConfig = {
  VOCABULARY: {
    label: "Vocabulary",
    icon: Volume2,
    color: "text-blue-600",
    bar: "bg-blue-500",
  },
  GRAMMAR: {
    label: "Grammar",
    icon: PenTool,
    color: "text-purple-600",
    bar: "bg-purple-500",
  },
  READING: {
    label: "Reading",
    icon: BookOpen,
    color: "text-orange-600",
    bar: "bg-orange-500",
  },
  WRITING: {
    label: "Writing",
    icon: FileText,
    color: "text-green-600",
    bar: "bg-green-500",
  },
};

export default function STEPProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stepProgressAPI
      .getMyProgress()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const summary = data?.summary || {};
  const skillsProgress = data?.skills_progress || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">تقدمي في STEP</h1>
        <p className="text-gray-500 text-sm mt-1">
          متابعة تقدمك في جميع مهارات STEP
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <BarChart2 className="w-7 h-7 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {summary.total_score ?? 0}
          </p>
          <p className="text-xs text-gray-500">إجمالي النقاط</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-7 h-7 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {summary.overall_progress_percentage ?? 0}%
          </p>
          <p className="text-xs text-gray-500">نسبة التقدم</p>
        </div>
        <div className="card text-center">
          <BookOpen className="w-7 h-7 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {summary.total_viewed_questions ?? 0}
          </p>
          <p className="text-xs text-gray-500">أسئلة تم فتحها</p>
        </div>
        <div className="card text-center">
          <FileText className="w-7 h-7 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {summary.total_available_questions ?? 0}
          </p>
          <p className="text-xs text-gray-500">إجمالي الأسئلة</p>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          التقدم حسب المهارة
        </h2>
        {skillsProgress.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            لم تبدأ بعد. ابدأ بفتح الأسئلة!
          </p>
        ) : (
          <div className="space-y-5">
            {skillsProgress.map((prog) => {
              const config = skillTypeConfig[prog.skill_type] || {};
              const Icon = config.icon || BookOpen;
              const pct = prog.progress_percentage || 0;
              return (
                <div key={prog.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="font-medium text-gray-800 text-sm">
                        {prog.skill_title}
                      </span>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {prog.viewed_questions_count} / {prog.total_questions}{" "}
                      سؤال
                      <span className={`ml-2 font-bold ${config.color}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${config.bar} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    النقاط: {prog.total_score}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
