export default class AffectivaFrame {
  constructor(onResultsHook) {
    const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
    const detector = new affdex.FrameDetector(faceMode);
    this.detector = detector;
    this.onResultsHook = onResultsHook;
    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllEmojis();
    detector.detectAllAppearance();
    detector.addEventListener(
      "onImageResultsSuccess",
      this.onImageResultsSuccess.bind(this)
    );
    /* 
           onImageResults success receives 3 parameters:
           - image: An imageData object containing the pixel values for the processed frame.
           - timestamp: An imageData object contain the pixel values for the processed frame.
           - err_detail: A string contains the encountered exception.
        */
    detector.addEventListener(
      "onImageResultsFailure",
        (image, timestamp, err_detail) => {
            console.log(image, err_detail)
        }
    );
      if (detector && !detector.isRunning) {
          detector.start();
      }
  }

    handleFrame(imageData, deltaTime) {
        if(!this.detector.isRunning) {
            this.detector.start();
            console.log("not running")
        }
    this.detector.process(imageData, deltaTime);
  }

  start() {
    const { detector } = this;
    if (detector && !detector.isRunning) {
      detector.start();
    }
  }
  stop() {
    const { detector } = this;
    if (detector && detector.isRunning) {
      detector.removeEventListener();
      detector.stop();
    }
    this.log("Clicked the stop button");
  }
    onImageResultsSuccess(faces, image, timestamp) {
    if (this.onResultsHook) {
      this.onResultsHook(faces, image, timestamp);
    }
  }
}
