import { Vector3, Quaternion, Euler } from 'three';

const CONFIDENCE = 0.5

function getHeadRotation(kp) {
  if (kp[0].score < CONFIDENCE || kp[2].score < CONFIDENCE || kp[5].score < CONFIDENCE) {
    return new Euler(0, 0, 0);
  }
  const y = getYRotation(kp[2], kp[5], kp[0]);
  const z = getZRotation(kp[2], kp[5]);
  return new Euler(0, y, z);
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

function quaternionFrom(first, middle, last) {
  const v1 = new Vector3();
  v1.subVectors(first, middle).normalize();
  const v2 = new Vector3();
  v2.subVectors(middle, last).normalize();
  const quaternion = new Quaternion();
  quaternion.setFromUnitVectors(v1, v2);
  return quaternion;
}

export { getHeadRotation, quaternionFrom }