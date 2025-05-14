import {configureStore} from '@reduxjs/toolkit';
import authReducer from './rootReducer';
import { authApi } from '@/features/api/authApi';
import { courseApi } from '@/features/api/courseApi';
import { purchaseApi } from '@/features/api/purchaseApi';
import { courseProgressApi } from '@/features/api/courseProgressApi';

export const appStore = configureStore({
    reducer: authReducer,
    middleware: (DefaultMiddleware) => DefaultMiddleware().concat(
        authApi.middleware,
        courseApi.middleware,
        purchaseApi.middleware, 
        courseProgressApi.middleware,
    ),
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
}
initializeApp();
