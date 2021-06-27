import { Canvas } from '@react-three/fiber';
import React, { Suspense, useRef, useState } from 'react';
import FPSStats from "react-fps-stats";
import PosecamView from './components/PosecamView';
import Lights from './components/Three/lights.js';
import Characters from './components/Three/characters';

function App() {
  const keypoints = useRef(null);
  const [character, setCharacter] = useState("Mousy");

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
              <Characters keypoints={keypoints} model={character}/>
            </mesh>
          </Suspense>
        </Canvas>
    </div>
    <PosecamView keypoints={keypoints} setCharacter={setCharacter} />
    <FPSStats top={"auto"} right={"auto"}/>
    </>
  );
}

export default App;

