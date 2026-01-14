import React, { useState, useEffect } from "react";
import { ImageMetadata } from "./types/museum";
import { drawingImages } from "./config/imagesConfig";
import SwipeableContainer from "./components/ui/SwipeableContainer";
import { TourProvider } from "./contexts/TourContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import Scene from "./components/Scene";
import UIElements from "./components/ui/UIElements";

function App() {
  const [images, setImages] = useState<ImageMetadata[]>([]);

  useEffect(() => {
    setImages(drawingImages);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <AnimationProvider>
        <TourProvider totalFrames={images.length}>
          <SwipeableContainer>
            <Scene images={images} />
            <UIElements />
          </SwipeableContainer>
        </TourProvider>
      </AnimationProvider>
    </div>
  );
}

export default App;
