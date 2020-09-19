<template>

    <div>
        <template v-if="!product_data">
            Loading...
        </template>
        <template v-else>
            <img
                :src="'https://www.ikea.com'+product_data.image"
                height=200
            >
            <h2>{{product_data.name}}</h2>
            <p>{{product_data.desc}}</p>

            <div v-if='availability.is_available=="HIGH"'>
                Disponible dans ce magasin !
                <div style='text-align:center'>
                    <br>
                    <div class='ikea_digit'>{{product_id_str}}</div>
                    <br>
                    <div class='ikea_digit'>{{availability.location[0]}}</div>
                    <div class='ikea_digit'>{{availability.location[1]}}</div>
                </div>
                <template v-if='availability.forecast[0] != "HIGH"'>
                    (vite, il ne reste plus que {{availability.stock}} exemplaires)
                </template>
            </div>
            <p v-else> n'est malheureusement pas disponible ...</p>
        </template>
    </div>

</template>

<script>
export default {
    props: ["store", "product_id"],
    data() {
        return {
            availability: null,
            product_data: null,
        };
    },
    async mounted() {
        this.load_product_data();
    },
    methods: {
        async load_product_data() {
            Vue.set(this, "availability", null);
            Vue.set(this, "product_data", null);
            let availability = await (
                await fetch(
                    "/api/" + this.product_id + "/" + this.store.storeNo
                )
            ).json();
            let product_data = await (
                await fetch("/api/" + this.product_id)
            ).json();
            console.log(availability.location_data);
            Vue.set(this, "availability", availability);
            Vue.set(this, "product_data", product_data);
        },
    },
    computed: {
        product_id_str() {
            return (this.product_id + "").match(/[0-9]{2,3}/g).join(".");
        },
    },
    watch: {
        product_id: function (val) {
            this.load_product_data();
        },
    },
};
</script>

<style>
</style>