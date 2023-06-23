import { createSlice } from '@reduxjs/toolkit'

export const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        shop: {},
        loading: false,
        error: null,
        createShopProccessing: false,
        checkShopIsExist: false,
        shops: [],
    },
    reducers: {
        getShopRequest: (state, action) => {
            state.error = null
            state.loading = true
        },
        getShopSuccess: (state, action) => {
            state.shop = action.payload.shop
            state.loading = false
            state.checkShopIsExist = true
        },
        getShopFail: (state, action) => {
            state.error = action.payload.error
            state.loading = false
        },


        createShopRequest: (state, action) => {
            state.createShopProccessing = true
            state.error = null
        },
        createShopSuccess: (state, action) => {
            state.createShopProccessing = false
            state.shop = action.payload.shop
            state.checkShopIsExist = true
        },
        createShopFail: (state, action) => {
            state.createShopProccessing = false
            state.error = action.payload.error
        },


        getShopsRequest: (state, action) => {
            state.loading = true
            state.error = null
        },
        getShopsSuccess: (state, action) => {
            state.loading = false
            state.shops = action.payload.shops
        },
        getShopsFail: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        },
    },
})

export const {
    getShopRequest, getShopSuccess, getShopFail,
    createShopRequest, createShopSuccess, createShopFail,
    getShopsRequest, getShopsSuccess, getShopsFail,
} = shopSlice.actions

export default shopSlice.reducer