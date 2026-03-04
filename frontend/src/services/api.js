import axios from "axios";

// Axios Instance Configuration
const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

// Request Interceptor: Auth Token automatically 
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && token !== "undefined" && token !== "null") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session Expired. Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (!window.location.pathname.includes("/login")) {
                
            }
        }
        return Promise.reject(error);
    }
);

// Auth and User Profile
export const loginUser = async (userData) => {
    const res = await API.post("/user/login", userData);
    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res;
};
export const registerUser = (userData) => API.post("/user/register", userData);
export const updateProfileAPI = (data) => API.put(`/user/update/${data.userId}`, data);
export const changePasswordAPI = (data) => API.post(`/user/change-password/${data.userId}`, data);
export const changeSecurityPasswordAPI = (data) => API.post(`/user/change-security-password/${data.userId}`, data);
export const deleteAccountAPI = (id) => API.delete(`/user/delete/${id}`);

// Password Recovery
export const forgotPasswordAPI = (data) => API.post("/user/forgot-password", data);
export const resetPasswordAPI = (token, password) => API.post(`/user/reset-password/${token}`, { password });

// Admin Section
export const fetchAdminStats = () => API.get("/admin/all-data");
export const fetchAdminUsers = () => API.get("/admin/users");
export const deleteUserAdmin = (id) => API.delete(`/admin/user/${id}`);
export const disableUserAdmin = (id) => API.patch(`/admin/user/disable/${id}`);
export const fetchGlobalProgress = () => API.get("/admin/global-progress");
export const updateSystemSettingsAPI = (data) => API.put("/admin/update-system-settings", data);
export const broadcastMessageAPI = (data) => API.post("/admin/broadcast", data);
export const getGlobalSearch = (query) => API.get(`/admin/global-search?query=${query}`);

// Yoga rituals
export const addYogaTypeAPI = (yogaData) => API.post("/admin/yoga-types/add", yogaData);
export const fetchYogaLibrary = () => API.get("/admin/yoga-types");
export const deleteYogaTypeAPI = (id) => API.delete(`/admin/yoga-types/${id}`);

export const addSessionAPI = (data) => API.post("/sessions/add", {
    userId: data.userId,
    date: data.date,
    type: data.type,
    durationMinutes: data.durationMinutes
});
export const getSessionsAPI = (userId) => API.get(`/sessions/all/${userId}`);
export const completeSessionAPI = (id) => API.patch(`/sessions/${id}/complete`);
export const deleteSessionAPI = (id) => API.delete(`/sessions/${id}`);

// Planner and Nutrition
export const addPlanAPI = (data) => API.post("/plans/add", data);
export const getPlansAPI = (userId) => API.get(`/plans/all/${userId}`);
export const deletePlanAPI = (id) => API.delete(`/plans/delete/${id}`);
export const completePlanAPI = (id) => API.patch(`/plans/${id}/complete`);

// Nutrition and  Meals
export const fetchNutritionData = (userId) => API.get(`/nutrition/all/${userId}`);
export const saveMealPlanAPI = (data) => API.post("/nutrition/week/save", data);
export const fetchAvailableMeals = () => API.get("/nutrition/available-meals");
export const fetchProducts = () => API.get("/nutrition/available-meals");

// Favourites
export const getFavoritesAPI = () => API.get("/favorites");
export const addFavoriteAPI = (data) => API.post("/favorites", data);
export const deleteFavoriteAPI = (favoriteId) => API.delete(`/favorites/${favoriteId}`);

// Notifications
export const getMyNotificationsAPI = () => API.get("/notifications/me");
export const markNotificationReadAPI = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotificationsReadAPI = () => API.patch(`/notifications/read-all`);
export const deleteNotificationAPI = (id) => API.delete(`/notifications/${id}`);

// Api object export
const api = {
    API,
    registerUser,
    loginUser,
    updateProfileAPI,
    changePasswordAPI,
    changeSecurityPasswordAPI,
    deleteAccountAPI,
    forgotPasswordAPI,
    resetPasswordAPI,
    fetchAdminStats,
    fetchAdminUsers,
    deleteUserAdmin,
    updateSystemSettingsAPI,
    broadcastMessageAPI,
    getGlobalSearch,
    addYogaTypeAPI,
    fetchYogaLibrary,
    deleteYogaTypeAPI,
    addSessionAPI,
    getSessionsAPI,
    fetchNutritionData,
    saveMealPlanAPI,
    addPlanAPI,
    getPlansAPI,
    deletePlanAPI,
    completePlanAPI,
    fetchAvailableMeals,
    fetchProducts,
    getFavoritesAPI,
    addFavoriteAPI,
    deleteFavoriteAPI,
    getMyNotificationsAPI,
    markNotificationReadAPI,
    markAllNotificationsReadAPI,
    deleteNotificationAPI
};

export { API };
export default api;