<template>
    <div class='product_detail'>
        <div
            class='name'
            :style='{
                    width:name.length >= 7 ? "150px" : "auto"
                }'
        >{{name}}</div>
        <div class='price'>
            <span class='decimal'>{{price_parts[0]}}</span>
            <span class='subs'>
                <span v-if='price_parts[1]'>,</span>{{price_parts[1]}} €
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ["price_parts", "name"],
};
</script>

<style scoped>
.name {
    font-weight: 700;
}
.price {
    font-weight: 700;
    width: 70px;
}

.price .subs {
    position: relative;
    font-size: 10px;
    top: -5px;
    left: -3px;
}
.product_detail {
    color: rgb(0, 0, 0);
    font-weight: bold;
    background: rgb(255, 255, 255);
    border-radius: 5px;
}
</style>