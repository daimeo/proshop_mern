import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems"))
            : [],
        shippingAddress: localStorage.getItem("shippingAddress")
            ? JSON.parse(localStorage.getItem("shippingAddress"))
            : {},
    },
    reducers: {
        addCartItem: (state, action) => {
            state.cartItems.push(action.payload);
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload
            );
        },
        updateShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
    },
});

export default cartSlice;
