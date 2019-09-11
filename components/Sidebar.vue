<template>
    <v-navigation-drawer
      :floating="false"
      permanent="permanent"
      app
    >
        <v-list>
            <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            >
            <v-list-item-icon>
                <v-icon>mdi-{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>
        <template v-slot:append>
            <v-switch
                v-model="$vuetify.theme.dark"
                primary
                right
                class="float-left ml-3"
                label="Dark"
            ></v-switch>  
        </template>
    </v-navigation-drawer>
</template>

<script>

    export default {
        name:'Sidebar',
        data () {
            return {
                items: [
                { title: 'Dashboard', icon: 'view-dashboard' },
                { title: 'Account', icon: 'account' },
                { title: 'Admin', icon: 'gavel' },
                ],
            }
        },
    }
</script>
