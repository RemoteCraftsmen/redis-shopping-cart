import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products';
import cart from './modules/cart';
import reset from './modules/reset';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        products,
        cart,
        reset
    }
});
