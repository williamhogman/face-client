import Head from "next/head";
import React from "react";
import Webcam from "react-webcam";
import AffectivaFrame from "../affectiva-frame.js"
const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const now = () => (new Date()).getTime() / 1000

class StreamCapture {
    constructor(videoTrack, onFrame) {
        this.onFrame = onFrame
        const imageCapture = new ImageCapture(videoTrack)
        this.imageCapture = imageCapture
        this.startTimestamp = now()
        this.loop()
    }
    loop() {
        this.capture().catch(() => {}).then(() => setTimeout(() => this.loop(), 40))
    }
    async capture() {
        let frame;
        try {
            frame = await this.imageCapture.grabFrame()
        } catch (err) {
            console.log("grab frame fail", err)
        }
        const time = now()

        const {width, height} = frame
        const os = new OffscreenCanvas(width, height);
        const ctx = os.getContext("2d")
        ctx.drawImage(os, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        this.onFrame(imageData, now() - this.startTimestamp)
    }
}

const WebcamCapture = ({onImageResultSuccess}) => {
    const webcamRef = React.useRef(null);
    
    const onUserMedia = React.useCallback(() => {
        const affectiva = new AffectivaFrame(onImageResultSuccess);
        const videoTrack = webcamRef.current.video.srcObject.getVideoTracks()[0]
        const cap = new StreamCapture(videoTrack, affectiva.handleFrame.bind(affectiva))
        affectiva.start()
        
    }, [webcamRef, onImageResultSuccess])
    
    return (
            <>
            <Webcam
        audio={false}
        height={320}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={460}
        onUserMedia={onUserMedia}
        videoConstraints={videoConstraints}
            />
            </>
    );
};


const RESULTS_BUFFER_TIMEOUT = 100;
class ResultsBuffer {
  constructor(onFlush) {
    this.timeoutActive = false;
    this.buffer = [];
    this.onFlush = onFlush;
  }
  add(data) {
    this.buffer.push(data);
    if (!this.timeoutActive) {
      setTimeout(this.flush.bind(this), RESULTS_BUFFER_TIMEOUT);
      this.timeoutActive = true;
    }
  }
  flush() {
    this.onFlush(this.buffer);
    this.buffer = [];
    this.timeoutActive = false;
  }
}

export default class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.camera = React.createRef();
      this.resBuf = new ResultsBuffer(this.onFlush.bind(this));
      this.onResultsHook = this.onResultsHook.bind(this)
  }
  onFlush(results) {
    if (this.props.onResults) {
      this.props.onResults(results);
    }
  }
  onResultsHook(faces, frame, ts) {
      // Skip frame here?
    this.resBuf.add({ faces, frame, ts });
  }

  render() {
    return (
      <div>
        <div
          ref={this.camera}
          style={{ width: "460px", height: "320px" }}
        >
            <WebcamCapture onImageResultSuccess={this.onResultsHook} />
</div>
      </div>
    );
  }
}
