import approximate from './approximate';
import getMinShifts from './getMinShifts';

const size = 8;
const shifts = [0, 1, -1, 2, -2, 4, -4];

(async () => {
  const video0 = document.querySelectorAll('video')[0];
  video0.src = '/static/small/face-colors.mp4';
  const video1 = document.querySelectorAll('video')[1];
  video1.src = '/static/small/motocross.mp4';
  await Promise.all([video0, video1].map((video) => new Promise((r) => video.addEventListener('canplaythrough', r, { once: true }))));

  const width = video0.videoWidth;
  const height = video0.videoHeight;
  const copyCanvas = document.querySelectorAll('canvas')[0];
  copyCanvas.width = width;
  copyCanvas.height = height;
  const copyCtx = copyCanvas.getContext('2d');
  const outCanvas = document.querySelectorAll('canvas')[1];
  outCanvas.width = width;
  outCanvas.height = height;
  const outCtx = outCanvas.getContext('2d');

  // @ts-ignore
  const stream = outCanvas.captureStream() as MediaStream;
  const recorder = new MediaRecorder(stream);
  recorder.start();

  const loop = async () => {
    if (video0.currentTime < 3) {
      outCtx.drawImage(video0, 0, 0);
      // @ts-ignore
      await video0.seekToNextFrame();
    } else if (video1.currentTime < 5) {
      copyCtx.drawImage(video1, 0, 0);
      const previous1 = copyCtx.getImageData(0, 0, width, height);
      // @ts-ignore
      await video1.seekToNextFrame();
      copyCtx.drawImage(video1, 0, 0);
      const real1 = copyCtx.getImageData(0, 0, width, height);
      const minShifts1 = getMinShifts(previous1, real1, size, shifts);

      const previous0 = outCtx.getImageData(0, 0, width, height);

      const outData = approximate(previous0, minShifts1, size);
      outCtx.putImageData(outData, 0, 0);
    } else {
      recorder.stop();
      return;
    }
    requestAnimationFrame(loop);
  };
  loop();

  recorder.addEventListener('dataavailable', (evt) => {
    const url = URL.createObjectURL(evt.data);
    const outputVideo = document.querySelectorAll('video')[2];
    outputVideo.src = url;
  });
})();
