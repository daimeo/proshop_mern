import axios from "axios";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_REQUEST,
    ORDER_PAY_FAIL,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_REQUEST,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_FAIL,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_REQUEST,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_REQUEST,
    ORDER_CANCEL_FAIL,
    ORDER_CANCEL_REQUEST,
    ORDER_CANCEL_SUCCESS,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_FAIL,
} from "../constants/orderConstants";
import { logout } from "./userActions";

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`/api/orders`, order, config);

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });
        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data,
        });
        localStorage.removeItem("cartItems");
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        // console.log("{userInfo}" + JSON.stringify(userInfo));
        //
        // console.log("ORDER ACTION: " + JSON.stringify(userInfo.token));

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/${id}`, config);

        // console.log("{DATA}" + JSON.stringify(data));

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: message,
        });
    }
};

export const payOrder =
    (orderId, paymentResult) => async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_PAY_REQUEST,
            });

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(
                `/api/orders/${orderId}/pay`,
                paymentResult,
                config
            );

            dispatch({
                type: ORDER_PAY_SUCCESS,
                payload: data,
            });
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (message === "Not authorized, token failed") {
                dispatch(logout());
            }
            dispatch({
                type: ORDER_PAY_FAIL,
                payload: message,
            });
        }
    };

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(
            `/api/orders/${order._id}/deliver`,
            {},
            config
        );

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: message,
        });
    }
};

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/myorders`, config);

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: message,
        });
    }
};

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders`, config);

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: message,
        });
    }
};

export const cancelOrder =
    (id, orderStatus, canceledAt) => async (dispatch, getState) => {
        // console.log("ACTION before try");
        try {
            dispatch({ type: ORDER_CANCEL_REQUEST });

            // console.log(
            //     "ACTION after dispatch REQUEST: " +
            //         JSON.stringify(dispatch({ type: ORDER_CANCEL_REQUEST }))
            // );

            const {
                userLogin: { userInfo },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // console.log("USER TOKEN: " + userInfo.token);

            // console.log("order ID in Action: " + id);

            // console.log(
            //     "cancelOrder user TOKEN: " + JSON.stringify(userInfo.token)
            // );
            // console.log("ACTION BEFORE Axios");

            // PUT must have data if function do not send data then axios must give an empty object {}
            const { data } = await axios.put(
                `/api/orders/${id}`,
                { orderStatus, canceledAt },
                config
            );
            // axios.interceptors.request.use(data);

            // console.log("***** ACTION AFTER Axios *****" + JSON.stringify(data));

            // console.log("order ID: " + id);

            // console.log("DATA: " + JSON.stringify(data));
            // console.log("ACTION before dispatch SUCCESS");

            dispatch({ type: ORDER_CANCEL_SUCCESS, payload: data });
            // dispatch({ type: ORDER_CANCEL_SUCCESS });
            // console.log("ACTION after dispatch SUCCESS");
        } catch (e) {
            const message =
                e.response && e.response.data.message
                    ? e.response.data.message
                    : e.message;
            if (message === "Not authorized, token failed") {
                dispatch(logout());
            }
            console.log("ACTION FAILED");
            dispatch({
                type: ORDER_CANCEL_FAIL,
                payload: message,
            });
        }
    };

export const deleteOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELETE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/orders/${id}`, config);

        dispatch({ type: ORDER_DELETE_SUCCESS, config });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({
            type: ORDER_DELETE_FAIL,
            payload: message,
        });
    }
};
