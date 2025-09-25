import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Star, BookOpen, PlayCircle, Users, Clock, ArrowRight, Zap, CheckCircle } from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [loadingEnrollment, setLoadingEnrollment] = useState({});

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  async function checkEnrollmentStatus(courseId) {
    if (!auth?.user?._id) return false;

    setLoadingEnrollment(prev => ({ ...prev, [courseId]: true }));

    try {
      const response = await checkCoursePurchaseInfoService(courseId, auth.user._id);
      setEnrollmentStatus(prev => ({
        ...prev,
        [courseId]: response.success && response.data
      }));
      return response.success && response.data;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setEnrollmentStatus(prev => ({ ...prev, [courseId]: false }));
      return false;
    } finally {
      setLoadingEnrollment(prev => ({ ...prev, [courseId]: false }));
    }
  }

  // Check enrollment status for all courses when component loads or auth changes
  useEffect(() => {
    if (studentViewCoursesList && auth?.user?._id) {
      studentViewCoursesList.forEach(course => {
        checkEnrollmentStatus(course._id);
      });
    }
  }, [studentViewCoursesList, auth]);

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  const CourseCard = ({ course }) => {
    const isEnrolled = enrollmentStatus[course._id];
    const isLoading = loadingEnrollment[course._id];

    return (
      <div
        onClick={() => handleCourseNavigate(course?._id)}
        className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
      >
        {/* Course Image */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={course?.image}
            alt={course?.title}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Course+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


          {/* Bestseller Badge */}
          {course?.bestseller && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
              Bestseller
            </div>
          )}

        </div>

        {/* Course Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title and Instructor */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {course?.title}
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {course?.instructorName?.charAt(0) || "I"}
              </div>
              <span className="text-sm font-medium text-gray-700">{course?.instructorName}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="text-xs font-semibold text-gray-700">{course?.rating || 4.8}</span>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <PlayCircle className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-xs font-semibold text-gray-700 block">{course?.curriculum?.length || 12}</span>
              <span className="text-[10px] text-gray-500">Lessons</span>
            </div>
            <div className="text-center">
              <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <span className="text-xs font-semibold text-gray-700 block">{course?.duration || '12h'}</span>
              <span className="text-[10px] text-gray-500">Duration</span>
            </div>
            <div className="text-center">
              <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <span className="text-xs font-semibold text-gray-700 block">{course?.level || '2.1k'}</span>
              <span className="text-[10px] text-gray-500">Level</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                {!isEnrolled ? (
                  <>
                    <span className="text-xl font-bold text-gray-900">
                      ${course?.pricing || 49.99}
                    </span>
                    {course?.originalPrice && course.originalPrice > course.pricing && (
                      <span className="text-sm text-gray-500 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </>
                ) : ""}
              </div>

              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseNavigate(course._id);
                }}
                disabled={isLoading}
                className={`rounded-lg px-4 py-1 text-xs font-semibold transition-all duration-200 ${isEnrolled
                  ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isEnrolled ? (
                  "Continue Learning"
                ) : (
                  <>
                    Enroll Now
                  </>
                )}
              </Button>
            </div>

            {/* Discount Badge - Only show if not enrolled */}
            {!isEnrolled && course?.originalPrice && course.originalPrice > course.pricing && (
              <div className="mt-2 text-right">
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                  Save {Math.round(((course.originalPrice - course.pricing) / course.originalPrice) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6"][i % 4],
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 3}s`
            }}
          />
        ))}
      </div>

      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that gets you there</h1>
          <p className="text-xl">
            Skills for your present and your future. Get Started with US
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-12 px-4 lg:px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Course Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                className="justify-start h-16 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                {categoryItem.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="relative py-16 lg:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Courses</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked by experts to accelerate your learning journey and career growth
            </p>
          </div>

          {/* Enhanced Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <CourseCard key={courseItem._id || courseItem.id} course={courseItem} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-lg p-8 border border-gray-200 max-w-md mx-auto shadow-lg">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">
                    Courses Coming Soon
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    We're working on bringing you amazing courses
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                    onClick={() => navigate("/courses")}
                  >
                    Browse All Courses
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* View More Button */}
          {studentViewCoursesList && studentViewCoursesList.length > 0 && (
            <div className="text-center mt-12">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/courses")}
              >
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;