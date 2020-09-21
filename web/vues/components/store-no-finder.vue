<template>
    <div
        class='capsule white store'
        @click='find_store()'
    >
        <template v-if='store'>
            <i class='material-icons'>location_on</i>
            {{store.full_name}}
        </template>
        <template v-else>
            <i class='material-icons turning'>gps_not_fixed</i>
            je vous cherche
        </template>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            store: null,
        };
    },
    mounted() {
        this.find_store();
    },
    methods: {
        async find_store() {
            Vue.set(this, "store", null);
            navigator.geolocation.getCurrentPosition(async (geodat) => {
                let loc = geodat.coords;
                let url = "/nearest/" + loc.latitude + "/" + loc.longitude;
                let nearset = await api(url);
                Vue.set(this, "store", nearset);
                this.$emit("input", nearset.storeNo);
            });
        },
    },
};
</script>

<style scoped>
.store {
    top: 10px;
    right: 10px;
    border-radius: 1000px 0px 0px 1000px;
}
</style>