import React from "react";
import Floor from "./Floor";
import { MetalBench } from "./Bench";

interface RoomProps {
  width: number;
  length: number;
  height: number;
  wallTiltAngle: number;
}

const Room: React.FC<RoomProps> = ({
  width,
  length,
  height,
  wallTiltAngle = 0.15,
}) => {
  const frontWidth = width - 1 * (length * Math.sin(wallTiltAngle));

  const ceilingWidth = width + 1 * (length * Math.tan(wallTiltAngle));

  const sideWallLength = length / Math.cos(wallTiltAngle);

  return (
    <group>
      {/* Floor */}
      <Floor
        width={ceilingWidth}
        length={length}
        position={[0, 0, length / 2]}
      />

      {/* Ceiling */}
      <mesh
        position={[0, height, length / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ceilingWidth, length]} />
        <meshStandardMaterial color="#D6CDBF" metalness={0} roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-width / 2, height / 2, length / 2]}
        rotation={[0, Math.PI / 2 - wallTiltAngle, 0]}
        receiveShadow
      >
        <planeGeometry args={[sideWallLength, height]} />
        <meshStandardMaterial color="#D6D0BE" metalness={0} roughness={0.9} />
      </mesh>

      {/* Benches*/}
      <MetalBench position={[0, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
      <MetalBench position={[2, 0, 4.5]} rotation={[0, wallTiltAngle, 0]} />
      <MetalBench position={[2.9, 0, 8.75]} rotation={[0, wallTiltAngle, 0]} />
      <MetalBench position={[-2, 0, 4.5]} rotation={[0, -wallTiltAngle, 0]} />
      <MetalBench
        position={[-2.9, 0, 8.75]}
        rotation={[0, -wallTiltAngle, 0]}
      />

      {/* Right Wall */}
      <mesh
        position={[width / 2, height / 2, length / 2]}
        rotation={[0, -Math.PI / 2 + wallTiltAngle, 0]}
        receiveShadow
      >
        <planeGeometry args={[sideWallLength, height]} />
        <meshStandardMaterial color="#D6D0BE" metalness={0} roughness={0.9} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <planeGeometry args={[frontWidth, height]} />
        <meshStandardMaterial color="#D6D0BE" metalness={0} roughness={0.75} />
      </mesh>
    </group>
  );
};

export default Room;
