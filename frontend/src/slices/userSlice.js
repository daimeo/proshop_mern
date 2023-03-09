import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_RESET,
    USER_DETAILS_SUCCESS,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_RESET,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_PROFILE_RESET,
    USER_DISABLE_FAIL,
    USER_DISABLE_SUCCESS,
    USER_DISABLE_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAIL,
    USER_LOGOUT_REQUEST,
} from "../constants/userConstants";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    loading: false,
    error: null,
    success: false,
    userDetails: { userInfo: {} },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLoginRequest: (state) => {
            state.loading = true;
        },
        userLoginSuccess: (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
        },
        userLoginFail: (state, action) => {
            state.loading = false;
            state.userInfo = null;
            state.error = action.payload;
        },
        userRegisterRequest: (state) => {
            state.loading = true;
        },
        userRegisterSuccess: (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            state.error = null;
        },
        userRegisterFail: (state, action) => {
            state.loading = false;
            state.userInfo = null;
            state.error = action.payload;
        },
        userLogout: (state) => {
            state.userInfo = null;
        },
        userDetailsRequest: (state = { userInfo: {} }, action) => {
            return { ...state, loading: true };
            // state.userDetails = {
            //     ...state,
            //     loading: true,
            // };
        },
        userDetailSuccess: (state = { userInfo: {} }, action) => {
            return {
                loading: false,
                userInfo: action.payload,
                // error: null,
            };
        },
        userDetailFail: (state = { userInfo: {} }, action) => {
            return {
                loading: false,
                // userInfo: state.userDetails,
                error: action.payload,
            };
        },
        userDetailReset: (state = { userInfo: {} }, action) => {
            return {};
        },
        userDetailUpdateRequest: (state = {}, action) => {
            state.loading = true;
        },
        userDetailUpdateSuccess: (state = {}, action) => {
            state.loading = false;
            state.userInfo = action.payload;
            state.success = true;
        },
        userDetailUpdateFail: (state = {}, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },
        userDetailUpdateReset: (state = {}, action) => {
            return {};
        },
    },
});

export const userListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true };
        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload };
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload };
        case USER_LIST_RESET:
            return { users: [] };
        default:
            return state;
    }
};

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true };
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true };
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true };
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_RESET:
            return {
                user: {},
            };
        default:
            return state;
    }
};

export const userDisableReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_DISABLE_REQUEST:
            return { loading: true };
        case USER_DISABLE_SUCCESS:
            return { loading: false, success: true };
        case USER_DISABLE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userLogoutReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_LOGOUT_REQUEST:
            return { loading: true };
        case USER_LOGOUT_SUCCESS:
            return { loading: false, success: true, userInfo: action.payload };
        case USER_LOGOUT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
