export default {
    name: "Scroller",
    data() {
        return {
            arrSignals: [
                {id: 1, title: "Все", count: 1457 },
                {id: 2, title: "AUDJPY", count: 20 },
                {id: 3, title: "AUDACD", count: 17 },
                {id: 4, title: "AUDUSD", count: 37},
                {id: 5, title: "CADCHF", count: 5 },
                {id: 6, title: "CADJPY", count: 14 },
                {id: 7, title: "CADUSD", count: 21 },
                {id: 8, title: "CHFHUF", count: 19 },
                {id: 9, title: "GBPUSD", count: 21 },
                {id: 10, title: "CADJPY", count: 45 },
                {id: 11, title: "USDJPY", count: 8 },
                {id: 12, title: "USDRUB", count: 17 },
                {id: 13, title: "IUYGBN", count: 21 },
                {id: 14, title: "PLOTGB", count: 19 },
                {id: 15, title: "TREDCV", count: 21 },
                {id: 16, title: "NJUREW", count: 45 },
                {id: 17, title: "RYHNJI", count: 8 },
                {id: 18, title: "KIUIKM", count: 17 },
                {id: 19, title: "IUYTGB", count: 19 },
                {id: 20, title: "MKOUHB", count: 21 },
                {id: 21, title: "BGTYFV", count: 45 },
                {id: 21, title: "EDCDER", count: 8 },
                {id: 23, title: "OIUYTR", count: 17 }
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

            const index = getCoordinate.findIndex(offsetTop => offsetTop > caretElTop)
            this.indexHovered = index > -1 ? index - 1 : getCoordinate.length - 1;

            if (diff <= 0) {
                this.caretEl.style.transform = "translate3d(0, 0, 0)";
                return;
            } 
            if (diff >= this.maxPosition) {
                this.caretEl.style.transform = `translate3d(0, ${this.maxPosition}px, 0)`
                return
            }
            this.caretEl.style.transform = `translate3d(0, ${diff}px, 0)`
            if (diff < this.maxScroll)
                this.wrapSignalsEl.style.transform = `translate3d(0, ${diff * -1}px, 0)`

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
        },
        pointerdownHandler(e) {
            this.pressed = true;
            this.caretEl = this.$refs.caret;
            this.trackEl = this.$refs.track;
            this.wrapSignalsEl = this.$refs.wrapSignals;
            this.firstCoordinate = e.pageY;
            this.currentPosition = (new WebKitCSSMatrix(getComputedStyle(this.caretEl).transform)).m42
            this.maxPosition = this.trackEl.clientHeight - this.caretEl.clientHeight;
            this.maxScroll = this.$refs.signals.scrollHeight - this.$refs.signals.clientHeight

            
            document.onpointermove = this.pointerMoveHandler //тащим ползунок

            document.onpointerup = this.poiterUpHandler // отпускаем ползунок и очищаем события
        }
    }
}