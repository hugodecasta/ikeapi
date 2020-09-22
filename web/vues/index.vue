<template>
    <div>
        <product-id-finder v-model='product_id'></product-id-finder>
        <product-result
            :product_id='product_id'
            :store_no='store_no'
            v-model='product_id'
        ></product-result>
        <product-history
            :product_id='product_id'
            :store_no='store_no'
            v-model='product_id'
        ></product-history>
        <store-no-finder v-model='store_no'></store-no-finder>
    </div>
</template>

<script>
export default {
    components: load_vue_components([
        "product-id-finder",
        "store-no-finder",
        "product-result",
        "product-history",
    ]),
    // mounted() {
    //     let elem = document.documentElement;
    //     if (elem.requestFullscreen) {
    //         elem.requestFullscreen();
    //     } else if (elem.mozRequestFullScreen) {
    //         /* Firefox */
    //         elem.mozRequestFullScreen();
    //     } else if (elem.webkitRequestFullscreen) {
    //         /* Chrome, Safari and Opera */
    //         elem.webkitRequestFullscreen();
    //     } else if (elem.msRequestFullscreen) {
    //         /* IE/Edge */
    //         elem.msRequestFullscreen();
    //     }
    // },
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