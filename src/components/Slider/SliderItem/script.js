export default {
    name: "SliderItem",
    props: {
        index: {
            type: Number
        },
        lengthArr: {
            type: Number
        },
        src: {
            type: String
        },
        nextSlide: {
            type: Function
        }
    },
    data() {
        return {
            x1: null,
            backgroundSrcImage: null
        }
    },
    computed: {
        rootStyle() {
            return {
                transform: `translate3d(${this.index * 7}%, 0, -${this.index * 100}px)`, 
                zIndex: this.lengthArr - this.index                
            }
        },
        imageBlockStyle() {
            if (!this.backgroundSrcImage) return false;
            return {
                background: `url(${this.backgroundSrcImage}) no-repeat left top / cover #fff`
            }
        }
    },
    mounted() {
        const img = new Image();
        const url = require(`../../../images/${this.src}`);
        img.src = url;
        img.addEventListener("load", () => {
            this.backgroundSrcImage = url;
        })
    },
    methods: {
        touchstartHandler(e) {
            const firstTouch = e.touches[0];
            this.x1 = firstTouch.clientX
        },
        touchmoveHandler(e) {
            if (!this.x1) return;
            let x2 = e.touches[0].clientX
            let xDiff = x2 - this.x1
            if (xDiff < -50) {
                this.nextSlide()
            }
        }
    }
}
