<template>
    <v-app>
        <v-container id="main-container">
            <v-row>
                <v-col cols="12">
                    <div class="pa-3 d-flex align-center">
                        <v-icon class="error app-icon"> mdi-cart-plus </v-icon>
                        <h1>Shopping cart demo</h1>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="8">
                    <info />
                    <product-list :products="products" />
                </v-col>
                <v-col cols="12" sm="4" class="d-flex flex-column">
                    <cart />
                    <reset-data-btn class="mt-6" />
                </v-col>
            </v-row>

            <v-footer class="mt-12 pa-0">
                ⓒ Copyright {{ new Date().getFullYear() }} | All Rights Reserved
            </v-footer>
        </v-container>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import ResetDataBtn from '@/components/ResetDataBtn.vue';
import Info from '@/components/Info';

export default {
    name: 'App',

    components: {
        ProductList,
        Cart,
        ResetDataBtn,
        Info
    },

    computed: {
        ...mapGetters({
            products: 'products/getProducts'
        })
    },

    async created() {
        await this.fetchProducts();
    },

    methods: {
        ...mapActions({
            fetchProducts: 'products/fetch'
        })
    }
};
</script>
