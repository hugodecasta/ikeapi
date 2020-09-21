<template>
    <div>
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
            <product-detail
                class='detail'
                :price_parts='product_data.price_parts'
                :name='product_data.name'
            >
            </product-detail>
            <product-availability
                class='availability'
                :availability='availability'
                :restock='restock'
            ></product-availability>
        </div>
        <div
            class='message'
            v-if='message'
        >{{message}}</div>
    </div>
</template>

<script>
export default {
    props: ["product_id", "store_no"],
    components: load_vue_components(["product-detail", "product-availability"]),
    data() {
        return {
            product_data: null,
            availability: null,
            restock: null,
            message: null,
        };
    },
    mounted() {
        this.update_data();
    },
    methods: {
        async update_data() {
            Vue.set(this, "product_data", null);
            Vue.set(this, "availability", null);
            Vue.set(this, "restock", null);
            try {
                if (!this.product_id || !this.store_no) return;
                let availability = await api(
                    "/" + this.product_id + "/" + this.store_no
                );
                let product_data = await api("/" + this.product_id);
                let restock = await api("/restock/" + this.product_id);
                restock = restock.type ? restock : null;
                Vue.set(this, "product_data", product_data);
                Vue.set(this, "availability", availability);
                Vue.set(this, "restock", restock);
            } catch (e) {
                Vue.set(this, "message", "produit introuvable");
                setTimeout(() => {
                    Vue.set(this, "message", null);
                }, 4000);
            }
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
    background-size: 70px 70px;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #fff;
    border: 3px solid #000;
    animation: pop 0.2s;
}

.detail {
    position: absolute;
    top: 20px;
    left: 90px;
    z-index: -1;
    animation: from_left 1s;
    padding: 10px 20px 10px 30px;
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
    top: 95px;
    left: 100px;
}
@keyframes message_anim {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }
    20% {
        transform: scale(1);
        opacity: 1;
    }
    80% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.8);
        opacity: 0;
    }
}
</style>