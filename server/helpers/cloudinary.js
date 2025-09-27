const cloudinary = require("cloudinary").v2;
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static'); // Add this

// Set ffprobe path to fix the error
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobeStatic.path);

// Configure with env data
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (filePath, resourceType = "video") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: "videos",
      use_filename: true, 
      unique_filename: false,
      overwrite: true
    });

    console.log('Upload successful:', result.public_id);

    if (resourceType === "video" || resourceType === "auto") {
      try {
        const duration = Math.floor(await getVideoDuration(filePath));
        result.duration = formatDuration(duration);
        result.duration_seconds = duration;
        console.log('Video duration extracted:', result.duration);
      } catch (durationError) {
        console.warn('Could not extract video duration:', durationError.message);
        result.duration = "0:00";
        result.duration_seconds = 0;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error("Error uploading to cloudinary: " + error.message);
  }
};

const deleteMediaFromCloudinary = async (publicId, resourceType = "video") => {
  console.log(`Deleting from Cloudinary - publicId:${publicId}, resourceType:${resourceType}`);
  
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true 
    });
    
    console.log('Cloudinary delete result:', result);
    
    if (result.result === 'ok') {
      console.log('Successfully deleted from Cloudinary');
      return result;
    } else if (result.result === 'not found') {
      console.log('Asset not found in Cloudinary, might be already deleted');
      return result;
    } else {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete asset from cloudinary: ${error.message}`);
  }
};


const deleteMediaCompletely = async (publicId) => {
  try {
    
    const videoResult = await deleteMediaFromCloudinary(publicId, "video");
    try {
      await deleteMediaFromCloudinary(publicId, "image");
    } catch (imageError) {
      console.log('No image version found or already deleted');
    }
    
    return videoResult;
  } catch (error) {
    throw error;
  }
};

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}

module.exports = { 
  uploadMediaToCloudinary, 
  deleteMediaFromCloudinary,
  deleteMediaCompletely
};