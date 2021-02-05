<template>
    <v-container>
        <v-row class="secondary rounded">
            <v-col class="pa-0" cols="3">
                <v-img
                    class="rounded"
                    style="height: 100%"
                    :src="require(`@/assets/products/${item.id}.jpg`)"
                />
            </v-col>

            <v-col cols="9">
                <v-card elevation="0" style="width: fit-content !important">
                    <v-card-title class="secondary pa-0 text-left text">
                        {{ item.name }}
                    </v-card-title>

                    <v-card-actions class="secondary pa-0">
                        <v-row align="center" justify="space-between">
                            <v-col
                                cols="3"
                                md="12"
                                lg="4"
                                class="pa-0 pa-3 text-left text"
                            >
                                ${{ item.priceSum }}
                            </v-col>

                            <v-col cols="9" md="12" lg="1" class="pa-0 mt-3">
                                <v-btn-toggle
                                    multiple
                                    rounded
                                    class="pa-3 secondary"
                                >
                                    <v-btn small @click="incrementItem(-1)">
                                        -
                                    </v-btn>

                                    <v-btn small>
                                        <v-text-field
                                            v-model="itemQuantity"
                                            style="width: 30px"
                                            @input="onItemQuantityChange"
                                        />
                                    </v-btn>

                                    <v-btn
                                        :disabled="!item.stock"
                                        small
                                        @click="incrementItem(1)"
                                    >
                                        +
                                    </v-btn>
                                </v-btn-toggle>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'CartItem',

    props: {
        item: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            itemQuantity: 0
        };
    },

    watch: {
        item: {
            immediate: true,
            handler(value) {
                this.itemQuantity = parseInt(value.quantity);
            }
        }
    },

    methods: {
        onItemQuantityChange() {
            this.$emit('save', {
                id: this.item.id,
                quantity: this.itemQuantity
            });
        },

        deleteItem(id) {
            this.$emit('delete', id);
        },

        incrementItem(value) {
            if (this.itemQuantity + value === 0) {
                this.deleteItem(this.item.id);

                return;
            }

            this.$emit('save', {
                id: this.item.id,
                incrementBy: value
            });
        }
    }
};
</script>

<style lang="sass" scoped>
@import '@/styles/images.scss'
</style>
