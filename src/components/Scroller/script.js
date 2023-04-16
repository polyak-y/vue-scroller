export default {
    name: "Scroller",
    props: {
        arrSignals: {
            type: Array
        }
    },
    data() {
        return {
            indexHovered: 0,
            pressed: false,
            caretEl: null,
            trackEl: null,
            wrapSignalsEl: null,
            firstCoordinate: null,
            currentPosition: null,
            maxPosition: null,
            maxScroll: null,
            dopPixel: 0
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
            return arr;
        },
        pointerMoveHandler(event) {
            const currentCoordinate = event.pageY;
            const diff = this.currentPosition + (currentCoordinate - this.firstCoordinate);
            const diffScroll = this.dopPixel ? diff + (diff * this.dopPixel) : diff;
            const caretElTop = this.caretEl.getBoundingClientRect().top;
            const getCoordinate = this.getCoordinate();

            const index = getCoordinate.findIndex(offsetTop => offsetTop > caretElTop);
            this.indexHovered = index > -1 ? index - 1 : getCoordinate.length - 1;

            if (diff <= 0) {
                console.log("g")
                this.caretEl.style.transform = "translate3d(0, 0, 0)";
                return;
            } 
            if (diff >= this.maxPosition) {
                console.log("m", this.maxPosition)
                this.caretEl.style.transform = `translate3d(0, ${this.maxPosition}px, 0)`;
                return
            }
            this.caretEl.style.transform = `translate3d(0, ${diff}px, 0)`;
            if (diff < this.maxScroll)
                console.log("g")
                this.wrapSignalsEl.style.transform = `translate3d(0, ${diffScroll * -1}px, 0)`;
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
            const findPart = this.arrSignals.find((_, index) => index === this.indexHovered);
            this.$emit("setPart", findPart.part);
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

            const wrapSignals = this.$refs.wrapSignals;
            let diff = wrapSignals.getBoundingClientRect().height - (this.trackEl.getBoundingClientRect().height * 2);
            console.log("diff", diff)
            this.dopPixel = diff <= 0 ? 0 : (diff + 23) / this.trackEl.getBoundingClientRect().height

            document.onpointermove = this.pointerMoveHandler //тащим ползунок
            document.onpointerup = this.poiterUpHandler // отпускаем ползунок и очищаем события
        },
        goToSection(e, ind) {
            if (ind === this.indexHovered) return;
            const findPart = this.arrSignals.find((_, index) => index === ind);
            this.$emit("setPart", findPart.part);
            this.indexHovered = ind;

            const caret = this.$refs.caret;
            const wrapSignals = this.$refs.wrapSignals;
            const trackEl = this.$refs.track;
            const target = e.currentTarget;
            const targetTop = target.getBoundingClientRect().top;
            const caretTop = caret.getBoundingClientRect().top;

            const maxScroll = this.$refs.signals.scrollHeight - this.$refs.signals.clientHeight;
            const caretPosition = (new WebKitCSSMatrix(getComputedStyle(caret).transform)).m42;
            const wrapSignalsPosition = (new WebKitCSSMatrix(getComputedStyle(wrapSignals).transform)).m42;

            let distance = targetTop - caretTop; // на какое количество пикселей цель находится от каретки
            const vektor = distance < 0 ? "top" : "bottom";

            let diff = wrapSignals.getBoundingClientRect().height - (trackEl.getBoundingClientRect().height * 2);
            const dopPixel = diff <= 0 ? 0 : diff / trackEl.getBoundingClientRect().height

            if (vektor === "bottom") { // нажал вниз
                this.goBottom({
                    distance,
                    wrapSignals,
                    maxScroll,
                    caretPosition,
                    wrapSignalsPosition,
                    caret,
                    dopPixel
                })
            } else {
                console.log("скроллим вверх")
                console.log("расстояние межу верхом каретки и верхом цели", distance)
                console.log("расстояние на которое опущена каретка", caretPosition)
                console.log("на какой скролл опущен контент")
                // this.goTop();

            }
        },
        goBottom({ 
            distance, 
            wrapSignals, 
            maxScroll, 
            caretPosition, 
            wrapSignalsPosition, 
            caret,
            dopPixel
        }) {
            let diff = maxScroll - caretPosition; // смотрим сколько скролла еще осталось от каретки
            if (diff < 0) diff = 0;
            distance += 26
            console.log("смотрим сколько скролла еще осталось от каретки(diff)", diff)
            console.log("Текущее положение каретки", caretPosition)
            console.log("на каком расстоянии цель от каретки(distance):", distance + "px");
            // сколько надо проскролить каретку
            let scrollingCaret;
            // сколько надо проскролить вверх контент
            let scrollingContent

            if (distance / 2 <= diff) {
                console.log(1)
                // сколько пикселей вниз прокручиваем каретку чтобы скролл контента был на 1px с учетом доп. пикселей
                const caretPixel = 1 / (1 + dopPixel);
                // общая скорость приближения каретки и цели (у каретки скорость caretPixel у цели 1)
                const sumSpeed = 1 + caretPixel;
                // через какой время каретка и цель встретяться
                const meetingTime = distance / sumSpeed;
                // умнощаем время встречи на скорость каретки и получаем расстояние встречи картеки и цели (для каретки)
                scrollingCaret = caretPixel * meetingTime
                scrollingContent = meetingTime               
            } else if (distance > diff && diff > 0) {
                console.log(2)
                scrollingContent = diff;
                scrollingCaret = (distance - diff)                
            } else if (diff === 0) {
                console.log(3)
                scrollingCaret = distance;
            }

            caret.style.transform = `translate3d(0px, ${caretPosition + scrollingCaret}px, 0px)`
            wrapSignals.style.transform = `translate3d(0px, ${(wrapSignalsPosition) - scrollingContent}px, 0px)`
        }
    }
}
