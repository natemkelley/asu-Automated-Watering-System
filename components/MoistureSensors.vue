<template>
    <v-card>
        <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text>Cancel</v-btn>
        <v-btn
            text
            color="primary"
        >Submit</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "MoistureSensors",
        data() {
            return {
                isOpen: false,
            }
        }
    };
</script>
