<template>
    <div class='camera'>
        {{all_devices}}
        <video
            width="100%"
            height="100%"
            autoplay="true"
            id="video"
        >
        </video>
    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            all_devices: [],
        };
    },
    methods: {
        async get_devices() {
            const devices = await navigator.mediaDevices.enumerateDevices();
            Vue.set(this, "all_devices", devices);
            return devices;
        },
        async get_stream() {
            if (navigator.mediaDevices.getUserMedia) {
                return await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
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
            let stream = await this.get_stream();
            video.srcObject = stream;
        },
        async stop_video() {
            let video = this.get_video();
            video.srcObject = null;
        },
    },
    async mounted() {
        console.log(await this.get_devices());
        await this.start_video();
        window.STOP = this.stop_video;
        window.START = this.start_video;
    },
};
</script>

<style scoped>
.camera {
    width: 100%;
    height: 100%;
    background: #000;
}
</style>