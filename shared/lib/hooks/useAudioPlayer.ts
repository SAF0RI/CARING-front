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
      if (status.playing) {
        await player.pause();
      } else {
        // 일시정지 상태면 재개, 아니면 처음부터 재생
        if (status.isLoaded && !status.didJustFinish) {
          await player.play();
        } else {
          // 재생이 끝난 상태면 처음부터 다시 재생
          await player.seekTo(0);
          await player.play();
        }
      }
    } else {
      if (status.playing) {
        await player.pause();
      }

      if (currentAudioUri === audioUri && status.isLoaded) {
        await player.seekTo(0);
        setPlayingId(diaryId);
        await player.play();
      } else {
        setPlayingId(diaryId);
        setCurrentAudioUri(audioUri);
      }
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
