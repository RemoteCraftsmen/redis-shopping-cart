<template>
    <v-app>
        <v-container class="pb-12" id="main-container">
            <v-row class="text-center mb-16">
                <v-col class="pa-0" cols="12">
                    <h1 id="title" class="my-10 mx-auto">Shopping cart demo</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pa-0" cols="12" sm="6" md="8" xl="8">
                    <product-list :products="products" />
                </v-col>
                <v-col cols="12" sm="6" md="4" xl="4">
                    <cart />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pa-0" cols="12" sm="6" md="8" xl="9">
                    <v-spacer />
                </v-col>
                <v-col cols="12" sm="6" md="4" xl="3">
                    <reset-data-btn />
                </v-col>
            </v-row>
        </v-container>
        <v-footer class="pt-12">
            {{ new Date().getFullYear() }} ⓒ
            <!-- <v-card class="flex" flat tile>
                <v-card-title class="teal">
                    <strong class="subheading"
                        >Get connected with us on social networks!</strong
                    >

                    <v-spacer></v-spacer>

                    <v-btn
                        v-for="icon in icons"
                        :key="icon"
                        class="mx-4"
                        dark
                        icon
                    >
                        <v-icon size="24px">
                            {{ icon }}
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="py-2 white--text text-center">
                    {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
                </v-card-text>
            </v-card> -->
        </v-footer>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import ResetDataBtn from '@/components/ResetDataBtn.vue';

export default {
    name: 'App',

    components: {
        ProductList,
        Cart,
        ResetDataBtn
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
