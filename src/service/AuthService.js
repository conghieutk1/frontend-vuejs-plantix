// Trong file AuthService.js
import axios from '../../axios.js';
import { useAuthStore } from '../stores/storeAuth';
import { mapActions, storeToRefs } from 'pinia';
import auth from '../../fỉebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
const loginService = async (email, password, router) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await signInWithEmailAndPassword(auth, email, password);
            // const response = await axios.post('/auth/login', { email, password });
            console.log('response.data', response);
            const user = {
                email: response.user.email,
                phoneNumber: response.user.phoneNumber,
                photoURL: response.user.photoURL,
                accessToken: response.user.stsTokenManager.accessToken,
                expirationTime: response.user.stsTokenManager.expirationTime
            };
            console.log('user', user);
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('tokenExpiration', user.expirationTime);
            // Lưu thông tin người dùng vào pinia
            let authStore = useAuthStore();
            authStore.setUserAndToken(user, response.user.stsTokenManager.expirationTime);
            router.replace('/manage-system/manage-user');
            resolve('Đăng nhập thành công!');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorCode', errorCode);
            console.log('errorMessage', errorMessage);
            if (errorCode === 'auth/invalid-credential') {
                reject('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
            } else if (errorCode === 'auth/too-many-requests') {
                reject('Số lần đăng nhập không thành công của bạn đã vượt quá giới hạn. Vui lòng thử lại sau.');
            } else {
                reject('Lỗi xác thực. Vui lòng thử lại sau');
            }
            throw new Error(error);
        }
    });
};

export default {
    loginService
};
