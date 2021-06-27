import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'
import * as THREE from "three";

import * as keypoints from './keypoints';

// Keypoints index:
// https://www.tensorflow.org/lite/examples/pose_estimation/overview
export default function Boy(props) {
  let kp;
  const group = useRef()
  const { nodes, materials } = useGLTF('../../../boy.glb')

  useFrame((state, delta) => {
    kp = props.keypoints.current

    if (typeof kp !== "undefined" && kp !== null) {
      nodes.Boy01_Body_Geo.skeleton.bones[18].setRotationFromEuler(keypoints.getHeadRotation(kp));
      nodes.Boy01_Body_Geo.skeleton.bones[23].setRotationFromEuler(applyRotation(keypoints.getLeftArmAngle(kp)));
      nodes.Boy01_Body_Geo.skeleton.bones[24].setRotationFromEuler(applyRotation(keypoints.getLeftForearmAngle(kp)));
      nodes.Boy01_Body_Geo.skeleton.bones[43].setRotationFromEuler(applyRotation(keypoints.getRightArmAngle(kp)));
      nodes.Boy01_Body_Geo.skeleton.bones[44].setRotationFromEuler(applyRotation(keypoints.getRightForearmAngle(kp)));
    }
  })

  const applyRotation = (x) => {
    return new THREE.Euler(0, 0, -x);
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
