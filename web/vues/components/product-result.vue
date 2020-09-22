<template>
    <div>
        <div
            class='result'
            v-if='availability'
        >
            <div
                class='product-img pop'
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
            <div
                v-if='related'
                class='related'
            >
                <div
                    class='related_img pop'
                    v-for='rel in related.related'
                    :key='rel.product_id'
                    :style='{"background-image":`url(${rel.image})`}'
                    @click='select_new_product(rel.product_id)'
                >
                </div>
            </div>
        </div>
        <div
            v-else-if='searching==true'
            class='loading pulsing'
        >
            <i class='material-icons'>archive</i>
        </div>
        <div
            class='message'
            v-if='message'
        >{{message}}</div>
    </div>
</template>

<script>
export default {
    props: ["product_id", "store_no", "value"],
    components: load_vue_components(["product-detail", "product-availability"]),
    data() {
        return {
            searching: false,
            product_data: null,
            availability: null,
            restock: null,
            related: null,
            message: null,
        };
    },
    mounted() {
        this.update_data();
    },
    methods: {
        select_new_product(product_id) {
            this.$emit("input", product_id);
        },
        async update_data() {
            Vue.set(this, "product_data", null);
            Vue.set(this, "availability", null);
            Vue.set(this, "restock", null);
            Vue.set(this, "related", null);
            try {
                if (!this.product_id || !this.store_no) return;
                Vue.set(this, "searching", true);
                let availability = await api(
                    "/" + this.product_id + "/" + this.store_no
                );
                let product_data = await api("/" + this.product_id);
                let related = await api("/colour/" + this.product_id);
                let restock = await api("/restock/" + this.product_id);
                restock = restock.type ? restock : null;
                Vue.set(this, "product_data", product_data);
                Vue.set(this, "availability", availability);
                Vue.set(this, "restock", restock);
                Vue.set(this, "related", related);
            } catch (e) {
                Vue.set(this, "message", "produit introuvable");
                setTimeout(() => {
                    Vue.set(this, "message", null);
                }, 4000);
            }
            console.log("END");
            Vue.set(this, "searching", false);
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
.related {
    position: fixed;
    bottom: calc(20% - 100px);
    left: 0px;
    width: 100%;
    text-align: center;
}
.related_img {
    width: 50px;
    height: 50px;
    background-size: 35px 35px;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 10000px;
    background-color: #fff;
    border: 2px solid #000;
    margin: 5px;
    display: inline-block;
}
.loading {
    position: fixed;
    color: #fff;
    bottom: 20%;
    left: calc(50% - 50px);
}
.loading .material-icons {
    font-size: 100px;
}
</style>