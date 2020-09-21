<template>
    <div
        class='result'
        v-if='availability'
    >
        <div
            class='product-img'
            :style='{
                "background-image":`url("${product_data.image}")`
            }'
        ></div>
        <div class='product_detail'>
            <div class='name'>{{product_data.name}}</div>
            <div class='price'>
                <span class='decimal'>{{product_data.price_parts[0]}}</span>
                <span class='subs'>
                    <span v-if='product_data.price_parts[1]'>,</span>{{product_data.price_parts[1]}} €
                </span>
            </div>
        </div>
        <div class='availability'>
            <div :class='[availability.is_available, "available_bubble"]'>
            </div>
            <div class='stock'>
                <template v-if="availability.stock==0">rupture de stock</template>
                <template v-else-if='availability.stock < 10'>plus que {{availability.stock}} en stock</template>
                <template v-else>{{availability.stock}} en stock</template>
            </div>
        </div>
</template>

<script>
export default {
    props: ["product_id", "store_no"],
    data() {
        return {
            product_data: null,
            availability: null,
        };
    },
    mounted() {
        this.update_data();
    },
    methods: {
        async update_data() {
            Vue.set(this, "product_data", null);
            Vue.set(this, "availability", null);
            if (!this.product_id || !this.store_no) return;
            let availability = await api(
                "/" + this.product_id + "/" + this.store_no
            );
            let product_data = await api("/" + this.product_id);
            console.log(availability);
            Vue.set(this, "product_data", product_data);
            Vue.set(this, "availability", availability);
        },
    },
    watch: {
        product_id() {
            this.update_data();
        },
        store_no() {
            this.update_data();
        },
    },
};
</script>

<style scoped>
.result {
    color: #ddd;
    position: fixed;
    bottom: 20%;
    left: 30px;
}

.product-img {
    width: 100px;
    height: 100px;
    border-radius: 1000px;
    background-size: 80px 80px;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #fff;
    border: 3px solid #000;
    animation: pop 0.2s;
}

.product_detail {
    color: rgb(0, 0, 0);
    font-weight: bold;
    position: absolute;
    background: rgb(255, 255, 255);
    padding: 10px 20px 10px 30px;
    border-radius: 5px;
    top: 20px;
    left: 90px;
    z-index: -1;
    animation: from_left 1s;
}
.product_detail div {
    display: inline-block;
}
.price {
    width: 70px;
}
.price .subs {
    position: relative;
    font-size: 10px;
    top: -5px;
    left: -3px;
}
@keyframes from_left {
    0% {
        left: 0px;
        opacity: 0;
    }
    100% {
        left: 90px;
        opacity: 1;
    }
}

.availability {
    position: absolute;
    width: 200px;
    top: 95px;
    left: 100px;
}
.available_bubble {
    width: 20px;
    height: 20px;
    border-radius: 1000px;
    background: #ddd;
    animation: pop 0.5s;
    display: inline-block;
}
.available_bubble.HIGH {
    background: #0f0;
}
.available_bubble.MEDIUM {
    background: #ff0;
}
.available_bubble.LOW {
    background: #f00;
}
.availability .stock {
    opacity: 0;
    position: relative;
    top: -3px;
    margin-left: 3px;
    display: inline-block;
    animation: appear 0.5s 0.5s forwards;
}
</style>