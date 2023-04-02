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
    computed: {
        rootStyle() {
            const url = require(`../../../images/${this.src}`);
            return {
                transform: `translate3d(${this.index * 7}%, 0, -${this.index * 100}px)`, 
                zIndex: this.lengthArr - this.index,
                background: `url(${url}) no-repeat left top / cover #fff`
            }
        }
    }
}
