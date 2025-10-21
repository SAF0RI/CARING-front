import { ProcessManager } from '@/shared/util/process';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { requestUserPermissionProcess } from './fcm-processes';
import { getTokenAndSaveTokenProcess } from './token-management';

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {

    const processManager = new ProcessManager({
        processes: [
            requestUserPermissionProcess,
            getTokenAndSaveTokenProcess
        ]
    })

    useEffect(() => {
        processManager.execute();
        (async () => {
            console.log(await SecureStore.getItemAsync("fcm-token"))
        })();
    }, []);

    return (
        <>{children}</>
    );
};

