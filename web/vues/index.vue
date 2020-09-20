<template>
    <div>
        <product-id-finder v-model='product_id'></product-id-finder>
    </div>
</template>

<script>
export default {
    components: load_vue_components(["product-id-finder"]),
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