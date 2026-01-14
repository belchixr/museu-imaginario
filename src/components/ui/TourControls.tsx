import React, { useEffect } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useDetectGPU } from "@react-three/drei";
import { useTour } from "../../contexts/TourContext";

const TourControls: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { isMobile } = useDetectGPU();

  const {
    isTourStarted,
    currentFrameIndex,
    totalFrames,
    startTour,
    nextFrame,
    previousFrame,
    quitTour,
  } = useTour();

  // Keyboard controls management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTourStarted) {
        // If tour hasn't started, space or enter to start
        if (event.key === " " || event.key === "Enter") {
          startTour();
        }
      } else {
        // If tour is in progress
        switch (event.key) {
          case "ArrowRight":
          case "d":
            if (currentFrameIndex < totalFrames - 1) {
              nextFrame();
            }
            break;
          case "ArrowLeft":
          case "q":
          case "a":
            if (currentFrameIndex > 0) {
              previousFrame();
            }
            break;
          case "Escape":
            quitTour();
            break;
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isTourStarted,
    currentFrameIndex,
    totalFrames,
    startTour,
    nextFrame,
    previousFrame,
    quitTour,
  ]);

  if (!isTourStarted) {
    return (
      <div style={style}>
        <div className="fixed bottom-8 md:bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4 items-center">
          <button
            onClick={startTour}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 md:px-10 md:py-4 rounded-full text-white flex items-center gap-3 shadow-lg"
          >
            <Play size={isMobile ? 18 : 24} />
            <span className="text-md md:text-lg font-semibold">
              Iniciar a visita guiada
            </span>
          </button>
          <div className="text-white/60 text-xs mt-2 absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {isMobile ? "Clica para iniciar" : "Pressiona Espaço ou Enter para começar"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={style}>
      <div
        className="fixed bottom-8 md:bottom-16 left-6 md:left-12 flex gap-4 items-center bg-black/40 backdrop-blur-md p-2 rounded-full shadow-lg"
        style={{ width: "auto", height: "auto" }}
      >
        <button
          onClick={previousFrame}
          disabled={currentFrameIndex === 0}
          className={`bg-white/20 p-2 rounded-full text-white w-[36px] h-[36px] flex items-center justify-center
          ${
            currentFrameIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white/30"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-white bg-white/10 px-4 py-1 rounded-full text-sm font-medium min-w-[80px] text-center">
          {currentFrameIndex + 1} / {totalFrames}
        </div>

        <button
          onClick={nextFrame}
          disabled={currentFrameIndex === totalFrames - 1}
          className={`bg-white/20 p-2 rounded-full text-white w-[36px] h-[36px] flex items-center justify-center
          ${
            currentFrameIndex === totalFrames - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white/30"
          }`}
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={quitTour}
          className="bg-white/10 hover:bg-white/20 px-1 py-1 rounded-full text-white flex items-center gap-1 ml-2"
          title="Sair da visita (Esc)"
        >
          <X size={14} />
        </button>

        <div className="text-white/60 text-xs absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {isMobile ? "Clica ou arrasta para navegar " : "← Q/A → D | Esc para sair"}
        </div>
      </div>
    </div>
  );
};

export default TourControls;
