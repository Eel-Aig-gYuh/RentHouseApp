import axios from "axios";

// client ID: 847424964800-gnvdrm90eivkd9fc7h5oo2dvoha41sv1.apps.googleusercontent.com

const BASE_URL = "https://renthouseapiv2-production.up.railway.app"

export const endpoints = {
    // đăng nhập.
    'login': '/o/token/',
    'loginWithGoogle': '/account/login/google-oauth2/',

    // đăng ký.
    'register': '/account/register/',
    
    // user.
    'current-user': '/users/current_user/',
    'users': (userId) => `/users/${userId}/`,
    'user-statictics':'/users/count_user/',

    // rental post,
    'rental-post': '/rental_post/',
    'rental-post-detail': (rentalPostId) => `/rental_post/${rentalPostId}/`,

    'rental-post-savePosts': '/rental_post/saved_posts/',
    'rental-post-save_savePosts': '/rental_post/save_post/',
    'rental-post-delete_savePosts': (rentalPostId) => `/rental_post/${rentalPostId}/delete_saved_post/`,
    'rental-post-admin-changedStatus': '/rental_post/change_post_status/',

    // find post,
    'find-room-post': '/find_room_post/',
    'find-room-post/my-find-room-post': '/find_room_post/my_find_room_posts/',
    'find-room-post/postId': (postId) => `/find_room_post/${postId}/`,

    // comment
    'comment': '/comment/',
    'delete-comment': (cmtId) => `/comment/${cmtId}/`,

    'post-follow': '/follow/',
    'post-unfollow': '/follow/unfollow/',
    'get-follow-count-follower': 'follow/count_follower/',
    'get-follow-following': 'follow/following/'

    
}

export const authApi = (accessToken) => {
    return axios.create({
        baseURL: BASE_URL,
        timeout: 10000,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});
