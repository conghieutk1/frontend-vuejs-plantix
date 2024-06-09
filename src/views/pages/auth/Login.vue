<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import axios from '../../../../axios.js';
import AuthService from '../../../service/AuthService';
import { useRouter } from 'vue-router';

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);
const checkedLogin = ref(false);
const isCheckedTextAnimated = ref(false);
const checkedText = ref('');
const router = useRouter();

// Kiểm tra xem có thông tin đăng nhập đã lưu trong Local Storage không
const savedUserInfo = localStorage.getItem('userInfo');
if (savedUserInfo) {
    const { email: savedEmail, password: savedPassword } = JSON.parse(savedUserInfo);
    email.value = savedEmail;
    password.value = savedPassword;
    checked.value = true; // Đặt checked là true nếu có thông tin đăng nhập đã lưu
}

const handleLogin = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value) {
        checkedLogin.value = false;
        isCheckedTextAnimated.value = true;
        checkedText.value = 'Email không được bỏ trống!';
        return;
    }
    if (!email.value.match(emailPattern)) {
        checkedLogin.value = false;
        isCheckedTextAnimated.value = true;
        checkedText.value = 'Vui lòng nhập địa chỉ email hợp lệ!';
        return;
    }
    if (!password.value) {
        checkedLogin.value = false;
        isCheckedTextAnimated.value = true;
        checkedText.value = 'Mật khẩu không được bỏ trống!';
        return;
    }
    if (checked.value) {
        localStorage.setItem('userInfo', JSON.stringify({ email: email.value, password: password.value }));
    } else {
        localStorage.removeItem('userInfo');
    }
    console.log('Email:', email.value);
    console.log('Password:', password.value);
    console.log('Remember me:', checked.value);

    try {
        // Gửi yêu cầu POST đến API để xác thực đăng nhập
        let response = await AuthService.loginService(email.value, password.value, router);
        // let response = await axios.post('/auth/login', {
        //     email: email.value.trim(),
        //     password: password.value.trim()
        // });

        console.log(response);

        // Nếu cần chuyển hướng sau khi đăng nhập thành công, bạn có thể thực hiện ở đây
    } catch (error) {
        console.log(error);
        isCheckedTextAnimated.value = true;
        checkedText.value = error;
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
};

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Chào mừng bạn!</div>
                        <span class="text-600 font-medium">Đăng nhập để tiếp tục</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="email" placeholder="Email address" class="w-full md:w-30rem" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2 mt-5">Mật khẩu</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full md:w-30rem mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Ghi nhớ mật khẩu</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Quên mật khẩu?</a>
                        </div>
                        <div id="username-help" class="p-error block text-600 md:w-30rem font-medium mt-3" :class="{ 'fade-in': isCheckedTextAnimated }" v-if="!checkedLogin" @animationend="isCheckedTextAnimated = false" style="color: red !important">
                            {{ checkedText }}
                        </div>

                        <Button label="Đăng nhập" class="w-full md:w-30rem p-3 mt-5 text-xl" @click.prevent="handleLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
.fade-in {
    animation: fadein 0.5s; /* Định nghĩa hiệu ứng fade-in trong 1 giây */
}

@keyframes fadein {
    from {
        opacity: 0;
    } /* Bắt đầu với opacity là 0 */
    to {
        opacity: 1;
    } /* Kết thúc với opacity là 1 */
}
</style>
