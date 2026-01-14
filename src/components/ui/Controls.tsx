import React, { useState, useEffect, useRef } from "react";
import { Keyboard, Info, Volume2, VolumeX } from "lucide-react";

interface ControlsProps {
  style?: React.CSSProperties;
}

const Controls: React.FC<ControlsProps> = ({ style }) => {
  const [displaySettings, setDisplaySettings] = useState<
    "none" | "information" | "settings"
  >("none");
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/bgmusic.mp3");
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.06;
    audioRef.current = audio;

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error(
            "Error playing audio waiting for user interaction",
            error
          );
        });
      }
    };

    playAudio();

    const handleUserInteraction = () => {
      playAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.06;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div style={style}>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={toggleMute}
          className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors"
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <Volume2 size={20} className="text-white" />
          )}
        </button>

        <button
          onClick={() =>
            setDisplaySettings((prev) =>
              prev === "settings" ? "none" : "settings"
            )
          }
          className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          <Keyboard size={20} className="text-white" />
        </button>
        <button
          onClick={() =>
            setDisplaySettings((prev) =>
              prev === "information" ? "none" : "information"
            )
          }
          className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          <Info size={20} className="text-white" />
        </button>
      </div>

      {displaySettings === "settings" && (
        <div className="absolute bottom-20 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg text-white w-96">
          <h3 className="text-lg font-semibold mb-2">Controls</h3>

          <h5 className="font-semibold">Iniciar a visita Guiada</h5>
          <ul className="text-sm">
            <li>• Clica em "Iniciar a visita guiada" para visualizares as obras.</li>
            <li>
              • Utiliza a seta da esquerda (←) e direita (→) ou os botões do ecrã para navegares pelas obras.
            </li>
          </ul>
          <h5 className="mt-3 font-semibold">Explorar livremente</h5>
          <ul className="text-sm">
            <li>• Clica em qualquer obra para a visualizares diretamente</li>
            <li>
              • A partir daí, podes utilizar as setas ou os botões do ecrã para navegares entre obras.
            </li>
          </ul>

          <h5 className="mt-3 font-semibold">Sair da visita</h5>
          <ul className="text-sm">
            <li>
              • Pressiona Esc, ou clica na obra que estás a visualizar para voltar ao ínicio.
            </li>
          </ul>

          <h5 className="mt-3 font-semibold">Áudio</h5>
          <ul className="text-sm">
            <li>• Clica no ícone de som para ligar/desligar a música de fundo.</li>
          </ul>
        </div>
      )}

      {displaySettings === "information" && (
        <div className="absolute bottom-20 right-4 bg-black/80 backdrop-blur-md p-4 rounded-lg text-white w-96">
          <h3 className="text-lg font-semibold mb-2">Informação</h3>
          <p>
            Bem-vindo/a ao "O Meu Museu Imaginário: Intrínseco".
          </p>
          <br/>
          <p>
            Trabalho realizado por Maria Clara Lourenço, no âmbito da Unidade Curricular História da Arte: Arte Moderna e Contemporânea, na Licenciatura de Gestão do Património Cultural.
          </p>
          <br/>
          <p>
            Docente: Prof. Doutor António Silva
          </p>
          <p>
            Ano Letivo: 2025/2026
          </p>
          <br/>
          <p>
            "Metal Bench" modelo 3D por{" "}
            <a
              href="https://sketchfab.com/JanStano"
              target="_blank"
              className="underline"
            >
              JanStano
            </a>
          </p>
          <br />
          <p>
            Desenvolvido por{" "}
            <a
              href="https://x.com/tymek_dev"
              target="_blank"
              className="underline"
            >
              @tymek_dev
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Controls;
