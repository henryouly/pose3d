import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'

import { ArrowHelper, Quaternion, Vector3 } from 'three';
import { quaternionFrom, getHeadRotation } from './keypoints';

// Keypoints index:
// https://www.tensorflow.org/lite/examples/pose_estimation/overview
export default function Boy(props) {
  let kp;
  const group = useRef()
  const { nodes, materials } = useGLTF('../../../boy.glb')
  const initRotation = useRef(null);
  const arrowHelperRef = useRef(null);
  const invertRotation = [];
  const skeleton = nodes.Boy01_Body_Geo.skeleton;
  const bones = skeleton.bones;

  useFrame((state, delta) => {
    kp = props.keypoints.current

    if (typeof kp !== "undefined" && kp !== null) {
      const nose = makeVector(kp[0]);
      const lEyeInner = makeVector(kp[1]);
      const lEye = makeVector(kp[2]);
      const lEyeOuter = makeVector(kp[3]);
      const rEyeInner = makeVector(kp[4]);
      const rEye = makeVector(kp[5]);
      const rEyeOuter = makeVector(kp[6]);
      const lEar = makeVector(kp[7]);
      const rEar = makeVector(kp[8]);
      const lMouth = makeVector(kp[9]);
      const rMouth = makeVector(kp[10]);
      const lShoulder = makeVector(kp[11]);
      const rShoulder = makeVector(kp[12]);
      const lElbow = makeVector(kp[13]);
      const rElbow = makeVector(kp[14]);
      const lWrist = makeVector(kp[15]);
      const rWrist = makeVector(kp[16]);
      const lHip = makeVector(kp[23]);
      const rHip = makeVector(kp[24]);
      const lKnee = makeVector(kp[25]);
      const rKnee = makeVector(kp[26]);
      const lAnkle = makeVector(kp[27]);
      const rAnkle = makeVector(kp[28]);
      const lHeel = makeVector(kp[29]);
      const rHeel = makeVector(kp[30]);

      //bones[0].setRotationFromEuler(new Euler(0, 0, 0));
      //bones[0].rotateOnAxis(new Vector3(1, 0, 0), Math.PI);

      if (initRotation.current === null) {
        initRotation.current = bones[0].quaternion;
        const arrowHelper = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 100, 0xff0000);
        bones[0].add(arrowHelper);
        arrowHelperRef.current = arrowHelper;
      } else {
        const rotation = initRotation.current.clone();
        bones[0].setRotationFromQuaternion(rotation);
      }
      bones[18].setRotationFromEuler(getHeadRotation(kp));

      let angle;
      angle = getAngle(rShoulder, lShoulder, lElbow) - Math.PI / 2;
      setDirectionAndForward(23, quaternionFrom(rShoulder, lShoulder, lElbow).invert(), angle / 2);
      setDirectionAndForward(24, quaternionFrom(lShoulder, lElbow, lWrist).invert(), angle, invertRotation[23]);
      angle = normalizeRange(-getAngle(lShoulder, rShoulder, rElbow) + 1.5 * Math.PI, -2 * Math.PI, 0);
      setDirectionAndForward(43, quaternionFrom(lShoulder, rShoulder, rElbow).invert(), angle / 2);
      setDirectionAndForward(44, quaternionFrom(rShoulder, rElbow, rWrist).invert(), angle, invertRotation[43]);
      arrowHelperRef.current.setDirection(bones[24].position);
    }
  })

  function normalizeRange(angle, min, max) {
    while (angle < min) {
      angle += 2 * Math.PI;
    }
    while (angle > max) {
      angle -= 2 * Math.PI;
    }
    return angle;
  }

  function getAngle(first, middle, last) {
    return Math.atan2(last.y - middle.y, last.x - middle.x) - Math.atan2(middle.y - first.y, middle.x - first.x);
  }

  function setDirectionAndForward(boneIndex, dirQuaternion, rotateAngle, invertQuaternion = null) {
    const quaternion = new Quaternion();
    // warning: The multiply order of quaternion matters!
    if (invertQuaternion !== null) {
      quaternion.multiply(invertQuaternion);
    }
    quaternion.multiply(dirQuaternion);
    quaternion.multiply(makeRotateQuaternion(rotateAngle));
    bones[boneIndex].setRotationFromQuaternion(quaternion);
    invertRotation[boneIndex] = makeRotateQuaternion(-rotateAngle);
  }

  function makeRotateQuaternion(rotationAngle) {
    return new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rotationAngle);    
  }

  function makeVector(kp) {
    return new Vector3(kp.x, kp.y, kp.z);
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          geometry={nodes.Boy01_Body_Geo.geometry}
          material={materials.Boy01_Body_MAT}
          skeleton={nodes.Boy01_Body_Geo.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Boy01_Brows_Geo.geometry}
          material={materials.Boy01_Brows_MAT1}
          skeleton={nodes.Boy01_Brows_Geo.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Boy01_Eyes_Geo.geometry}
          material={materials.Boy01_Eyes_MAT1}
          skeleton={nodes.Boy01_Eyes_Geo.skeleton}
        />
        <skinnedMesh
          geometry={nodes.h_Geo.geometry}
          material={materials.Boy01_Mouth_MAT1}
          skeleton={nodes.h_Geo.skeleton}
        />
      </group>
    </group>
  )
}
