import React, {
  useState,
  useRef,
  useContext,
  forwardRef,
  useEffect,
} from "react";
import { useTexture, Text, useCursor, useFont } from "@react-three/drei";
import * as THREE from "three";
import { ImageMetadata } from "../../types/museum";
import { ZoomContext } from "../../contexts/ZoomContext";

interface FrameProps {
  position: [number, number, number];
  rotation: [number, number, number];
  image: ImageMetadata;
  index: number;
  onFrameClick?: (index: number) => void;
}

useFont.preload("/fonts/Inter_28pt-SemiBold.ttf");

const FRAME_WIDTH = 1.2;
const FRAME_GAP = 0.25;

const Frame = forwardRef<THREE.Mesh, FrameProps>(
  ({ position, rotation, image, index, onFrameClick }, ref) => {
    const [hovered, setHovered] = useState(false);
    const [errorMap, setErrorMap] = useState<Record<number, boolean>>({});
    const internalRef = useRef<THREE.Mesh>(null);

    const { zoomedFrameId } = useContext(ZoomContext);
    const isZoomed = zoomedFrameId === index;

    useCursor(hovered);

    const imageUrls = [image.url, image.url1].filter(
      (u): u is string => Boolean(u && u !== "")
    );

    const textures = useTexture(imageUrls);
    const isDouble = imageUrls.length === 2;

    useEffect(() => {
      textures.forEach((texture, i) => {
        if (!texture?.source?.data) return;

        const handleError = () =>
          setErrorMap((m) => ({ ...m, [i]: true }));

        texture.source.data.addEventListener("error", handleError);
        return () =>
          texture.source.data.removeEventListener("error", handleError);
      });
    }, [textures]);

    textures.forEach((t) => {
      if (t) t.minFilter = THREE.LinearFilter;
    });

    const aspectRatio =
      textures[0]?.image
        ? textures[0].image.width / textures[0].image.height
        : 1;

    const height = FRAME_WIDTH / aspectRatio;

    useEffect(() => {
      if (!internalRef.current) return;

      if (typeof ref === "function") ref(internalRef.current);
      else if (ref)
        (ref as React.MutableRefObject<THREE.Mesh>).current =
          internalRef.current;
    }, [ref]);

    const handleClick = () => onFrameClick?.(index);

    return (
        <group ref={internalRef} position={[position[0], position[1], position[2] + (isDouble ? 0.8 : 0)]} rotation={rotation}>
        {textures.map((texture, i) => {
          const xOffset =
            textures.length === 2
              ? (i === 0 ? -1 : 1) * (FRAME_WIDTH / 2 + FRAME_GAP / 2)
              : 0;

          return (
            <mesh
              key={i}
              position={[xOffset, 0, 0]}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={handleClick}
              castShadow
              receiveShadow
            >
              <boxGeometry
                args={[FRAME_WIDTH + 0.1, height + 0.1, 0.1]}
              />
              <meshStandardMaterial color="#222" />

              <mesh position={[0, 0, 0.051]}>
                <planeGeometry args={[FRAME_WIDTH, height]} />
                {errorMap[i] ? (
                  <meshBasicMaterial color="#444">
                    <Text
                      position={[0, 0, 0.01]}
                      fontSize={0.1}
                      color="white"
                      anchorX="center"
                      anchorY="middle"
                    >
                      Image not available
                    </Text>
                  </meshBasicMaterial>
                ) : (
                  <meshBasicMaterial
                    map={texture}
                    toneMapped
                    color="#ddd"
                  />
                )}
              </mesh>
            </mesh>
          );
        })}

        {isZoomed && (
          <mesh
            position={[
              (textures.length === 2
                ? FRAME_WIDTH + FRAME_GAP
                : FRAME_WIDTH / 2) + 0.2,
              height / 2 - 0.2,
              -0.05,
            ]}
          >
            <Text
              position={[0, -.6, 0.015]}
              fontSize={0.065}
              color="#383838"
              anchorX="left"
              anchorY="middle"
              maxWidth={1}
              textAlign="left"
              lineHeight={1.3}
              font="/fonts/Inter_28pt-SemiBold.ttf"
            >
              {image.description}
            </Text>
          </mesh>
        )}

        {isZoomed && (
          <mesh position={[0, -height / 2 - 0.22, -0.04]}>
            <group position={[0, 0, 0.06]}>
              <Text
                fontSize={0.06}
                color="#303030"
                font="/fonts/Inter_28pt-SemiBold.ttf"
                textAlign="center"
              >
                {`"${image.title}"\n${image.date}\n${image.artist}\n${image.size}`}
              </Text>
            </group>
            <boxGeometry args={[1, 0.2, 0.1]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>
    );
  }
);

export default Frame;