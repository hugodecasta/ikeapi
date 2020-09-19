<template>
    <div v-if='product_data'>
        <div
            class='image'
            :style='{
            "background-image":`url(https://www.ikea.com${product_data.image})`
        }'
        >
        </div>
        <h3>{{product_data.name}}</h3>
        {{product_data.desc}}
    </div>
</template>

<script>
export default {
    props: ["product_id"],
    data() {
        return {
            product_data: null,
        };
    },
    methods: {
        async updated() {
            Vue.set(this, "product_data", null);
            let product_data = await api("/" + this.product_id);
            Vue.set(this, "product_data", product_data);
        },
    },
    mounted() {
        this.updated();
    },
    watch: {
        async product_id(id) {
            this.updated();
        },
    },
};
</script>

<style scoped>
.image {
    width: 300px;
    height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
}
</style>