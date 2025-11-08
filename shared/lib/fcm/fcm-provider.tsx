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
        setupNotificationChannel();

        processManager.execute();
        (async () => {
            console.log(await SecureStore.getItemAsync("fcm-token"))
        })();

        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {

            const notificationData = remoteMessage.notification;
            const data = remoteMessage.data || {};

            if (notificationData) {
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
                    trigger: trigger,
                });
            }
        });

        // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //     console.log('Expo 포그라운드 알림 리스너 수신:', notification);
        // });

        // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //     console.log('알림 탭:', response);
        // });

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

