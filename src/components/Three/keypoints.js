import * as THREE from "three";

const CONFIDENCE = 0.5
const NO_ROTATION = new THREE.Euler(0, 0, 0);

function getLeftArmRotation(kp) {
  if (kp[11].score < CONFIDENCE || kp[12].score < CONFIDENCE || kp[13].score < CONFIDENCE) {
    return NO_ROTATION;
  }
  const x = getAngle(kp[12], kp[11], kp[13]);
  return new THREE.Euler(x, 0, 0);
}

function getLeftForearmRotation(kp) {
  if (kp[11].score < CONFIDENCE || kp[13].score < CONFIDENCE || kp[15].score < CONFIDENCE) {
    return NO_ROTATION;
  }
  const x = getAngle(kp[11], kp[13], kp[15]);
  return new THREE.Euler(x, 0, 0);
}

function getRightArmRotation(kp) {
  if (kp[11].score < CONFIDENCE || kp[12].score < CONFIDENCE || kp[14].score < CONFIDENCE) {
    return NO_ROTATION;
  }
  const x = -getAngle(kp[11], kp[12], kp[14]);
  return new THREE.Euler(x, 0, 0);
}

function getRightForearmRotation(kp) {
  if (kp[12].score < CONFIDENCE || kp[14].score < CONFIDENCE || kp[16].score < CONFIDENCE) {
    return NO_ROTATION;
  }
  const x = -getAngle(kp[12], kp[14], kp[16]);
  return new THREE.Euler(x, 0, 0);
}

function getAngle(first, middle, last) {
  return Math.atan2(last.y - middle.y, last.x - middle.x) - Math.atan2(middle.y - first.y, middle.x - first.x);
}

function getHeadRotation(kp) {
  if (kp[0].score < CONFIDENCE || kp[2].score < CONFIDENCE || kp[5].score < CONFIDENCE) {
    return NO_ROTATION;
  }
  const y = getYRotation(kp[2], kp[5], kp[0]);
  const z = getZRotation(kp[2], kp[5]);
  return new THREE.Euler(0, y, z);
}

function getYRotation(p1, p2, pivot) {
  let e1 = Math.abs(p1.x - pivot.x)
  let e2 = Math.abs(p2.x - pivot.x)
  return normalize(-100, 100, e2-e1) - Math.PI/2;
}

function getZRotation(p1, p2) {
  let e1 = Math.abs(p1.y)
  let e2 = Math.abs(p2.y)
  return normalize(-80, 80, e2-e1) - Math.PI/2;
}

function normalize(min, max, val) {
  return ((val - min) / (max - min)) * Math.PI;
}

export { getLeftArmRotation, getRightArmRotation, getHeadRotation, getLeftForearmRotation, getRightForearmRotation }