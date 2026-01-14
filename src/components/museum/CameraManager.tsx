import React, {
    useRef,
    useCallback,
    useContext,
    useEffect,
} from "react";
import * as THREE from "three";
import { CameraControls, useDetectGPU } from "@react-three/drei";
import { ZoomContext } from "../../contexts/ZoomContext";
import { useThree } from "@react-three/fiber";

interface CameraManagerProps {
    onFrameChange?: (index: number) => void;
    currentFrameIndex: number;
    frameRefs: React.MutableRefObject<(THREE.Mesh | null)[]>;
    imagesCount: number;
}

const DOUBLE_FRAME_CAMERA_SHIFT = 1.5;
const DOUBLE_FRAME_EXTRA_X = 0.5;

const CameraManager: React.FC<CameraManagerProps> = ({
    onFrameChange,
    currentFrameIndex,
    frameRefs,
    imagesCount,
}) => {
    const { isMobile } = useDetectGPU();
    const cameraControlsRef = useRef<CameraControls>(null);
    const { setZoomedFrameId } = useContext(ZoomContext);
    const { viewport } = useThree();

    useEffect(() => {
        setZoomedFrameId(
            currentFrameIndex >= 0 ? currentFrameIndex : null
        );
    }, [currentFrameIndex, setZoomedFrameId]);

    const getScaleFactor = useCallback(() => {
        const base = 2.5;
        if (isMobile) return viewport.width < 2 ? 6.5 : viewport.width < 4 ? 5 : 4.5;
        return viewport.width / viewport.height > 2 ? base * 1.2 : base;
    }, [isMobile, viewport]);

    const getYOffset = useCallback(() => {
        if (isMobile) return viewport.width < 2 ? 0.4 : viewport.width < 4 ? 0.35 : 0.3;
        return 0.1;
    }, [isMobile, viewport.width]);

    const zoomToFrame = useCallback(
        async (index: number) => {
            if (!cameraControlsRef.current) return;

            const mesh = frameRefs.current[index];
            if (!mesh) return;

            const box = new THREE.Box3().setFromObject(mesh);
            const center = box.getCenter(new THREE.Vector3());

            const isDoubleFrame = mesh.userData?.isDoubleFrame === true;

            const front = new THREE.Vector3(0, 0, 1)
                .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
                .normalize()
                .multiplyScalar(getScaleFactor());

            const cameraPos = center.clone().add(front);

            if (isDoubleFrame) {
                cameraPos.x += DOUBLE_FRAME_EXTRA_X;
                cameraPos.z += DOUBLE_FRAME_CAMERA_SHIFT;
                center.x += DOUBLE_FRAME_CAMERA_SHIFT * 2 + 2;
            }

            await cameraControlsRef.current.setLookAt(
                cameraPos.x,
                cameraPos.y - getYOffset(),
                cameraPos.z,
                center.x,
                center.y - getYOffset(),
                center.z,
                true
            );

            onFrameChange?.(index);
        },
        [frameRefs, onFrameChange, getScaleFactor, getYOffset]
    );

    const resetCamera = useCallback(async () => {
        if (!cameraControlsRef.current) return;
        await cameraControlsRef.current.setLookAt(0, 2, 14, 0, 0, 0, true);
        onFrameChange?.(-1);
    }, [onFrameChange]);

    useEffect(() => {
        if (currentFrameIndex >= 0 && currentFrameIndex < imagesCount)
            zoomToFrame(currentFrameIndex);
        else if (currentFrameIndex === -1) resetCamera();
    }, [currentFrameIndex, imagesCount, zoomToFrame, resetCamera]);

    return (
        <CameraControls
            ref={cameraControlsRef}
            events
            mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
            touches={{ one: 0, two: 0, three: 0 }}
        />
    );
};

export { CameraManager, type CameraManagerProps };