import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import {
  PlayCircle,
  Clock,
  BookOpen,
  Star, Award, ArrowRight
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    try {
      setLoading(true);
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
      if (response?.success) {
        setStudentBoughtCoursesList(response?.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-500 to-emerald-600';
    if (progress >= 50) return 'from-blue-500 to-cyan-600';
    if (progress >= 25) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getDifficultyColor = (level) => {
    const levelLower = level?.toLowerCase();
    if (levelLower === 'advanced') return 'from-red-500 to-pink-600';
    if (levelLower === 'intermediate') return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-teal-600';
  };

  const CourseCard = ({ course }) => {
    const progress = course?.progress || 0;
    const gradientColors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600"
    ];

    const randomGradient = gradientColors[Math.floor(Math.random() * gradientColors.length)];

    return (
      <Card
        className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-3xl overflow-hidden"
        onClick={() => navigate(`/course-progress/${course?.courseId}`)}
      >
        {/* Course Header with Image and Overlay */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course?.courseImage}
            alt={course?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${randomGradient} opacity-80 mix-blend-multiply`} />

          {/* Progress Badge */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getProgressColor(progress)} shadow-lg`}>
              {progress ? progress : 0}% Complete
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getDifficultyColor(course?.level)} shadow-lg`}>
              {course?.level || 'Beginner'}
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Course Title and Instructor */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course?.title}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {course?.instructorName?.charAt(0) || 'I'}
              </div>
              <span className="text-sm text-gray-600 font-medium">{course?.instructorName}</span>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-blue-50 rounded-xl">
              <BookOpen className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-gray-900">{course?.lessonsCount || 12}</span>
              <p className="text-[10px] text-gray-500">Lessons</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-xl">
              <Clock className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-gray-900">{course?.duration || '8h'}</span>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-xl">
              <Star className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-gray-900">{course?.rating || 4.8}</span>
              <p className="text-[10px] text-gray-500">Rating</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Your progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/course-progress/${course?.courseId}`);
            }}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {progress === 0 ? 'Start Learning' : progress === 100 ? 'Review Course' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg rounded-3xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
      {/* Enhanced Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 mb-6 shadow-lg">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">My Learning Journey</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Courses
          </h1>
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ?
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Continue your learning adventure. Pick up where you left off and achieve your goals.
            </p> : ""}

          {/* Stats Overview */}
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">{studentBoughtCoursesList.length}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round(studentBoughtCoursesList.reduce((acc, course) => acc + (course.progress || 0), 0) / studentBoughtCoursesList.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Progress</div>
              </div>
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {studentBoughtCoursesList.filter(course => course.progress === 100).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {studentBoughtCoursesList.filter(course => course.progress === 0).length}
                </div>
                <div className="text-sm text-gray-600">New</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {studentBoughtCoursesList.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-600 mb-4">No Courses Enrolled Yet</h2>
              <p className="text-gray-500 text-lg mb-8">
                Start your learning journey by enrolling in your first course!
              </p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/courses')}
              >
                Browse Courses
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;