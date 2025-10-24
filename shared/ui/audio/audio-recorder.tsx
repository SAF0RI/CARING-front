import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorderState,
    useAudioRecorder as useExpoAudioRecorder
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';

export type RecordingStatus = 'idle' | 'recording' | 'paused';

export interface AudioSegment {
    uri: string;
    duration: number;
    startTime: number;
}

export interface AudioRecorderState {
    status: RecordingStatus;
    currentDuration: number;
    segments: AudioSegment[];
    isRecording: boolean;
    isPaused: boolean;
}

export interface AudioRecorderProps {
    onStatusChange?: (status: AudioRecorderState) => void;
    onError?: (error: string) => void;
}

export function useAudioRecorder({ onStatusChange, onError }: AudioRecorderProps = {}) {
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [currentDuration, setCurrentDuration] = useState(0);
    const [segments, setSegments] = useState<AudioSegment[]>([]);
    const [audioLevel, setAudioLevel] = useState(0);
    const [waveformData, setWaveformData] = useState<number[]>([]);

    // expo-audio의 useAudioRecorder 훅 사용
    const audioRecorder = useExpoAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);

    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);

    // 권한 요청
    useEffect(() => {
        const requestPermissions = async () => {
            try {
                const permissionStatus = await AudioModule.requestRecordingPermissionsAsync();
                if (!permissionStatus.granted) {
                    onError?.('녹음 권한이 필요합니다.');
                }
            } catch {
                onError?.('권한 요청 중 오류가 발생했습니다.');
            }
        };

        requestPermissions();
    }, [onError]);

    // 오디오 모드 설정
    useEffect(() => {
        const setupAudio = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    allowsRecording: true,
                });
            } catch {
                onError?.('오디오 설정 중 오류가 발생했습니다.');
            }
        };

        setupAudio();
    }, [onError]);

    // 상태 변경 시 콜백 호출
    useEffect(() => {
        const state: AudioRecorderState = {
            status,
            currentDuration,
            segments,
            isRecording: status === 'recording',
            isPaused: status === 'paused',
        };
        onStatusChange?.(state);
    }, [status, currentDuration, segments, onStatusChange]);

    // expo-audio의 recorderState와 동기화 (무한 루프 방지)
    useEffect(() => {
        if (recorderState.isRecording && status !== 'recording' && status !== 'paused') {
            setStatus('recording');
            startTimeRef.current = Date.now();
            // pausedTimeRef는 초기화하지 않음 (일시정지된 시간 보존)

            // 타이머 시작
            intervalRef.current = setInterval(() => {
                const elapsed = (Date.now() - startTimeRef.current + pausedTimeRef.current) / 1000;
                setCurrentDuration(elapsed);

                // 오디오 레벨 시뮬레이션 (expo-audio에서는 직접적인 metering이 제한적)
                const newAudioLevel = Math.random() * 0.8 + 0.2; // 0.2 ~ 1.0 사이의 랜덤 값
                setAudioLevel(newAudioLevel);

                // 파형 데이터 추가
                const newBarHeight = Math.max(0.1, Math.min(1, newAudioLevel + Math.random() * 0.3));
                setWaveformData(prev => [...prev, newBarHeight]);
            }, 100);
        } else if (!recorderState.isRecording && status === 'recording') {
            // paused 상태가 아닐 때만 idle로 변경
            setStatus('idle');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [recorderState.isRecording, status]); // status 의존성 추가

    // 녹음 시작
    const startRecording = async () => {
        try {
            if (status === 'recording') return;

            // 새로운 녹음 시작 시에만 pausedTimeRef 초기화
            if (status === 'idle') {
                pausedTimeRef.current = 0;
            }

            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
        } catch (error) {
            console.error('녹음 시작 오류:', error);
            onError?.(`녹음 시작 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    // 녹음 일시정지
    const pauseRecording = async () => {
        try {
            if (status !== 'recording') return;

            // 실제 녹음은 중지하되 상태는 paused로 유지
            await audioRecorder.stop();
            setStatus('paused');

            // 일시정지된 시간 기록
            pausedTimeRef.current += Date.now() - startTimeRef.current;

            // 타이머 중지
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } catch {
            onError?.('녹음 일시정지 중 오류가 발생했습니다.');
        }
    };

    // 녹음 재개
    const resumeRecording = async () => {
        try {
            if (status !== 'paused') return;

            // 새로운 녹음 세션 시작
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();

            // 상태를 recording으로 변경 (recorderState 동기화가 처리함)
            // startTimeRef와 타이머는 recorderState 동기화에서 처리됨
        } catch {
            onError?.('녹음 재개 중 오류가 발생했습니다.');
        }
    };

    // 녹음 완료
    const stopRecording = async () => {
        try {
            if (!recorderState.isRecording) return;

            await audioRecorder.stop();

            // 녹음된 파일 URI 가져오기
            const uri = audioRecorder.uri;
            if (uri) {
                const newSegment: AudioSegment = {
                    uri,
                    duration: currentDuration,
                    startTime: segments.length > 0 ? segments[segments.length - 1].startTime + segments[segments.length - 1].duration : 0,
                };

                setSegments(prev => [...prev, newSegment]);
            }

            setStatus('idle');
            setCurrentDuration(0);
            setAudioLevel(0);

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } catch {
            onError?.('녹음 완료 중 오류가 발생했습니다.');
        }
    };

    // 녹음 취소
    const cancelRecording = async () => {
        try {
            if (recorderState.isRecording) {
                await audioRecorder.stop();
            }

            setStatus('idle');
            setCurrentDuration(0);
            setAudioLevel(0);

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } catch {
            onError?.('녹음 취소 중 오류가 발생했습니다.');
        }
    };

    // 모든 세그먼트 삭제
    const clearSegments = () => {
        setSegments([]);
        setCurrentDuration(0);
        setWaveformData([]);
        pausedTimeRef.current = 0; // 일시정지된 시간도 초기화
    };

    // 정리
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        status,
        currentDuration,
        segments,
        audioLevel,
        waveformData,
        isRecording: status === 'recording',
        isPaused: status === 'paused',
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        cancelRecording,
        clearSegments,
    };
}