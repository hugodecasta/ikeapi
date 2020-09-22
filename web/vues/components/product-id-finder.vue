<template>
    <div
        class='camera'
        @click='start_detection()'
    >
        <video
            width="100%"
            height="100%"
            autoplay="true"
            id="video"
            :class='[searching ? "video_searching" : ""]'
        >
        </video>
        <!-- <i
            class='material-icons touchme'
            v-if="!searching"
        >touch_app</i> -->
        <i
            class='material-icons searching turning'
            v-if='searching'
        >hourglass_bottom</i>
        <div
            class='message'
            v-if='message'
        >{{message}}</div>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            take_pic: true,
            searching: false,
            done: false,
            message: null,
        };
    },
    async mounted() {
        this.start_video();
        // Vue.set(this, "searching", true);
        setTimeout(() => {
            this.set_product_id("29304001");
            Vue.set(this, "searching", false);
        }, 0);
        // setTimeout(() => {
        //     this.set_product_id("09278338");
        //     Vue.set(this, "searching", false);
        // }, 2000);
    },
    methods: {
        set_product_id(product_id) {
            this.$emit("input", product_id);
        },
        async start_detection() {
            if (!this.take_pic) return;
            var video = this.get_video();
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas
                .getContext("2d")
                .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            resultb64 = canvas.toDataURL();
            Vue.set(this, "searching", true);
            let resp = await fetch("/api/detect", {
                method: "POST",
                body: resultb64,
                json: true,
            });
            let detect_data = await resp.json();
            let product_id = detect_data.product_id;
            if (product_id) {
                this.set_product_id(product_id);
            } else {
                Vue.set(this, "message", "code indétectable");
                setTimeout(() => {
                    Vue.set(this, "message", null);
                }, 4000);
            }
            Vue.set(this, "searching", false);
        },
        async get_video_device() {
            let devices = await navigator.mediaDevices.enumerateDevices();
            devices = devices.filter((d) => d.kind.includes("video"));
            let backs = devices.filter((d) => d.label.includes("back"));
            let device = backs.length
                ? backs[backs.length - 1]
                : devices[devices.length - 1];
            return device;
        },
        async get_stream(device) {
            if (navigator.mediaDevices.getUserMedia) {
                return await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: device.deviceId },
                    },
                });
            }
            return null;
        },
        get_video() {
            return document.getElementById("video");
        },
        async start_video() {
            let video = this.get_video();
            let stream = await this.get_stream(await this.get_video_device());
            video.srcObject = stream;
        },
        async stop_video() {
            let video = this.get_video();
            video.srcObject = null;
        },
    },
};
</script>

<style scoped>
.camera {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #000;
}

/* .touchme {
    opacity: 0.3;
    position: fixed;
    top: 40%;
    left: 40%;
    font-size: 200px;
    transform: rotate(-20deg);
    color: #fff;
    animation: toucher 3s infinite;
} */

.searching {
    position: fixed;
    font-size: 150px;
    top: calc(50% - 70px);
    left: calc(50% - 70px);
    color: #fff;
}

.video_searching {
    opacity: 0.3;
    filter: contrast(0.5) brightness(2);
}

@keyframes toucher {
    0% {
        transform: scale(1) rotate(-20deg);
    }
    20% {
        transform: scale(0.8) rotate(-20deg);
    }
    50% {
        transform: scale(1) rotate(-20deg);
    }
}
</style>