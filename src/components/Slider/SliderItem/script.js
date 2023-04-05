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
        }
    },
    data() {
        return {
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
    }
}
