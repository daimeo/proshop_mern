import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS,
    CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
    CART_SAVE_SHIPPING_ADDRESS_REQUEST,
    CART_SAVE_SHIPPING_ADDRESS_FAIL,
    CART_GET_SHIPPING_ADDRESS_REQUEST,
    CART_GET_SHIPPING_ADDRESS_SUCCESS,
    CART_GET_SHIPPING_ADDRESS_FAIL,
    CART_GET_SHIPPING_ADDRESS_RESET,
} from "../constants/cartConstants";

export const cartReducer = (
    state = { cartItems: [], shippingAddress: {} },
    action
) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;

            const existItem = state.cartItems.find(
                (x) => x.product === item.product
            );

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (x) => x.product !== action.payload
                ),
            };
        case CART_SAVE_SHIPPING_ADDRESS_SUCCESS:
            return {
                ...state,
                shippingAddress: action.payload,
            };
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            };
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};

export const cartAddressReducer = (state = { shippingAddress: {} }, action) => {
    switch (action.type) {
        case CART_SAVE_SHIPPING_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CART_SAVE_SHIPPING_ADDRESS_SUCCESS:
            return {
                loading: false,
                success: true,
                address: action.payload,
            };
        case CART_SAVE_SHIPPING_ADDRESS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const cartGetAddress = (state = { address: {} }, action) => {
    switch (action.type) {
        case CART_GET_SHIPPING_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CART_GET_SHIPPING_ADDRESS_SUCCESS:
            return {
                loading: false,
                success: true,
                address: action.payload,
            };
        case CART_GET_SHIPPING_ADDRESS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CART_GET_SHIPPING_ADDRESS_RESET:
            return {
                address: {},
            };
        default:
            return state;
    }
};
