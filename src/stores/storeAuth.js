import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        tokenExpiration: localStorage.getItem('tokenExpiration') || null
    }),
    getters: {
        // Kiểm tra xem người dùng có đăng nhập hay không (trả về true nếu có và false nếu không)
        isAuthenticated: (state) => !!state.user && state.tokenExpiration > Date.now(),

        // Trả về tên người dùng nếu có, ngược lại trả về một chuỗi rỗng
        userName: (state) => (state.user ? state.user.email : '') // Sửa lại để lấy email thay vì name
    },
    actions: {
        setUserAndToken(user, tokenExpiration) {
            this.user = user;
            this.tokenExpiration = tokenExpiration;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('tokenExpiration', tokenExpiration);
        },
        clearUserAndToken() {
            this.user = null;
            this.tokenExpiration = null;
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
        },
        checkAuth() {
            const expirationTime = localStorage.getItem('tokenExpiration');
            if (expirationTime && Number(expirationTime) > Date.now()) {
                this.user = JSON.parse(localStorage.getItem('user'));
                this.tokenExpiration = expirationTime;
            } else {
                this.clearUserAndToken();
            }
        },
        logout() {
            console.log('111111111111');
            this.clearUserAndToken();
        }
    }
});
