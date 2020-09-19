<template>
    <div>
        <video
            width="200"
            height="200"
            autoplay="true"
            id="video"
            @click='detect()'
        >
        </video>
        <div>{{message}}</div>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return { message: "" };
    },
    mounted() {
        let video = document.getElementById("video");
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log("Something went wrong!");
                });
        }
    },
    methods: {
        async detect() {
            var video = document.getElementById("video");
            var canvas = document.createElement("canvas");
            canvas.width = 200;
            canvas.height = 200;
            canvas.getContext("2d").drawImage(video, 0, 0, 200, 200);
            resultb64 = canvas.toDataURL();
            Vue.set(this, "message", "loading ...");
            let resp = await fetch("/api/detect", {
                method: "POST",
                body: resultb64,
                json: true,
            });
            let detect_data = await resp.json();
            if (detect_data.product_id) {
                this.$emit("input", detect_data.product_id);
                this.$emit("closed");
            } else {
                Vue.set(this, "message", "no product id detected !");
                this.detect();
            }
        },
    },
};
</script>

<style>
</style>