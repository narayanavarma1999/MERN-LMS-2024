import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  Volume1,
  VolumeX,
  Settings,
  Info,
  X,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  title = "Premium Content",
}) {

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);


  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("Auto");
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(80); // 0-100 scale for display
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const bufferingTimeoutRef = useRef(null);
  const volumeIndicatorTimeoutRef = useRef(null);

  const qualityOptions = ["Auto", "4K", "1080p", "720p", "480p", "360p"];
  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  const handlePlayAndPause = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const handleProgress = useCallback((state) => {
    if (!seeking) {
      setPlayed(state.played);
      setBufferProgress(state.loaded);
    }

    if (state.playedSeconds > 0 && state.loadedSeconds - state.playedSeconds < 5) {
      setIsBuffering(true);
      clearTimeout(bufferingTimeoutRef.current);
      bufferingTimeoutRef.current = setTimeout(() => setIsBuffering(false), 1000);
    }
  }, [seeking]);

  const handleBuffer = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleBufferEnd = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleRewind = useCallback(() => {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() - 10);
  }, []);

  const handleForward = useCallback(() => {
    playerRef?.current?.seekTo(playerRef?.current?.getCurrentTime() + 10);
  }, []);

  const handleSeekChange = useCallback((newValue) => {
    setPlayed(newValue[0]);
    setSeeking(true);
  }, []);

  const handleSeekMouseUp = useCallback(() => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }, [played]);

  const handleVolumeChange = useCallback((newValue) => {
    const newVolume = newValue[0] / 100;
    setVolume(newVolume);
    setVolumeLevel(newValue[0]);
    setMuted(newValue[0] === 0);

    setShowVolumeIndicator(true);
    clearTimeout(volumeIndicatorTimeoutRef.current);
    volumeIndicatorTimeoutRef.current = setTimeout(() => {
      setShowVolumeIndicator(false);
    }, 2000);
  }, []);

  const handleVolumeClick = useCallback((e) => {
    e.stopPropagation();
    setMuted(prev => !prev);
    setShowVolumeIndicator(true);
    clearTimeout(volumeIndicatorTimeoutRef.current);
    volumeIndicatorTimeoutRef.current = setTimeout(() => {
      setShowVolumeIndicator(false);
    }, 2000);
  }, []);

  const handlePlaybackRateChange = useCallback((rate) => {
    setPlaybackRate(rate);
    setShowSettingsMenu(false);
  }, []);

  const handleQualityChange = useCallback((quality) => {
    setSelectedQuality(quality);
    setShowQualityMenu(false);
  }, []);

  const formatTime = useCallback((seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return hh ? `${hh}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`;
  }, []);

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullScreen]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  const getVolumeIcon = () => {
    if (muted || volumeLevel === 0) {
      return <VolumeX className="h-5 w-5" />;
    } else if (volumeLevel < 33) {
      return <VolumeX className="h-5 w-5" />;
    } else if (volumeLevel < 66) {
      return <Volume1 className="h-5 w-5" />;
    } else {
      return <Volume2 className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!playerContainerRef.current?.contains(document.activeElement)) return;

      const keys = {
        ' ': () => handlePlayAndPause(),
        'k': () => handlePlayAndPause(),
        'f': () => handleFullScreen(),
        'm': () => {
          setMuted(prev => !prev);
          setShowVolumeIndicator(true);
          clearTimeout(volumeIndicatorTimeoutRef.current);
          volumeIndicatorTimeoutRef.current = setTimeout(() => setShowVolumeIndicator(false), 2000);
        },
        'ArrowLeft': () => handleRewind(),
        'ArrowRight': () => handleForward(),
        'i': () => setShowInfoPanel(prev => !prev),
        'ArrowUp': () => handleVolumeChange([Math.min(volumeLevel + 10, 100)]),
        'ArrowDown': () => handleVolumeChange([Math.max(volumeLevel - 10, 0)]),
      };

      if (keys[e.key]) {
        e.preventDefault();
        keys[e.key]();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handlePlayAndPause, handleFullScreen, handleRewind, handleForward, volumeLevel, handleVolumeChange]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);


  useEffect(() => {
    setVolumeLevel(volume * 100);
  }, [volume]);

  const ForwardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.58 16.89l5.77-4.07c.26-.18.41-.45.41-.75 0-.3-.15-.57-.41-.75L5.58 7.25C4.91 6.79 4 7.27 4 8.08v7.84c0 .81.91 1.29 1.58.97zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" />
    </svg>
  );

  const BackwardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.42 7.11L12.65 11.18c-.26.18-.41.45-.41.75 0 .3.15.57.41.75l5.77 4.07c.67.32 1.58-.16 1.58-.97V8.08c0-.81-.91-1.29-1.58-.97zM8 17V7c0-.55-.45-1-1-1s-1 .45-1 1v10c0 .55.45 1 1 1s1-.45 1-1z" />
    </svg>
  );

  return (
    <div
      ref={playerContainerRef}
      className="relative bg-black rounded-lg overflow-hidden border border-gray-800 group"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (playing) setTimeout(() => setShowControls(false), 1000);
        setShowSettingsMenu(false);
        setShowQualityMenu(false);
        setShowVolumeSlider(false);
      }}
      onClick={handlePlayAndPause}
      tabIndex={0}
    >
      {/* Loading/Buffering Overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white text-sm">Buffering...</p>
          </div>
        </div>
      )}

      {/* Volume Level Indicator - Centered like the first component */}
      {showVolumeSlider && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-lg rounded-2xl p-6 z-40 border border-gray-700 shadow-2xl">
          <div className="text-center mb-4">
            <div className="text-white text-2xl font-bold mb-2">{Math.floor(volumeLevel)}%</div>
            <div className="text-gray-300 text-sm">Volume</div>
          </div>
          <div className="w-48">
            <Slider
              value={[muted ? 0 : volumeLevel]}
              max={100}
              step={1}
              onValueChange={(value) => handleVolumeChange(value)}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* React Player */}
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={muted ? 0 : volume}
        muted={muted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        onError={(e) => console.error("Video error:", e)}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
              disablePictureInPicture: false,
            },
          },
        }}
      />

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-all duration-300 flex flex-col justify-end
        ${showControls ? 'opacity-100' : 'opacity-0'}
      `}>

        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />

        {/* Top Controls Bar */}
        <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-black/50 backdrop-blur-sm rounded px-3 py-1">
              <h3 className="text-white font-medium text-sm truncate max-w-xs">{title}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              className="text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
              onClick={(e) => { e.stopPropagation(); setShowInfoPanel(!showInfoPanel); }}
            >
              <Info className="h-5 w-5" />
            </Button>

            <Button
              className="text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
              onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(!showSettingsMenu); setShowQualityMenu(false); }}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="relative mb-2">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 transition-all duration-300"
                style={{ width: `${bufferProgress * 100}%` }}
              />
            </div>
            <Slider
              value={[played * 100]}
              max={100}
              step={0.1}
              onValueChange={handleSeekChange}
              onValueCommit={handleSeekMouseUp}
              className="w-full relative z-10 cursor-pointer h-1"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-300">
            <span>{formatTime(played * (playerRef?.current?.getDuration() || 0))}</span>
            <span>{formatTime(playerRef?.current?.getDuration() || 0)}</span>
          </div>
        </div>

        {/* Bottom Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-t from-black/70 to-transparent">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={(e) => { e.stopPropagation(); handlePlayAndPause(); }}
              className="w-12 h-12 bg-white hover:bg-gray-200 rounded-full text-black flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            >
              {playing ? <Pause className="h-20 w-20" /> : <Play className="h-20 w-20 ml-1" />}
            </Button>

            {/* Rewind */}
            <Button
              onClick={(e) => { e.stopPropagation(); handleRewind(); }}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
              title="Rewind 10 seconds"
            >
              <BackwardIcon />
            </Button>

            {/* Forward */}
            <Button
              onClick={(e) => { e.stopPropagation(); handleForward(); }}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
              title="Forward 10 seconds"
            >
              <ForwardIcon />
            </Button>

            {/* Volume Control */}
            <div
              className="flex items-center space-x-2 relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button
                onClick={handleVolumeClick}
                className="text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
                title={`Volume: ${volumeLevel}%`}
              >
                {getVolumeIcon()}
              </Button>

              <div className="w-20">
                <Slider
                  value={[muted ? 0 : volumeLevel]}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleVolumeChange(value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Playback Rate */}
            <div className="relative">
              <Button
                onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(true); setShowQualityMenu(false); }}
                className="text-gray-300 hover:text-white transition-colors px-3 py-1 rounded hover:bg-white/10 text-sm font-medium"
              >
                {playbackRate}x
              </Button>
            </div>

            {/* Quality */}
            <div className="relative">
              <Button
                onClick={(e) => { e.stopPropagation(); setShowQualityMenu(true); setShowSettingsMenu(false); }}
                className="text-gray-300 hover:text-white transition-colors px-3 py-1 rounded hover:bg-white/10 text-sm font-medium"
              >
                {selectedQuality}
              </Button>
            </div>

            {/* Fullscreen */}
            <Button
              onClick={(e) => { e.stopPropagation(); handleFullScreen(); }}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
            >
              {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {showSettingsMenu && (
        <div className="absolute right-4 bottom-16 bg-gray-900/95 backdrop-blur-lg rounded-lg p-3 shadow-2xl border border-gray-700 min-w-[100px] z-20">
          <div className="space-y-1">
            <div className="text-white text-center font-medium mb-2 text-sm">Playback Speed</div>
            {playbackRates.map((rate) => (
              <Button
                key={rate}
                onClick={(e) => { e.stopPropagation(); handlePlaybackRateChange(rate); }}
                className={`block w-full text-center px-3 py-2 rounded text-sm transition-all ${playbackRate === rate
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {rate}x
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quality Menu */}
      {showQualityMenu && (
        <div className="absolute right-4 bottom-16 bg-gray-900/95 backdrop-blur-lg rounded-lg p-3 shadow-2xl border border-gray-700 min-w-[100px] z-20">
          <div className="space-y-1">
            <div className="text-white font-medium mb-2 text-sm">Quality</div>
            {qualityOptions.map((quality) => (
              <Button
                key={quality}
                onClick={(e) => { e.stopPropagation(); handleQualityChange(quality); }}
                className={`block w-full text-left px-3 py-2 rounded text-sm transition-all ${selectedQuality === quality
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
              >
                {quality}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Center Play Button */}
      {!playing && showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            className="w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white border-2 border-white/40 transition-all hover:scale-110 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); handlePlayAndPause(); }}
          >
            <Play className="h-10 w-10 ml-1" />
          </Button>
        </div>
      )}

      {/* Info Panel */}
      {showInfoPanel && (
        <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-lg rounded-lg p-4 max-w-sm z-20 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-semibold text-sm">Video Info</h4>
            <Button
              onClick={(e) => { e.stopPropagation(); setShowInfoPanel(false); }}
              className="text-gray-300 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-gray-300 text-sm space-y-2">
            <div><span className="text-gray-400">Title:</span> {title}</div>
            <div><span className="text-gray-400">Duration:</span>{formatTime(playerRef?.current?.getDuration() || 0)}</div>
            <div><span className="text-gray-400">Quality:</span> {selectedQuality}</div>
            <div><span className="text-gray-400">Playback:</span> {playbackRate}x</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;