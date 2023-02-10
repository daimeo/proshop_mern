import axios from "axios";
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS_REQUEST,
    CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
    CART_SAVE_SHIPPING_ADDRESS_FAIL,
    CART_GET_SHIPPING_ADDRESS_REQUEST,
    CART_GET_SHIPPING_ADDRESS_SUCCESS,
    CART_GET_SHIPPING_ADDRESS_FAIL,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
        },
    });

    localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
    );
};

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    });

    localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
    );
};

export const saveShippingAddress = (address) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CART_SAVE_SHIPPING_ADDRESS_REQUEST,
            // payload: data,
        });
        console.log("ADDRESS: " + JSON.stringify(address));

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`/api/cart/address`, address, config);
        console.log("DATA ADDRESS: " + JSON.stringify(data));

        dispatch({
            type: CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
            payload: data,
        });

        localStorage.setItem("shippingAddress", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: CART_SAVE_SHIPPING_ADDRESS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getShippingAddress = (userId) => async (dispatch) => {
    try {
        dispatch({
            type: CART_GET_SHIPPING_ADDRESS_REQUEST,
        });

        const { data } = await axios.get(`/api/cart/address`, userId);

        dispatch({ type: CART_GET_SHIPPING_ADDRESS_SUCCESS, payload: data });

        localStorage.setItem("shippingAddress", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: CART_GET_SHIPPING_ADDRESS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });

    localStorage.setItem("paymentMethod", JSON.stringify(data));
};
