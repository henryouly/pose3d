import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'

import { quaternionFrom, getHeadRotation } from './keypoints';
import { Euler, Vector3 } from 'three';

// Keypoints index:
// https://www.tensorflow.org/lite/examples/pose_estimation/overview
export default function Mousy(props) {
  let kp;
  const group = useRef()
  const { nodes, materials } = useGLTF('../../../mousy.glb')

  useFrame((state, delta) => {
    kp = props.keypoints.current

    if (typeof kp !== "undefined" && kp !== null) {
      nodes.Ch14.skeleton.bones[5].setRotationFromEuler(getHeadRotation(kp));

      const lShoulder = new Vector3(kp[11].z, kp[11].x, kp[11].y);
      const rShoulder = new Vector3(kp[12].z, kp[12].x, kp[12].y);
      const lElbow = new Vector3(kp[13].z, kp[13].x, kp[13].y);
      const rElbow = new Vector3(kp[14].z, kp[14].x, kp[14].y);
      const lWrist = new Vector3(kp[15].z, kp[15].x, kp[15].y);
      const rWrist = new Vector3(kp[16].z, kp[16].x, kp[16].y);
      nodes.Ch14.skeleton.bones[8].setRotationFromQuaternion(quaternionFrom(rShoulder, lShoulder, lElbow));
      nodes.Ch14.skeleton.bones[9].setRotationFromQuaternion(quaternionFrom(lShoulder, lElbow, lWrist));
      nodes.Ch14.skeleton.bones[28].setRotationFromQuaternion(
        quaternionFrom(rElbow, rShoulder, lShoulder));
      nodes.Ch14.skeleton.bones[29].setRotationFromQuaternion(quaternionFrom(rWrist, rElbow, rShoulder));
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh geometry={nodes.Ch14.geometry} material={materials.Ch14_Body} skeleton={nodes.Ch14.skeleton} />
      </group>
    </group>
  )
}
