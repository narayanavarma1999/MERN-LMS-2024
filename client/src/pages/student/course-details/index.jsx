import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentViewCourseDetailsService
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle, Star, Users, BookOpen, ArrowLeft, Zap, Award, ChevronDown, ChevronUp, Eye, Target, BookText } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [openAccordion, setOpenAccordion] = useState({
    description: true,
    curriculum: true,
    objectives: true
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);
    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "ra",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    const response = await createPaymentService(paymentPayload);
    if (response.success) {
      sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.orderId));
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  const toggleAccordion = (section) => {
    setOpenAccordion(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const freePreviewVideos = studentViewCourseDetails?.curriculum?.filter((item) => item.freePreview) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-100 border-b">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6 border border-blue-200">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Premium Course</span>
              </div>

              <h1 className="text-4xl text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                {studentViewCourseDetails?.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {studentViewCourseDetails?.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {studentViewCourseDetails?.instructorName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="font-semibold">{studentViewCourseDetails?.instructorName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border shadow-sm">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="font-semibold">{studentViewCourseDetails?.students?.length || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border shadow-sm">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Language</p>
                    <p className="font-semibold">{studentViewCourseDetails?.primaryLanguage}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <img
                  src={studentViewCourseDetails?.image}
                  alt={studentViewCourseDetails?.title}
                  className="relative w-96 h-72 object-cover rounded-2xl shadow-xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Objectives */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-blue-50 to-blue-100 cursor-pointer border-b"
                onClick={() => toggleAccordion('objectives')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-5 w-5 text-blue-600" />
                    What You'll Learn
                  </CardTitle>
                  {openAccordion.objectives ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {openAccordion.objectives && (
                <CardContent className="p-6">
                  <div className="grid gap-3">
                    {studentViewCourseDetails?.objectives?.split(",").map((objective, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{objective}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Course Description */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-purple-50 to-purple-100 cursor-pointer border-b"
                onClick={() => toggleAccordion('description')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BookText className="h-5 w-5 text-purple-600" />
                    Course Description
                  </CardTitle>
                  {openAccordion.description ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {openAccordion.description && (
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {studentViewCourseDetails?.description}
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Curriculum */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader
                className="bg-gradient-to-r from-orange-50 to-orange-100 cursor-pointer border-b"
                onClick={() => toggleAccordion('curriculum')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    Course Curriculum
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({studentViewCourseDetails?.curriculum?.length || 0} lessons)
                    </span>
                  </CardTitle>
                  {openAccordion.curriculum ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {openAccordion.curriculum && (
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {studentViewCourseDetails?.curriculum?.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${item?.freePreview
                          ? "cursor-pointer bg-blue-50 border-blue-200 hover:bg-blue-100 hover:shadow-md"
                          : "bg-gray-50 border-gray-200"
                          }`}
                        onClick={item?.freePreview ? () => handleSetFreePreview(item) : undefined}
                      >
                        <div className={`p-2 rounded-lg ${item?.freePreview ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                          }`}>
                          {item?.freePreview ? <PlayCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${item?.freePreview ? "text-gray-900" : "text-gray-600"}`}>
                            {item?.title}
                          </p>
                          {item?.freePreview && (
                            <span className="text-sm text-blue-600 font-medium">Free Preview</span>
                          )}
                        </div>
                        {item?.freePreview && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl rounded-2xl sticky top-8 overflow-hidden">
              <CardContent className="p-6">
                {/* Preview */}
                <div className="mb-6">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 mb-3 relative">
                    {studentViewCourseDetails?.curriculum?.find(item => item.freePreview) && (
                      <VideoPlayer
                        url={studentViewCourseDetails.curriculum.find(item => item.freePreview).videoUrl}
                        width="100%"
                        height="100%"

                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                      <span className="text-white text-sm font-medium">Free Preview</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">${studentViewCourseDetails?.pricing}</span>
                    <span className="text-sm text-gray-500 line-through">${(studentViewCourseDetails?.pricing * 1.5).toFixed(0)}</span>
                  </div>
                  <div className="text-green-600 font-medium flex items-center justify-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-current" />
                    <span>33% discount</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 rounded-lg bg-gray-50">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 rounded-lg bg-gray-50">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>Certificate included</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-2 rounded-lg bg-gray-50">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span>30-day guarantee</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleCreatePayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                  size="lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Enroll Now
                </Button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  30-Day Money-Back Guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showFreePreviewDialog} onOpenChange={setShowFreePreviewDialog}>
        <DialogContent className="max-w-4xl rounded-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <PlayCircle className="h-5 w-5 text-blue-600" />
              Course Preview
            </DialogTitle>
          </DialogHeader>

          <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
            <VideoPlayer url={displayCurrentVideoFreePreview} width="100%" height="100%" />
          </div>

          {freePreviewVideos.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">More Free Previews:</h4>
              <div className="space-y-2">
                {freePreviewVideos.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSetFreePreview(item)}
                    className="cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors border"
                  >
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-blue-600" />
                      {item?.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
