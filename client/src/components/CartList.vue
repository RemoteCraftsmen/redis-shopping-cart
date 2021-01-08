<template>
    <v-row>
        <v-col v-for="(item, index) in items" :key="item.id" cols="12">
            <cart-item :item="item" @save="save" @delete="remove(index)" />
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import CartItem from '@/components/CartItem';

export default {
    name: 'CartList',

    components: {
        CartItem
    },

    props: {
        items: {
            type: Array,
            required: false,
            defaultValue: () => []
        }
    },

    methods: {
        ...mapActions({
            saveItems: 'cart/save',
            deleteItem: 'cart/delete'
        }),

        async save(data) {
            try {
                await this.saveItems(data);
            } catch (error) {
                console.error(error);
            }
        },

        async remove(index) {
            try {
                await this.deleteItem(this.items[index].id);
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
