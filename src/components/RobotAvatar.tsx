import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface RobotProps {
  state: 'idle' | 'typing' | 'explaining' | 'encouraging';
  isTyping?: boolean;
}

const Robot = ({ state, isTyping }: RobotProps) => {
  const robotRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    
    if (!robotRef.current || !headRef.current || !leftArmRef.current || !rightArmRef.current) return;

    // Idle animations - subtle movements
    if (state === 'idle') {
      // Gentle breathing effect on body
      robotRef.current.scale.y = 1 + Math.sin(timeRef.current * 2) * 0.02;
      
      // Head looking around calmly
      headRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.3;
      headRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
      
      // Finger tapping - subtle arm movement
      leftArmRef.current.rotation.z = Math.sin(timeRef.current * 3) * 0.1 + 0.3;
      rightArmRef.current.rotation.z = Math.sin(timeRef.current * 3 + Math.PI) * 0.1 - 0.3;
      
      // Soft blinking
      if (leftEyeRef.current && rightEyeRef.current) {
        const blinkCycle = Math.sin(timeRef.current * 0.5);
        const blink = blinkCycle > 0.95 ? 0.1 : 1;
        leftEyeRef.current.scale.y = blink;
        rightEyeRef.current.scale.y = blink;
      }
    }
    
    // Typing state - attentive and still
    if (state === 'typing') {
      // Maintain steady eye contact
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0.1, 0.1);
      
      // Arms relaxed
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.5, 0.1);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.5, 0.1);
      
      // Minimal breathing
      robotRef.current.scale.y = THREE.MathUtils.lerp(robotRef.current.scale.y, 1, 0.1);
    }
    
    // Explaining state - animated gestures
    if (state === 'explaining') {
      // Nodding
      headRef.current.rotation.x = Math.sin(timeRef.current * 2) * 0.2 + 0.1;
      headRef.current.rotation.y = Math.sin(timeRef.current * 1.5) * 0.15;
      
      // Pointing gesture with right arm
      rightArmRef.current.rotation.z = Math.sin(timeRef.current * 2) * 0.3 - 0.8;
      rightArmRef.current.rotation.x = Math.sin(timeRef.current * 2) * 0.2;
      
      // Left arm supportive
      leftArmRef.current.rotation.z = 0.6;
      
      // Active breathing
      robotRef.current.scale.y = 1 + Math.sin(timeRef.current * 2.5) * 0.03;
    }
    
    // Encouraging state - humble gestures
    if (state === 'encouraging') {
      // Slight bow
      robotRef.current.rotation.x = Math.sin(timeRef.current * 1.5) * 0.1 + 0.05;
      
      // Hand on chest gesture
      rightArmRef.current.rotation.z = -0.8;
      rightArmRef.current.rotation.x = 0.5;
      
      // Gentle head tilt
      headRef.current.rotation.y = 0.2;
      headRef.current.rotation.z = 0.1;
      
      // Calm breathing
      robotRef.current.scale.y = 1 + Math.sin(timeRef.current * 1.5) * 0.025;
    }
  });

  return (
    <group ref={robotRef} position={[0, -1, 0]}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1.2, 0.6]} />
        <meshStandardMaterial color="#4A90E2" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Head */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#5BA3F5" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.1, 0.41]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.2, 0.1, 0.41]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Mouth - friendly smile */}
        <mesh position={[0, -0.2, 0.41]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Antenna */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.8} />
        </mesh>
      </group>
      
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.6, 0.8, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#4A90E2" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#5BA3F5" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -1, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#00D9FF" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.6, 0.8, 0]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#4A90E2" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#5BA3F5" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -1, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#00D9FF" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Legs */}
      <mesh position={[-0.25, -0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#4A90E2" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.25, -0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#4A90E2" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.25, -0.8, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#5BA3F5" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.25, -0.8, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#5BA3F5" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

interface RobotAvatarProps {
  state: 'idle' | 'typing' | 'explaining' | 'encouraging';
  isTyping?: boolean;
}

export const RobotAvatar = ({ state, isTyping }: RobotAvatarProps) => {
  return (
    <div className="fixed bottom-24 right-8 w-64 h-64 rounded-2xl overflow-hidden glass-effect border border-primary/30 shadow-2xl z-40">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />
        <spotLight 
          position={[0, 5, 5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1}
          castShadow
        />
        
        <Robot state={state} isTyping={isTyping} />
      </Canvas>
      
      {/* State indicator */}
      <div className="absolute top-2 left-2 text-xs text-primary/70 font-medium px-2 py-1 rounded-full bg-background/50 backdrop-blur-sm">
        {state === 'idle' && '✨ Ready to help'}
        {state === 'typing' && '👀 Listening...'}
        {state === 'explaining' && '🤖 Explaining...'}
        {state === 'encouraging' && '💙 Encouraging'}
      </div>
    </div>
  );
};
