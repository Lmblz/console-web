<template>
    <v-menu v-model="showMenu"
            :close-on-content-click="false"
            location="end"
            @update:modelValue="updateIconButtonMenu($event)">
        <template v-slot:activator="{ props }">
            <v-btn color="black"
                   v-bind="props"
                   :icon="iconMenu"
                   class="position-fixed bottom-menu"
                   size="small"
                   style="bottom: var(--v-layout-bottom); right: 10px">
            </v-btn>
        </template>

        <v-card class="mr-2">
            <v-card-actions>
                <v-btn v-for="(item, index) in props.items" :key="index" size="small" :icon="showIcon == true ? item.icon : false" :text="item.text" :color="item.color" :variant="item.variant" @click="sendEvent(item); showMenu = false; updateIconButtonMenu(showMenu.value)" /> 
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script setup>
    import { ref } from "vue";
    import { useDisplay } from "vuetify";

    const props = defineProps({
        items: Array
    })

    const display = useDisplay();
    const emit = defineEmits();

    const showMenu = ref(false);
    const iconMenu = ref('mdi-menu-open');
    
    const showIcon = () => display.width._object.xs || display.width._object.sm ? true : false; 
    
    function updateIconButtonMenu(isOpen) {
        isOpen ? iconMenu.value = "mdi-menu-close" : iconMenu.value = "mdi-menu-open";
    }

    function sendEvent(item) {
        emit(item.emit);
    }
</script>

<style lang="scss">
    .bottom-menu {
    z-index: 1
}
</style>
