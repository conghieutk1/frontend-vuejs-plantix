// import các module cần thiết
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from '../../axios.js';

// Khởi tạo store để quản lý người dùng
export const useUserStore = defineStore('user', {
    // Trạng thái ban đầu
    state: () => ({
        users: [], // Mảng chứa danh sách người dùng
        currentPage: 1, // Trang hiện tại
        perPage: 10, // Số lượng người dùng trên mỗi trang
        totalUsers: 0 // Tổng số người dùng
    }),

    // Các hàm getters để lấy dữ liệu từ trạng thái
    getters: {
        // Tính toán tổng số trang dựa trên tổng số người dùng và số lượng trên mỗi trang
        totalPages: (state) => Math.ceil(state.totalUsers / state.perPage)
    },

    // Các hàm mutations để thay đổi trạng thái
    actions: {
        async createNewUser(user) {
            try {
                const response = await axios.post('/api/users', user);
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        },
        // Hàm để lấy danh sách người dùng từ API
        async fetchUsers() {
            try {
                // Gọi API để lấy danh sách người dùng
                const response = await fetch(`/api/users?page=${this.currentPage}&perPage=${this.perPage}`);
                const data = await response.json();

                // Cập nhật trạng thái với dữ liệu mới
                this.users = data.users;
                this.totalUsers = data.totalUsers;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        // Hàm để chuyển đến trang kế tiếp
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchUsers(); // Gọi lại hàm fetchUsers để lấy dữ liệu trang mới
            }
        },

        // Hàm để chuyển đến trang trước đó
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchUsers(); // Gọi lại hàm fetchUsers để lấy dữ liệu trang mới
            }
        }
    }
});
