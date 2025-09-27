import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
  updateCourseByIdService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef, useState } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    courseId, // Now this comes from context
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        setUploadingIndex(currentIndex);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
            duration: response?.data?.duration
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
          setUploadingIndex(null);

          // Update database after successful upload
          await updateDatabaseCurriculum(cpyCourseCurriculumFormData);
        }
      } catch (error) {
        console.log(error);
        setMediaUploadProgress(false);
        setUploadingIndex(null);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    if (!courseId) {
      console.error("Course ID is required for updating curriculum");
      return;
    }

    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

    // Only delete from Cloudinary if public_id exists
    if (getCurrentVideoPublicId) {
      try {
        const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId);

        if (!deleteCurrentMediaResponse?.success) {
          console.error("Failed to delete video from Cloudinary");
          return;
        }
      } catch (error) {
        console.error("Error deleting video from Cloudinary:", error);
        return;
      }
    }

    // Reset the video data for this lecture
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      videoUrl: "",
      public_id: "",
      duration: ""
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);

    // Update the database
    await updateDatabaseCurriculum(cpyCourseCurriculumFormData);
  }

  // Helper function to update database curriculum
  async function updateDatabaseCurriculum(updatedCurriculum) {
    if (!courseId) {
      console.error("Course ID is required for updating curriculum");
      return;
    }

    try {
      const response = await updateCourseByIdService(courseId, {
        curriculum: updatedCurriculum
      });

      if (response.success) {
        console.log("Curriculum updated successfully in database");
      } else {
        console.error("Failed to update curriculum in database");
      }
    } catch (error) {
      console.error("Error updating curriculum in database:", error);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)}`,
            freePreview: false,
            duration: item?.duration || ""
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);

        // Update database after bulk upload
        await updateDatabaseCurriculum(cpyCourseCurriculumFormdata);
      }
    } catch (e) {
      console.log(e);
      setMediaUploadProgress(false);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    if (!courseId) {
      console.error("Course ID is required for deleting lecture");
      return;
    }

    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

    // Delete from Cloudinary if public_id exists
    if (getCurrentSelectedVideoPublicId) {
      try {
        const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

        if (!response?.success) {
          console.error("Failed to delete video from Cloudinary");
          return;
        }
      } catch (error) {
        console.error("Error deleting video from Cloudinary:", error);
        return;
      }
    }

    // Remove lecture from curriculum
    cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
      (_, index) => index !== currentIndex
    );

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);

    // Update database after deletion
    await updateDatabaseCurriculum(cpyCourseCurriculumFormData);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3 items-start">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleReplaceVideo(index)}
                        disabled={uploadingIndex === index}
                      >
                        {uploadingIndex === index ? "Uploading..." : "Replace Video"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        variant="destructive"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) => handleSingleLectureUpload(event, index)}
                      className="mb-4"
                      disabled={uploadingIndex === index}
                    />
                    {uploadingIndex === index && (
                      <p className="text-sm text-blue-600">Uploading video...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;