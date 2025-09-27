import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { setProgress } from "@/lib/appstore/progress-slice";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import {
  Check,
  ChevronLeft,
  ChevronRight, Video,
  Clock, ChevronDown,
  ChevronUp
} from "lucide-react";
import { useContext, useEffect, useState, useCallback } from "react";
import Confetti from "react-confetti";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();

  // Memoize curriculumSections to prevent recreation on every render
  const curriculumSections = [
    {
      title: "Introduction",
      lectures: studentCurrentCourseProgress?.courseDetails?.curriculum?.slice(0, 3) || []
    },
    {
      title: "Core Concepts",
      lectures: studentCurrentCourseProgress?.courseDetails?.curriculum?.slice(3, 8) || []
    },
    {
      title: "Advanced Topics",
      lectures: studentCurrentCourseProgress?.courseDetails?.curriculum?.slice(8, 15) || []
    },
    {
      title: "Practice & Projects",
      lectures: studentCurrentCourseProgress?.courseDetails?.curriculum?.slice(15) || []
    }
  ].filter(section => section.lectures.length > 0);

  // Memoize fetch function to prevent infinite loops
  const fetchCurrentCourseProgress = useCallback(async () => {
    if (!auth?.user?._id || !id) return;

    try {
      setIsLoading(true);
      const response = await getCurrentCourseProgressService(auth.user._id, id);
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

          // Set current lecture logic
          if (response?.data?.progress?.length === 0) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          } else {
            const lastViewedIndex = response?.data?.progress.findLastIndex
              ? response.data.progress.findLastIndex(p => p.viewed)
              : response.data.progress.reduceRight((acc, p, idx) => acc === -1 && p.viewed ? idx : acc, -1);

            const nextLectureIndex = lastViewedIndex !== -1 ? lastViewedIndex + 1 : 0;

            setCurrentLecture(
              response?.data?.courseDetails?.curriculum[nextLectureIndex] ||
              response?.data?.courseDetails?.curriculum[0]
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth?.user?._id, id, setStudentCurrentCourseProgress]);

  // Memoize update function
  const updateCourseProgress = useCallback(async () => {
    if (!currentLecture || !auth?.user?._id || !studentCurrentCourseProgress?.courseDetails?._id) return;

    try {
      const response = await markLectureAsViewedService(
        auth.user._id,
        studentCurrentCourseProgress.courseDetails._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }, [currentLecture, auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id, fetchCurrentCourseProgress]);

  // Memoize toggle function
  const toggleLectureCompletion = useCallback(async (lecture, isCurrentlyCompleted) => {
    if (!auth?.user?._id || !studentCurrentCourseProgress?.courseDetails?._id) return;

    try {
      if (isCurrentlyCompleted) {
        // For now, just refetch - implement proper unmark if backend supports it
        fetchCurrentCourseProgress();
      } else {
        const response = await markLectureAsViewedService(
          auth.user._id,
          studentCurrentCourseProgress.courseDetails._id,
          lecture._id
        );

        if (response?.success) {
          await fetchCurrentCourseProgress();

          // Move to next lecture if this was the current one
          if (currentLecture?._id === lecture._id) {
            const currentIndex = studentCurrentCourseProgress?.courseDetails?.curriculum?.findIndex(
              l => l._id === lecture._id
            );
            if (currentIndex !== -1 && currentIndex + 1 < studentCurrentCourseProgress?.courseDetails?.curriculum?.length) {
              setCurrentLecture(studentCurrentCourseProgress.courseDetails.curriculum[currentIndex + 1]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error toggling lecture completion:", error);
    }
  }, [auth?.user?._id, studentCurrentCourseProgress, currentLecture, fetchCurrentCourseProgress]);

  const toggleSection = useCallback((sectionIndex) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionIndex)) {
        newExpanded.delete(sectionIndex);
      } else {
        newExpanded.add(sectionIndex);
      }
      return newExpanded;
    });
  }, []);

  const handleRewatchCourse = useCallback(async () => {
    if (!auth?.user?._id || !studentCurrentCourseProgress?.courseDetails?._id) return;

    try {
      const response = await resetCourseProgressService(
        auth.user._id,
        studentCurrentCourseProgress.courseDetails._id
      );

      if (response?.success) {
        setCurrentLecture(null);
        setShowConfetti(false);
        setShowCourseCompleteDialog(false);
        fetchCurrentCourseProgress();
      }
    } catch (error) {
      console.error("Error resetting course:", error);
    }
  }, [auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id, fetchCurrentCourseProgress]);

  // Initial fetch - only on mount
  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [fetchCurrentCourseProgress]); // Now this is stable

  // Auto-mark as completed when video reaches 100%
  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLecture?.progressValue, updateCourseProgress]); // Only depend on specific values

  // Confetti timeout
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Auto-expand section with current lecture - fixed dependencies
  useEffect(() => {
    if (currentLecture && curriculumSections.length > 0) {
      setExpandedSections(prev => {
        const newExpanded = new Set(prev);
        curriculumSections.forEach((section, index) => {
          if (section.lectures.some(lecture => lecture._id === currentLecture._id)) {
            newExpanded.add(index);
          }
        });
        return newExpanded;
      });
    }
  }, [currentLecture?._id, curriculumSections.length]);

  const progressPercentage = studentCurrentCourseProgress?.progress && studentCurrentCourseProgress.courseDetails?.curriculum
    ? Math.round(
      (studentCurrentCourseProgress.progress.filter(p => p.viewed).length /
        studentCurrentCourseProgress.courseDetails.curriculum.length) * 100
    )
    : 0;

  dispatch(setProgress(progressPercentage))

  const completedLectures = studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length || 0;
  const totalLectures = studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0;

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return "15:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white text-lg">Loading course content...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Your Background Style */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(100,100,100,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      {showConfetti && <Confetti numberOfPieces={200} gravity={0.2} />}

      {/* Minimal Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-slate-800/90 border-b border-slate-700">
        <Button
          onClick={() => navigate("/student-courses")}
          className="flex items-center space-x-2 text-white hover:text-gray-100 bg-slate-700 hover:bg-slate-600"
          variant="ghost"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-medium font-small">Back to Courses</span>
        </Button>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            {completedLectures} of {totalLectures} lessons
          </div>
          <Button
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md border border-slate-600"
          >
            {isSideBarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - NamasteDev Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Video Player - Properly Aligned */}
        <div className={`transition-all duration-300 bg-black ${isSideBarOpen ? "flex-1" : "w-full"}`}>
          {currentLecture ? (
            <VideoPlayer
              width="100%"
              height="100%"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
              duration={currentLecture?.duration}
              title={studentCurrentCourseProgress?.courseDetails?.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to begin
            </div>
          )}
        </div>

        {/* NamasteDev Sidebar */}
        {isSideBarOpen && (
          <div className="w-full lg:w-[30%] bg-slate-800 border-l border-slate-700 flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="border-b border-slate-700 bg-slate-800 flex-shrink-0">
              <div className="p-4 flex justify-between items-center">
                <div className="font-semibold text-lg text-white">
                  {studentCurrentCourseProgress?.courseDetails?.title}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4 pb-4">
                <div className="mb-2">
                  <div className="w-full h-3 bg-slate-600 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{completedLectures} of {totalLectures} lessons</span>
                  <span className="font-semibold text-green-400">{progressPercentage ? progressPercentage : 0}% complete</span>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-slate-700">
                {curriculumSections.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.has(sectionIndex);

                  return (
                    <div key={sectionIndex} className="bg-slate-800">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="flex flex-1 items-center justify-between font-medium transition-all p-4 bg-slate-800 text-white w-full text-left hover:bg-slate-700"
                      >
                        <div className="font-bold text-white">{section.title}</div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </button>

                      {/* Section Lectures */}
                      {isExpanded && (
                        <div className="bg-slate-800">
                          {section.lectures.map((lecture) => {
                            const isCompleted = studentCurrentCourseProgress?.progress?.find(
                              p => p.lectureId === lecture._id
                            )?.viewed;
                            const isCurrent = currentLecture?._id === lecture._id;

                            return (
                              <div
                                key={lecture._id}
                                className={`cursor-pointer relative border-t border-slate-700 w-full grid grid-cols-12 items-center transition-colors ${isCurrent ? 'bg-blue-500/20' : 'bg-slate-800 hover:bg-slate-700'
                                  }`}
                                onClick={() => setCurrentLecture(lecture)}
                              >
                                <div className="flex min-h-[4.5rem] col-span-10 pl-4 pt-2 pb-2">
                                  <div className="mr-2 font-bold text-xl">
                                    <Video className="h-5 w-5 text-gray-300" />
                                  </div>
                                  <div className="w-full">
                                    <div className="text-base flex flex-col">
                                      <div className="font-bold text-white">
                                        {lecture.title}
                                      </div>
                                      <div className="flex justify-between items-center mt-2">
                                        <div className="flex gap-x-3 items-center">
                                          <div className="flex gap-x-1 items-center text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            <p className="text-xs">{formatDuration(lecture.duration)}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Checkbox with toggle functionality */}
                                <div
                                  className="col-span-2 flex justify-center items-center ml-2 lg:ml-4"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => toggleLectureCompletion(lecture, isCompleted)}
                                    className={`h-5 w-5 border rounded flex items-center justify-center transition-all ${isCompleted
                                      ? 'bg-green-500 border-green-500'
                                      : 'border-gray-400 bg-slate-700 hover:bg-slate-600'
                                      }`}
                                  >
                                    {isCompleted && <Check className="h-4 w-4 text-white" />}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentViewCourseProgressPage;