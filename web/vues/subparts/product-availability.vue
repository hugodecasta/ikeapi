<template>
    <div v-if='availability'>
        Disponible: {{availability.is_available}}
        <br>
        Place: {{availability.location}}
        <br>
        Stock: {{availability.stock}}
    </div>
    <div v-else>
        chargement ...
    </div>
</template>

<script>
export default {
    props: ["product_id", "store_no"],
    data() {
        return {
            availability: null,
        };
    },
    mounted() {
        this.update_data();
    },
    methods: {
        async update_data() {
            Vue.set(this, "availability", null);
            let availability = await api(
                "/" + this.product_id + "/" + this.store_no
            );
            Vue.set(this, "availability", availability);
        },
    },
    watch: {
        product_id(id) {
            this.update_data();
        },
        store_no(no) {
            this.update_data();
        },
    },
};
</script>

<style>
</style>