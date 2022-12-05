import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_RESET,
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_RESET,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_CREATE_REVIEW_RESET,
    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL,
} from "../constants/productConstants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { Pokemon } from './types'
// import type { RootState } from '../store'
import Product from "../components/Product";
import axios from "axios";

export const fetchProductById =
    createAsyncThunk <
    Product >
    ("product/:id",
    async (id, { rejectWithValue }) => {
        const response = await axios.get(`/api/products/${id}`);
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
            return rejectWithValue(data);
        }
        return data;
    });

type RequestState = 'pending' | 'fulfilled' | 'rejected'

export const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        dataByName: {} as Record<string, Pokemon | undefined>,
    statusByName: {} as Record<string, RequestState | undefined>,
},
reducers: {},
extraReducers: (builder) => {
    // When our request is pending:
    // - store the 'pending' state as the status for the corresponding pokemon name
    builder.addCase(fetchPokemonByName.pending, (state, action) => {
        state.statusByName[action.meta.arg] = 'pending'
    })
    // When our request is fulfilled:
    // - store the 'fulfilled' state as the status for the corresponding pokemon name
    // - and store the received payload as the data for the corresponding pokemon name
    builder.addCase(fetchPokemonByName.fulfilled, (state, action) => {
        state.statusByName[action.meta.arg] = 'fulfilled'
        state.dataByName[action.meta.arg] = action.payload
    })
    // When our request is rejected:
    // - store the 'rejected' state as the status for the corresponding pokemon name
    builder.addCase(fetchPokemonByName.rejected, (state, action) => {
        state.statusByName[action.meta.arg] = 'rejected'
    })
},
})

export const productDetailsReducer = (
    state = { product: { reviews: [] } },
    action
) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return { ...state, loading: true };
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload };
        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

