<template>
    <v-col class="product" cols="12" sm="6" md="4">
        <v-card elevation="2" style="height: 100% !important">
            <v-img
                class="img mw75"
                :src="require(`@/assets/products/${product.id}.jpg`)"
            />

            <v-card-title class="pa-3 text-left text">
                {{ product.name }}
            </v-card-title>

            <v-card-subtitle class="pa-3 text-left text">
                ${{ product.price }}
            </v-card-subtitle>

            <v-card-text class="pa-3 text-left text caption">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
                amet tempor diam. Etiam feugiat convallis feugiat. Cras vitae
                sem turpis. Aenean ac odio massa. Cras pretium ultricies neque
                in egestas. Nam fermentum et ligula sit amet accumsan. Proin non
                nulla commodo, mollis ante eu, porta lacus. Morbi ut nibh luctus
                leo tempus laoreet sit amet et nisi. Nulla semper imperdiet
                consequat. Mauris rutrum orci diam, non suscipit mauris
                consectetur vel.
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-3">
                <v-row class="align-center">
                    <v-col
                        cols="4"
                        md="12"
                        lg="4"
                        class="caption text-left text"
                    >
                        {{ product.stock ? `${product.stock} in` : 'out of' }}
                        stock
                    </v-col>

                    <v-col cols="8" md="12" lg="8">
                        <v-btn
                            class="body-2 success d-flex justify-space-around align-center"
                            :disabled="product.stock === 0"
                            style="
                                height: 36px !important;
                                width: 100%;
                                padding: 0 !important;
                            "
                            @click="$emit('add', product.id)"
                        >
                            <div
                                class="text-left text d-flex align-center"
                                style="height: 36px"
                            >
                                Add to cart
                            </div>

                            <v-icon style="height: 36px">mdi-cart-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
export default {
    name: 'Product',

    props: {
        product: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="sass" scoped>
@import '@/styles/images.scss'
</style>
