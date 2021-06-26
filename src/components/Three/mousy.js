import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'

import * as keypoints from './keypoints';

// Keypoints index:
// https://www.tensorflow.org/lite/examples/pose_estimation/overview
export default function Mousy(props) {
  let kp;
  const group = useRef()
  const { nodes, materials } = useGLTF('../../../mousy.glb')

  useFrame((state, delta) => {
    kp = props.keypoints.current

    if (typeof kp !== "undefined" && kp !== null) {
      nodes.Ch14.skeleton.bones[5].setRotationFromEuler(keypoints.getHeadRotation(kp));
      nodes.Ch14.skeleton.bones[8].setRotationFromEuler(keypoints.getLeftArmRotation(kp));
      nodes.Ch14.skeleton.bones[9].setRotationFromEuler(keypoints.getLeftForearmRotation(kp));
      nodes.Ch14.skeleton.bones[28].setRotationFromEuler(keypoints.getRightArmRotation(kp));
      nodes.Ch14.skeleton.bones[29].setRotationFromEuler(keypoints.getRightForearmRotation(kp));
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
