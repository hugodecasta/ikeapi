<template>
    <div>
        <product-id-finder v-model='product_id'></product-id-finder>
        <store-no-finder v-model='store_no'></store-no-finder>
        <product-result
            :product_id='product_id'
            :store_no='store_no'
        ></product-result>
    </div>
</template>

<script>
export default {
    components: load_vue_components([
        "product-id-finder",
        "store-no-finder",
        "product-result",
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