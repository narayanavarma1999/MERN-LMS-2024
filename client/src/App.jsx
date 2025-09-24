import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import RouteGuard from "./components/route-guard";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import AuthPage from "./pages/auth";
import InstructorDashboardpage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import NotFoundPage from "./pages/not-found";
import ShimmerUI from "./components/ui/shimmer";


const StudentHomePage = lazy(() => import("./pages/student/home"));
const StudentViewCoursesPage = lazy(() => import("./pages/student/courses"));
const StudentViewCourseDetailsPage = lazy(() => import("./pages/student/course-details"));
const StudentViewCourseProgressPage = lazy(() => import("./pages/student/course-progress"));
const PaypalPaymentReturnPage = lazy(() => import("./pages/student/payment-return"));
const StudentCoursesPage = lazy(() => import("./pages/student/student-courses"));
const Contact = lazy(() => import("./components/ui/contact"));

function App() {
  return (
    <Routes>
      {/* Other routes */}
      <Route path="/shimmer" element={<ShimmerUI />} />
      <Route path="/auth" element={<RouteGuard element={<AuthPage />} />} />
      <Route path="/instructor" element={<RouteGuard element={<InstructorDashboardpage />} />} />
      <Route path="/instructor/create-new-course" element={<RouteGuard element={<AddNewCoursePage />} />} />
      <Route path="/instructor/edit-course/:courseId" element={<RouteGuard element={<AddNewCoursePage />} />} />

      {/* Student routes */}
      <Route path="/" element={<RouteGuard element={<StudentViewCommonLayout />} />}>
        <Route
          index
          element={
            <Suspense fallback={<ShimmerUI />}>
              <StudentHomePage />
            </Suspense>
          }
        />
        <Route
          path="home"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <StudentHomePage />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <StudentViewCoursesPage />
            </Suspense>
          }
        />
        <Route
          path="course/details/:id"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <StudentViewCourseDetailsPage />
            </Suspense>
          }
        />
        <Route
          path="payment-return"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <PaypalPaymentReturnPage />
            </Suspense>
          }
        />
        <Route
          path="student-courses"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <StudentCoursesPage />
            </Suspense>
          }
        />
        <Route
          path="course-progress/:id"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <StudentViewCourseProgressPage />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<ShimmerUI />}>
              <Contact />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
