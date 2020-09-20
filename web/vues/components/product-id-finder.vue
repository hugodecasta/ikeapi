<template>
    <div class='camera'>
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
    methods: {
        async get_stream() {
            if (navigator.mediaDevices.getUserMedia) {
                try {
                    return await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: { exact: "environment" },
                        },
                    });
                } catch (e) {
                    return await navigator.mediaDevices.getUserMedia({
                        video: null,
                    });
                }
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