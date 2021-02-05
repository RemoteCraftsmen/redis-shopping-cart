<template>
    <v-row class="pa-3 d-flex">
        <v-expansion-panels v-model="panel">
            <v-expansion-panel class="app-info" readonly>
                <v-expansion-panel-header class="title">
                    How it works

                    <template #actions>
                        <v-btn
                            color="#2196f3"
                            outlined
                            @click="panel === 0 ? hidePanel() : showPanel()"
                        >
                            {{ panel === 0 ? 'Collapse' : 'View more' }}
                        </v-btn>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-divider />

                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            panel: null
        };
    },

    methods: {
        showPanel() {
            this.panel = 0;
        },

        hidePanel() {
            this.panel = null;
        }
    }
};
</script>
