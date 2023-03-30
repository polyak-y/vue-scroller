export default {
    name: "SliderItem",
    props: {
        index: {
            type: Number
        },
        lengthArr: {
            type: Number
        },
        count: {
            type: Number
        }
    },
    computed: {
        rootStyle() {
            return {
                transform: `translate3d(${this.index * 7}%, 0, -${this.index * 100}px)`, 
                zIndex: this.lengthArr - this.index
            }
        }
    }
}