import React, { useEffect, useRef } from 'react';
import Webcam from "react-webcam";
import DatGui from './datgui';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';

import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';

import * as posedetection from '@tensorflow-models/pose-detection';

import { STATE, DEFAULT_RADIUS, DEFAULT_LINE_WIDTH } from './params';
import { setBackendAndEnvFlags } from './util';

tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`);


const PosecamView = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detector = useRef(null);
  const rafId = useRef(null);

  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    width: 160,
    height: 120
  };

  const createDetector = async () => {
    switch (STATE.model) {
      case posedetection.SupportedModels.PoseNet:
        return posedetection.createDetector(STATE.model, {
          quantBytes: 4,
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 500, height: 500 },
          multiplier: 0.75
        });
      case posedetection.SupportedModels.BlazePose:
        const runtime = STATE.backend.split('-')[0];
        if (runtime === 'mediapipe') {
          return posedetection.createDetector(STATE.model, {
            runtime,
            modelType: STATE.modelConfig.type,
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose'
          });
        } else if (runtime === 'tfjs') {
          return posedetection.createDetector(
            STATE.model, { runtime, modelType: STATE.modelConfig.type });
        }
        break;
      case posedetection.SupportedModels.MoveNet:
        const modelType = STATE.modelConfig.type === 'lightning' ?
          posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING :
          posedetection.movenet.modelType.SINGLEPOSE_THUNDER;
        return posedetection.createDetector(STATE.model, { modelType });
      default:
    }
  }

  const animate = () => {
    if (typeof detector.current !== "undefined" && detector.current !== null) {
      detect(detector.current)
    }
    rafId.current = requestAnimationFrame(animate)
  }

  const detect = async (detector) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const poses = await detector.estimatePoses(
        video,
        { maxPoses: STATE.modelConfig.maxPoses, flipHorizontal: true });

      const ctx = canvasRef.current.getContext("2d")
      for (const pose of poses) {
        drawPose(pose, ctx)
      }
    }
  }

  const drawPose = (predictions, ctx) => {
    const keypoints = predictions.keypoints;
    props.keypoints.current = keypoints
    drawKeypoints(keypoints, ctx)
    drawSkeleton(keypoints, ctx)
  }

  const drawKeypoints = (keypoints, ctx) => {
    const keypointInd =
      posedetection.util.getKeypointIndexBySide(STATE.model);

    for (const i of keypointInd.middle) {
      drawKeypoint(keypoints[i], "yellow", ctx)
    }

    for (const i of keypointInd.left) {
      drawKeypoint(keypoints[i], "lime", ctx)
    }

    for (const i of keypointInd.right) {
      drawKeypoint(keypoints[i], "red", ctx)
    }
  }

  const drawKeypoint = (keypoint, color, ctx) => {
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = STATE.modelConfig.scoreThreshold || 0;

    if (score >= scoreThreshold) {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  const drawSkeleton = (keypoints, ctx) => {
    ctx.fillStyle = 'White';
    ctx.strokeStyle = 'White';
    ctx.lineWidth = DEFAULT_LINE_WIDTH;

    posedetection.util.getAdjacentPairs(STATE.model)
      .forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

        // If score is null, just show the keypoint.
        const score1 = kp1.score != null ? kp1.score : 1;
        const score2 = kp2.score != null ? kp2.score : 1;
        const scoreThreshold = STATE.modelConfig.scoreThreshold || 0;

        if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.stroke();
        }
      });
  }

  useEffect(() => {
    const setupDetector = async () => {
      await setBackendAndEnvFlags(STATE.flags, STATE.backend);
      detector.current = await createDetector();
    };

    setupDetector();
    animate();

    return (() => { cancelAnimationFrame(rafId.current) })
  });

  return (
    <div>
      <Webcam ref={webcamRef} mirrored style={style} />
      <canvas ref={canvasRef} style={style} />
      <DatGui />
    </div>
  )
}

export default PosecamView