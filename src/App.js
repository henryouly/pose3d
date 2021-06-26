import { Canvas } from '@react-three/fiber';
import React, { Suspense, useRef } from 'react';
import FPSStats from "react-fps-stats";
import PosecamView from './components/PosecamView';
import Lights from './components/Three/lights.js';
import Mousy from './components/Three/mousy.js';

function App() {
  const keypoints = useRef(null);

  return (
    <>
    
    <div style={{ position: "relative", width: 600, height: 600 }}>
      <Canvas
        colorManagement
        shadowMap
        camera={{position: [0, 0, 2], fov: 60}}>
          <Lights />
          <Suspense fallback={null}>
            <mesh position={[0,-1,0]}>
              <Mousy keypoints={keypoints}/>
            </mesh>
          </Suspense>
        </Canvas>
    </div>
    <PosecamView keypoints={keypoints}/>
    <FPSStats top={"auto"} right={"auto"}/>
    </>
  );
}

export default App;

