export default class Affectiva {
  constructor(domEl, onResultsHook) {
    this.divRoot = domEl;
    this.width = 640;
    this.height = 480;
    this.onResultsHook = onResultsHook;
    this.faceMode = affdex.FaceDetectorMode.LARGE_FACES;
  }
  init() {
    const detector = new affdex.CameraDetector(
      this.divRoot,
      this.width,
      this.height,
      this.faceMode
    );
    this.detector = detector;
    //sEnable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllEmojis();
    detector.detectAllAppearance();
    detector.addEventListener(
      "onInitializeSuccess",
      this.onInitSuccess.bind(this)
    );
    detector.addEventListener(
      "onImageResultsSuccess",
      this.onImageResultsSuccess.bind(this)
    );
    //Add a callback to notify when camera access is allowed
    detector.addEventListener("onWebcamConnectSuccess", () => {
      this.log("Webcam access allowed");
    });
    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", () => {
      this.log("Webcam access denied");
    });
  }
  log(msg) {
    console.log(msg);
  }
  start() {
    const { detector } = this;
    if (detector && !detector.isRunning) {
      detector.start();
    }
    this.log("Clicked the start button");
  }
  stop() {
    const { detector } = this;
    if (detector && detector.isRunning) {
      detector.removeEventListener();
      detector.stop();
    }
    this.log("Clicked the stop button");
  }
  onInitSuccess() {
    this.log("Clicked the reset button");
    if (this.detector && this.detector.isRunning) {
      this.detector.reset();
    }
  }
  onImageResultsSuccess(faces, image, timestamp) {
    this.log("Timestamp: " + timestamp.toFixed(2));
    this.log("Number of faces found: " + faces.length);
    if (this.onResultsHook) {
      this.onResultsHook(faces, image, timestamp);
    }
    if (faces.length > 0) {
      this.log("Appearance: " + JSON.stringify(faces[0].appearance));
      this.log(
        "Emotions: " +
          JSON.stringify(faces[0].emotions, function(key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
          })
      );
      this.log(
        "Expressions: " +
          JSON.stringify(faces[0].expressions, function(key, val) {
            return val.toFixed ? Number(val.toFixed(0)) : val;
          })
      );
      this.log("Emoji: " + faces[0].emojis.dominantEmoji);
      /*
        drawFeaturePoints(image, faces[0].featurePoints);
*/
    }
  }
}

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {
  var contxt = $("#face_video_canvas")[0].getContext("2d");

  var hRatio = contxt.canvas.width / img.width;
  var vRatio = contxt.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (var id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x, featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();
  }
}
