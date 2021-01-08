import axios from '@/plugins/axios';

const actions = {
    async reset({ dispatch }) {
        await axios.get('/api/reset');

        await dispatch('cart/fetch', null, { root: true });
        await dispatch('products/fetch', null, { root: true });
    }
};

export default {
    actions,
    namespaced: true
};
