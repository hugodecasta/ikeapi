<template>
    <div>
        <h1 class='title'>IKEA<span>pi<span></h1>
        <store-finder v-model='store_no'></store-finder>
        <code-finder v-model='product_id'></code-finder>
        <product-data
            v-if='product_id'
            :product_id='product_id'
        ></product-data>
        <product-availability
            v-if='product_id && store_no'
            :product_id='product_id'
            :store_no='store_no'
        ></product-availability>
    </div>
</template>

<script>
export default {
    components: load_vue_components([
        "store-finder",
        "code-finder",
        "product-data",
        "product-availability",
    ]),
    data: () => {
        return {
            store_no: null,
            product_id: null,
        };
    },
};
</script>

<style>
</style>