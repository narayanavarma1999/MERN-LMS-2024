import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Trophy,
  Star,
  Zap,
  BookOpen,
  Clock,
  Award,
  Lock,
  Sparkles,
  Rocket,
  Target
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  // Calculate progress percentage
  const progressPercentage = studentCurrentCourseProgress?.progress 
    ? Math.round((studentCurrentCourseProgress.progress.filter(p => p.viewed).length / 
                 studentCurrentCourseProgress.courseDetails?.curriculum?.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/10 to-pink-500/5 animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent" />
      
      {showConfetti && <Confetti numberOfPieces={200} gravity={0.2} />}
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white hover:text-white transition-all duration-300 hover:scale-105"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/10">
            <Target className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium">{progressPercentage}% Complete</span>
            <div className="w-20 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <Button 
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white transition-all duration-300 hover:scale-110"
          >
            {isSideBarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Video Player Area */}
        <div
          className={`flex-1 transition-all duration-500 ${
            isSideBarOpen ? "mr-96" : ""
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              <VideoPlayer
                width="100%"
                height="100%"
                url={currentLecture?.videoUrl}
                onProgressUpdate={setCurrentLecture}
                progressData={currentLecture}
              />
            </div>
            
            {/* Lecture Info Card */}
            <div className="p-6 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-t border-white/10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                      {currentLecture?.title || "Select a lecture to begin"}
                    </h2>
                    {currentLecture && (
                      <div className="flex items-center space-x-4 text-sm text-blue-200">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Lecture {studentCurrentCourseProgress?.courseDetails?.curriculum?.indexOf(currentLecture) + 1} of {studentCurrentCourseProgress?.courseDetails?.curriculum?.length}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4" />
                          <span>{(currentLecture.duration || "15:00")} min</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {currentLecture && (
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105">
                      <Check className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[88px] right-0 bottom-0 w-96 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-l border-white/10 transition-all duration-500 z-20 ${
            isSideBarOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            {/* Enhanced Tabs */}
            <TabsList className="grid w-full grid-cols-2 p-0 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg">
              <TabsTrigger
                value="content"
                className="text-white rounded-none h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 transition-all duration-300"
              >
                <Play className="h-4 w-4 mr-2" />
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-white rounded-none h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 transition-all duration-300"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Course Content Tab */}
            <TabsContent value="content" className="flex-1 overflow-hidden p-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Curriculum</h3>
                    <span className="text-sm text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                      {studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length || 0} / {studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0} completed
                    </span>
                  </div>
                  
                  {studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
                    (item, index) => {
                      const isCompleted = studentCurrentCourseProgress?.progress?.find(
                        (progressItem) => progressItem.lectureId === item._id
                      )?.viewed;
                      const isCurrent = currentLecture?._id === item._id;
                      
                      return (
                        <div
                          key={item._id}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer group hover:scale-105 ${
                            isCurrent 
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg' 
                              : isCompleted 
                                ? 'bg-green-500/10 border-green-400/30' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => setCurrentLecture(item)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-green-500/20 text-green-400' 
                                : isCurrent
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-white/10 text-white/60'
                            }`}>
                              {isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium truncate ${
                                  isCurrent ? 'text-blue-300' : 'text-white'
                                }`}>
                                  {item.title}
                                </span>
                                {isCurrent && (
                                  <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-white/60 mt-1">
                                <span>Lecture {index + 1}</span>
                                <span>•</span>
                                <span>{item.duration || "15:00"} min</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 overflow-hidden p-0 m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Course Overview</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Description
                      </h4>
                      <p className="text-white/80 leading-relaxed">
                        {studentCurrentCourseProgress?.courseDetails?.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0}
                        </div>
                        <div className="text-sm text-white/60">Total Lectures</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round((studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0) * 15 / 60)}h
                        </div>
                        <div className="text-sm text-white/60">Estimated Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lock Course Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 shadow-2xl max-w-md rounded-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-red-400" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Course Locked
            </DialogTitle>
            <DialogDescription className="text-white/80 text-center">
              This course requires purchase to access the content. Please complete the purchase to continue learning.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate("/student-courses")}
            >
              Back to Courses
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
              Purchase Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Complete Dialog */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 shadow-2xl max-w-lg rounded-2xl text-center">
          <DialogHeader>
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Congratulations! 🎉
            </DialogTitle>
            <DialogDescription className="text-white/80 text-lg">
              You've successfully completed the course!
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-4">
            <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-white/70">You're among the top learners!</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate("/student-courses")}
            >
              My Courses
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
              onClick={handleRewatchCourse}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Rewatch Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;