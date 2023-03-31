export default {
    name: "Scroller",
    data() {
        return {
            arrSignals: [
                {id: 3, title: "Города", part: "city" },
                {id: 1, title: "Природа", part: "tree" },
                {id: 2, title: "Животные", part: "animal" },
                {id: 4, title: "Море и океан", part: "sea" },
                {id: 5, title: "Машины", part: "car" },
                {id: 6, title: "Рыбы", part: "fish" },
                {id: 7, title: "Люди", part: "man-and-woman" },
                {id: 8, title: "Насекомые", part: "bug" },
            ],
            indexHovered: 0,
            pressed: false,
            caretEl: null,
            trackEl: null,
            wrapSignalsEl: null,
            firstCoordinate: null,
            currentPosition: null,
            maxPosition: null,
            maxScroll: null
        }
    },
    computed: {
        caretClass() {
            return {
                pressed: this.pressed
            }
        }
    },
    created() {
        console.log("created");
        this.$emit("setPart", this.arrSignals[0].part)
    },
    methods: {
        getCoordinate() {
            const allblocks = document.querySelectorAll(".instrument")
            let arr = [];
            allblocks.forEach((node, index) => {
                const top = node.getBoundingClientRect().top;
                arr[index] = top;
            })
            return arr
        },
        pointerMoveHandler(event) {
            const currentCoordinate = event.pageY;
            const diff = this.currentPosition + (currentCoordinate - this.firstCoordinate);
            const caretElTop = this.caretEl.getBoundingClientRect().top;
            const getCoordinate = this.getCoordinate();

            const index = getCoordinate.findIndex(offsetTop => offsetTop > caretElTop);
            this.indexHovered = index > -1 ? index - 1 : getCoordinate.length - 1;

            if (diff <= 0) {
                this.caretEl.style.transform = "translate3d(0, 0, 0)";
                return;
            } 
            if (diff >= this.maxPosition) {
                this.caretEl.style.transform = `translate3d(0, ${this.maxPosition}px, 0)`;
                return
            }
            this.caretEl.style.transform = `translate3d(0, ${diff}px, 0)`
            if (diff < this.maxScroll)
                this.wrapSignalsEl.style.transform = `translate3d(0, ${diff * -1}px, 0)`;
        },
        poiterUpHandler() {
            document.onpointermove = null; //очищаем события
            document.onpointerup = null; // очищаем события  
            this.pressed = false;
            this.caretEl = null;
            this.trackEl = null;
            this.wrapSignalsEl = null;
            this.firstCoordinate = null;
            this.currentPosition = null;
            this.maxPosition = null;
            this.maxScroll = null;
            const findPart = this.arrSignals.find((_, index) => index === this.indexHovered)
            this.$emit("setPart", findPart.part)
        },
        pointerdownHandler(e) {
            this.pressed = true;
            this.caretEl = this.$refs.caret;
            this.trackEl = this.$refs.track;
            this.wrapSignalsEl = this.$refs.wrapSignals;
            this.firstCoordinate = e.pageY;
            this.currentPosition = (new WebKitCSSMatrix(getComputedStyle(this.caretEl).transform)).m42;
            this.maxPosition = this.trackEl.clientHeight - this.caretEl.clientHeight;
            this.maxScroll = this.$refs.signals.scrollHeight - this.$refs.signals.clientHeight;

            document.onpointermove = this.pointerMoveHandler //тащим ползунок
            document.onpointerup = this.poiterUpHandler // отпускаем ползунок и очищаем события
        }
    }
}