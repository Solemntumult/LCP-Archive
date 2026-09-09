/**
 * Client-side Video Compression for Web Playback
 * Optimizes videos using HTML5 Canvas & MediaRecorder API or standard WebM/MP4 pipeline.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  videoBitrate?: number; // bits per second, e.g. 1_200_000 for ~1.2Mbps
  fps?: number;
  onProgress?: (progress: number) => void;
}

export async function compressVideoForWeb(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    videoBitrate = 1_200_000,
    fps = 30,
    onProgress,
  } = options;

  // Pass-through if already small (< 3MB) and web video
  if (file.size < 3 * 1024 * 1024 && (file.type === 'video/mp4' || file.type === 'video/webm')) {
    onProgress?.(100);
    return file;
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
      onProgress?.(100);
      return resolve(file);
    }

    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.onloadedmetadata = async () => {
      let width = video.videoWidth || 1280;
      let height = video.videoHeight || 720;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      if (width % 2 !== 0) width -= 1;
      if (height % 2 !== 0) height -= 1;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx || typeof canvas.captureStream !== 'function') {
        URL.revokeObjectURL(objectUrl);
        onProgress?.(100);
        return resolve(file);
      }

      const stream = canvas.captureStream(fps);

      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }
      } catch {
        // Audio capture fallback
      }

      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      if (!selectedMimeType) {
        URL.revokeObjectURL(objectUrl);
        onProgress?.(100);
        return resolve(file);
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType,
          videoBitsPerSecond: videoBitrate,
        });
      } catch {
        URL.revokeObjectURL(objectUrl);
        onProgress?.(100);
        return resolve(file);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(objectUrl);
        const compressedBlob = new Blob(chunks, { type: selectedMimeType });
        onProgress?.(100);
        if (compressedBlob.size > file.size && file.size > 0) {
          resolve(file);
        } else {
          resolve(compressedBlob);
        }
      };

      recorder.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        onProgress?.(100);
        resolve(file);
      };

      let animationFrameId: number;
      const duration = video.duration || 1;

      const drawFrame = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, width, height);
        const percent = Math.min(99, Math.round((video.currentTime / duration) * 100));
        onProgress?.(percent);
        animationFrameId = requestAnimationFrame(drawFrame);
      };

      recorder.start(100);
      try {
        await video.play();
        drawFrame();
      } catch {
        recorder.stop();
        URL.revokeObjectURL(objectUrl);
        return resolve(file);
      }

      video.onended = () => {
        cancelAnimationFrame(animationFrameId);
        recorder.stop();
      };
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      onProgress?.(100);
      resolve(file);
    };
  });
}
