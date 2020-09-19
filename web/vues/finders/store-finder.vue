<template>
    <div>
        <select
            v-model='storeNo'
            @change='update_storeNo()'
        >
            <option
                v-for='store in stores'
                :key='store.name'
                :value='store.storeNo'
            >
                {{store.full_name}}
            </option>
        </select>
        <button @click='find_nearest()'>HOME</button>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            stores: [],
            storeNo: null,
        };
    },
    methods: {
        async find_nearest() {
            navigator.geolocation.getCurrentPosition(async (geodat) => {
                let loc = geodat.coords;
                let nearset = await api(
                    "/nearest/" + loc.latitude + "/" + loc.longitude
                );
                this.set_storeNo(nearset.storeNo);
            });
        },
        set_storeNo(storeNo) {
            Vue.set(this, "storeNo", storeNo);
            this.$emit("input", storeNo);
        },
        update_storeNo() {
            this.set_storeNo(this.storeNo);
        },
    },
    async mounted() {
        let stores = await api("/stores");
        Vue.set(this, "stores", stores);
        this.find_nearest();
    },
};
</script>

<style>
</style>