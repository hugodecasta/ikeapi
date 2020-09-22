<template>
    <div>
        <div
            v-if='obj_history.length'
            :class='["history_button", "icon_btn", "pop", panel_can_open ? "inverted":""]'
            @click='open_panel()'
        >
            <i class='material-icons'>import_contacts</i>
        </div>
        <div :class='["history_panel", panel_can_open ? "open":"hide"]'>
            <div
                v-if='obj_history[0]'
                class='history'
            >
                <div
                    class='product'
                    v-for='(obj,index) in obj_history'
                    :key='index'
                    @click='select_product(obj.product_data.product_id)'
                >
                    <div
                        class='product_img'
                        :style='{
                        "background-image":`url(${obj.product_data.image})`
                        }'
                    ></div>
                    <product-detail
                        class='detail'
                        :price_parts='obj.product_data.price_parts'
                        :name='obj.product_data.name'
                    ></product-detail>
                    <product-availability
                        class='availability'
                        :availability='obj.availability'
                        :restock='obj.restock'
                    ></product-availability>
                    <div
                        class='icon_btn trash_btn'
                        @click.stop='delete_item(index)'
                    ><i class='material-icons'>clear</i></div>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    props: ["product_id", "store_no", "value"],
    components: load_vue_components(["product-detail", "product-availability"]),
    data() {
        return {
            history: [],
            obj_history: [],
            open: false,
        };
    },
    async mounted() {
        let history = JSON.parse(localStorage.getItem("history")) || [];
        Vue.set(this, "history", history);
    },
    methods: {
        open_panel() {
            Vue.set(this, "open", !this.open);
        },
        select_product(product_id) {
            Vue.set(this, "open", false);
            if (this.product_id != product_id) this.$emit("input", product_id);
        },
        delete_item(index) {
            this.history.splice(index, 1);
            this.obj_history.splice(index, 1);
            this.save_history();
            if (!this.history.length) Vue.set(this, "open", false);
        },
        sort_history(obj_history) {
            let av_order = ["LOW", "MEDIUM", "HIGH"];
            let ordered = obj_history
                .map((p) => {
                    let av_score =
                        av_order.indexOf(p.availability.is_available) * 1000000;
                    let place_score = p.availability.location_data
                        .map((place) => {
                            let int = parseInt(place);
                            return isNaN(int) ? 1 : int;
                        })
                        .reduce((acc, cur) => Math.min(acc, cur), 100000000);
                    let score = av_score + 1 / place_score;
                    p.score = score;
                    p.scores = {
                        score,
                        av_score,
                        place_score,
                        name: p.product_data.name,
                        loc: p.availability.location_data,
                    };
                    return p;
                })
                .sort(function (p1, p2) {
                    if (p1.score > p2.score) return -1;
                    if (p1.score < p2.score) return 1;
                    return 0;
                });
            return ordered;
        },
        async update_all_history() {
            let obj_history = [...this.history];
            let all_promise = [];
            for (let i = 0; i < this.history.length; ++i) {
                all_promise.push(
                    new Promise((ok) => {
                        this.parse_object(this.history[i]).then((obj) => {
                            obj_history[i] = obj;
                            ok(obj);
                        });
                    })
                );
            }
            await Promise.all(all_promise);
            Vue.set(this, "obj_history", this.sort_history(obj_history));
        },
        async parse_object(product_id) {
            if (!product_id || !this.store_no) return null;
            try {
                let availability = await api(
                    "/" + product_id + "/" + this.store_no
                );
                let restock = await api("/restock/" + product_id);
                let product_data = await api("/" + product_id);
                restock = restock.type ? restock : null;
                return { availability, product_data, restock };
            } catch (e) {
                return null;
            }
        },
        async add_to_history(product_id) {
            product_id = "" + product_id;
            if (this.history.includes(product_id)) return;
            let obj = await this.parse_object(product_id);
            if (obj == null) return;
            this.obj_history.push(obj);
            Vue.set(this, "obj_history", this.sort_history(this.obj_history));
            this.history.push(product_id);
            this.save_history();
        },
        save_history() {
            localStorage.setItem("history", JSON.stringify(this.history));
        },
    },
    computed: {
        panel_can_open() {
            return this.obj_history[0] && this.open;
        },
    },
    watch: {
        store_no() {
            this.update_all_history();
        },
        product_id(value) {
            this.add_to_history(value);
        },
    },
};
</script>

<style scoped>
.history {
    margin-top: 60px;
    margin-bottom: 40px;
}
.history_button {
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 100;
    transition: all 0.3s;
}
.history_button.inverted {
    right: calc(100% - 100px);
}
.history_panel {
    position: fixed;
    height: calc(100% + 2px);
    width: calc(100% - 50px);
    right: calc((100% - 40px) * -1);
    top: -1px;
    background: #fff;
    box-shadow: 0px 0px 10px #000;
    transition: right 0.3s;
    overflow-y: scroll;
}
.history_panel.open {
    right: -2px;
}
.product {
    position: relative;
}
.product_img {
    width: 70px;
    height: 70px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 10px;
    display: inline-block;
}
.detail {
    display: inline-block;
    position: relative;
    top: -50px;
}
.detail .name {
    width: auto !important;
    display: inline-block;
}
.detail .price {
    display: inline-block;
}
.availability {
    position: relative;
    top: -45px;
    left: 93px;
    font-size: 11px;
}
.availability .stock {
    top: -7px;
}
.availability .restock {
    font-size: 7px;
}
.trash_btn {
    position: absolute;
    right: 10px;
    bottom: 35px;
}
</style>