<template>
    <div>
        <input v-model='code'>
        <button @click='is_pic_detect=true'>PIC</button>
        <div
            class='camera'
            v-if='is_pic_detect'
        >
            <video
                width="200"
                height="200"
                autoplay="true"
                id="video"
            >
            </video>
            <button @click='stop_camera()'>stop</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            code: null,
            is_pic_detect: false,
        };
    },
    mounted() {
        setTimeout(() => {
            Vue.set(this, "code", 60334963);
        }, 100);
    },
    methods: {
        start_camera() {},
        stop_camera() {
            let video = document.getElementById("video");
            video.srcObject = null;
            Vue.set(this, "is_pic_detect", false);
        },
        async detect() {
            var video = document.getElementById("video");
            var canvas = document.createElement("canvas");
            canvas.width = 200;
            canvas.height = 200;
            canvas.getContext("2d").drawImage(video, 0, 0, 200, 200);
            resultb64 = canvas.toDataURL();
            let resp = await fetch("/api/detect", {
                method: "POST",
                body: resultb64,
                json: true,
            });
            let detect_data = await resp.json();
            if (detect_data.product_id) {
                Vue.set(this, "code", detect_data.product_id);
                this.stop_camera();
            } else {
                this.detect();
            }
        },
    },
    watch: {
        code(product_id) {
            this.$emit("input", product_id);
        },
        async is_pic_detect(value) {
            if (!value) return;
            setTimeout(async () => {
                let video = document.getElementById("video");
                if (navigator.mediaDevices.getUserMedia) {
                    let stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: { exact: "environment" },
                        },
                    });
                    video.srcObject = stream;
                    this.detect();
                }
            });
        },
    },
};
</script>

<style>
</style>