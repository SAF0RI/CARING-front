import { ProcessManager } from '@/shared/util/process';
import messaging from '@react-native-firebase/messaging';
import { type EventSubscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
import { requestUserPermissionProcess } from './fcm-processes';
import { getTokenAndSaveTokenProcess } from './token-management';

// 포그라운드 알림 표시 설정
Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        console.log('포그라운드 알림 수신:', notification);
        return {
            shouldShowAlert: true, // deprecated이지만 호환성을 위해 유지
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        };
    },
});

const setupNotificationChannel = async () => {
    if (Platform.OS === 'android') {
        try {
            // 기존 채널이 있는지 확인
            const existingChannel = await Notifications.getNotificationChannelAsync('default');
            if (!existingChannel) {
                await Notifications.setNotificationChannelAsync('default', {
                    name: '기본 알림',
                    description: '기본 알림 채널',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                    sound: 'default',
                    enableVibrate: true,
                    enableLights: true,
                });
                console.log('안드로이드 알림 채널 설정 완료');
            }
        } catch (error) {
            console.error('알림 채널 설정 오류:', error);
        }
    }
};

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {

    const notificationListener = useRef<EventSubscription | undefined>(undefined);
    const responseListener = useRef<EventSubscription | undefined>(undefined);

    const processManager = useMemo(() => new ProcessManager({
        processes: [
            requestUserPermissionProcess,
            getTokenAndSaveTokenProcess
        ]
    }), []);

    useEffect(() => {
        // 안드로이드 알림 채널 설정
        setupNotificationChannel();

        processManager.execute();
        (async () => {
            console.log(await SecureStore.getItemAsync("fcm-token"))
        })();

        // FCM 포그라운드 메시지 리스너 (앱이 포그라운드에 있을 때)
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
            console.log('FCM 포그라운드 메시지 수신:', remoteMessage);

            // FCM 메시지를 Expo Notifications 형식으로 변환하여 표시
            const notificationData = remoteMessage.notification;
            const data = remoteMessage.data || {};

            if (notificationData) {
                // Expo Notifications로 알림 표시
                const notificationContent: Notifications.NotificationContentInput = {
                    title: notificationData.title || '',
                    body: notificationData.body || '',
                    data: data,
                    sound: true,
                };

                const trigger: Notifications.NotificationTriggerInput = Platform.OS === 'android'
                    ? { channelId: 'default' }
                    : null;

                await Notifications.scheduleNotificationAsync({
                    content: notificationContent,
                    trigger: trigger, // 안드로이드는 채널 ID 필요
                });
            }
        });

        // 포그라운드에서 알림 수신 시 처리 (Expo Notifications)
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Expo 포그라운드 알림 리스너 수신:', notification);
        });

        // 사용자가 알림을 탭했을 때 처리
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('알림 탭:', response);
            // 여기에 알림 탭 시 네비게이션 등의 로직 추가 가능
        });

        return () => {
            unsubscribeForeground();
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [processManager]);

    return (
        <>{children}</>
    );
};

