import {
  useAudioPlayerStatus,
  useAudioPlayer as useExpoAudioPlayer,
} from "expo-audio";
import { useEffect, useState } from "react";

interface UseAudioPlayerOptions {
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  onError?: (error: any) => void;
}

export const useAudioPlayer = (options?: UseAudioPlayerOptions) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudioUri, setCurrentAudioUri] = useState<string>("");

  const player = useExpoAudioPlayer(currentAudioUri, {
    updateInterval: 1,
  });
  const status = useAudioPlayerStatus(player);

  // 오디오 URI가 변경될 때 자동 재생
  useEffect(() => {
    if (playingId && currentAudioUri && status.isLoaded) {
      const playAudio = async () => {
        try {
          await player.play();
          options?.onPlayStart?.();
        } catch (error) {
          console.error("오디오 재생 실패:", error);
          options?.onError?.(error);
        }
      };
      playAudio();
    }
  }, [playingId, currentAudioUri, status.isLoaded, player]);

  // 오디오 종료 감지
  useEffect(() => {
    if (status.didJustFinish && playingId) {
      setPlayingId(null);
      options?.onPlayEnd?.();
    }
  }, [status.didJustFinish, playingId]);

  const playAudio = async (diaryId: string, audioUri: string) => {
    if (playingId === diaryId) {
      // 같은 오디오 클릭 - 토글
      if (status.playing) {
        await player.pause();
      } else {
        await player.play();
      }
    } else {
      // 다른 오디오 클릭 - 이전 재생 중지 후 새 재생
      if (status.playing) {
        await player.pause();
      }
      setPlayingId(diaryId);
      setCurrentAudioUri(audioUri);
    }
  };

  const stopAudio = async () => {
    if (status.playing) {
      await player.pause();
    }
    setPlayingId(null);
    setCurrentAudioUri("");
  };

  const isPlaying = (diaryId: string) =>
    playingId === diaryId && status.playing;
  const isBuffering = (diaryId: string) =>
    playingId === diaryId && status.isBuffering;

  return {
    playingId,
    currentAudioUri,
    player,
    status,
    playAudio,
    stopAudio,
    isPlaying,
    isBuffering,
  };
};
