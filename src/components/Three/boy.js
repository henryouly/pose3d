import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'

import { Euler, Vector3 } from 'three';
import { quaternionFrom, getHeadRotation } from './keypoints';

// Keypoints index:
// https://www.tensorflow.org/lite/examples/pose_estimation/overview
export default function Boy(props) {
  let kp;
  const group = useRef()
  const { nodes, materials } = useGLTF('../../../boy.glb')

  useFrame((state, delta) => {
    kp = props.keypoints.current

    if (typeof kp !== "undefined" && kp !== null) {
      nodes.Boy01_Body_Geo.skeleton.bones[18].setRotationFromEuler(getHeadRotation(kp));

      const lShoulder = new Vector3(kp[11].x, kp[11].y, kp[11].z);
      const rShoulder = new Vector3(kp[12].x, kp[12].y, kp[12].z);
      const lElbow = new Vector3(kp[13].x, kp[13].y, kp[13].z);
      const rElbow = new Vector3(kp[14].x, kp[14].y, kp[14].z);
      const lWrist = new Vector3(kp[15].x, kp[15].y, kp[15].z);
      const rWrist = new Vector3(kp[16].x, kp[16].y, kp[16].z);

      const resetRotation = new Euler(0, 0, 0);
      nodes.Boy01_Body_Geo.skeleton.bones[23].setRotationFromEuler(resetRotation);
      nodes.Boy01_Body_Geo.skeleton.bones[24].setRotationFromEuler(resetRotation);
      nodes.Boy01_Body_Geo.skeleton.bones[43].setRotationFromEuler(resetRotation);
      nodes.Boy01_Body_Geo.skeleton.bones[44].setRotationFromEuler(resetRotation);

      nodes.Boy01_Body_Geo.skeleton.bones[23].applyQuaternion(quaternionFrom(lElbow, lShoulder, rShoulder));
      nodes.Boy01_Body_Geo.skeleton.bones[24].applyQuaternion(quaternionFrom(lWrist, lElbow, lShoulder));
      nodes.Boy01_Body_Geo.skeleton.bones[43].applyQuaternion(
        quaternionFrom(rElbow, rShoulder, lShoulder));
      nodes.Boy01_Body_Geo.skeleton.bones[44].applyQuaternion(quaternionFrom(rWrist, rElbow, rShoulder));
    }
  })

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
