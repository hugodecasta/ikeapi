<template>
    <div class='availability'>
        <div :class='[availability.is_available, "available_bubble"]'>
        </div>
        <div class='stock'>
            <template v-if="availability.stock==0">rupture de stock</template>
            <template v-else-if='availability.stock < 10'>plus que {{availability.stock}} en stock</template>
            <template v-else>{{availability.stock}} en stock</template>
            <div
                class='restock'
                v-if='availability.stock < 10'
            >
                <template v-if='restock'>(restockage le {{restock.date.day}} {{months[restock.date.month-1]}})</template>
                <template v-else>(restockage inconnu)</template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["availability", "restock"],
    data() {
        return {
            months: [
                "Jan",
                "Fev",
                "Mar",
                "Avr",
                "Mai",
                "Jun",
                "Jui",
                "Aou",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        };
    },
};
</script>

<style>
.availability {
    width: 200px;
}

.availability .stock {
    opacity: 0;
    position: relative;
    top: -4px;
    margin-left: 3px;
    display: inline-block;
    animation: appear 0.5s 0.5s forwards;
}

.restock {
    font-size: 11px;
    position: absolute;
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
    background: #0a8a00;
}

.available_bubble.MEDIUM {
    background: #ffa524;
}

.available_bubble.LOW {
    background: #e00751;
}
</style>