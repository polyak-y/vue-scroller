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
        pointerdownHandler(e) {
            this.pressed = true;
            this.caretEl = this.$refs.caret;
            this.trackEl = this.$refs.track;
            this.wrapSignalsEl = this.$refs.wrapSignals;
            this.firstCoordinate = e.pageY;
            this.currentPosition = (new WebKitCSSMatrix(getComputedStyle(this.caretEl).transform)).m42;
            // максимальная позиция каретки (на какое расстояние она может опуститься)
            this.maxPosition = this.trackEl.clientHeight - this.caretEl.clientHeight;
            // максимальный скролл контента
            this.maxScroll = this.$refs.signals.scrollHeight - this.$refs.signals.clientHeight;

            const wrapSignalsHeight = this.$refs.wrapSignals.getBoundingClientRect().height;
            const trackHeight = this.trackEl.getBoundingClientRect().height;
            const caretHeight = this.caretEl.getBoundingClientRect().height;
            // от высоты контента отнимаем две высоты трека ползунка, чтобы узнать сколько доп. пискселей
            let diff = wrapSignalsHeight - (trackHeight * 2 + 23 / 2);
            this.dopPixel = diff <= 0 ? 0 : diff / (trackHeight - caretHeight + 23 / 2);

            document.onpointermove = this.pointerMoveHandler //тащим ползунок
            document.onpointerup = this.pointerUpHandler // отпускаем ползунок и очищаем события
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
              this.caretEl.style.transform = "translate3d(0, 0, 0)";
              return;
            }
            if (diff >= this.maxPosition) {
              this.caretEl.style.transform = `translate3d(0, ${this.maxPosition}px, 0)`;
              return
            }
            this.caretEl.style.transform = `translate3d(0, ${diff}px, 0)`;
            if (diff < this.maxScroll) {
              this.wrapSignalsEl.style.transform = `translate3d(0, ${diffScroll * -1}px, 0)`;
            }
        },
        pointerUpHandler() {
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
        goToSection(e, ind) {
            if (ind === this.indexHovered) return;
            const findPart = this.arrSignals.find((_, index) => index === ind);
            this.$emit("setPart", findPart.part);
            this.indexHovered = ind;

            const caret = this.$refs.caret;
            const wrapSignals = this.$refs.wrapSignals;
            const wrapSignalsHeight = wrapSignals.getBoundingClientRect().height
            const trackHeight = this.$refs.track.getBoundingClientRect().height;
            const target = e.currentTarget;
            const targetTop = target.getBoundingClientRect().top;
            const caretTop = caret.getBoundingClientRect().top;

            const maxScroll = this.$refs.signals.scrollHeight - this.$refs.signals.clientHeight;
            const caretPosition = (new WebKitCSSMatrix(getComputedStyle(caret).transform)).m42;
            const wrapSignalsPosition = (new WebKitCSSMatrix(getComputedStyle(wrapSignals).transform)).m42;

            let distance = targetTop - caretTop; // на какое количество пикселей цель находится от каретки
            const vector = distance < 0 ? "top" : "bottom";

            const caretHeight = caret.getBoundingClientRect().height;
            let diff = wrapSignalsHeight - (trackHeight * 2 + 23 / 2);
            const dopPixel = diff <= 0 ? 0 : diff / (trackHeight - caretHeight + 23 / 2);

            const objectForFunctions = {
                distance,
                wrapSignals,
                maxScroll,
                caretPosition,
                wrapSignalsPosition,
                caret,
                dopPixel
            }

            if (vector === "bottom") { // нажал вниз
                this.goBottom(objectForFunctions)
            } else {
                this.goTop(objectForFunctions);
            }
        },
        goBottom(objData) {
            let distance = objData.distance + 24;
            const wrapSignals = objData.wrapSignals;
            const maxScroll = objData.maxScroll;
            const caretPosition = objData.caretPosition;
            const wrapSignalsPosition = objData.wrapSignalsPosition;
            const caret = objData.caret;
            const dopPixel = objData.dopPixel;

            let diff = maxScroll - caretPosition; // смотрим сколько скролла еще осталось от каретки
            if (diff < 0) diff = 0;

            // скорость каретки в условную единицу
             const speedCaret = 1 / (1 + dopPixel);
            // скорость скролла в условную единицу
            const speedScroll = !diff ? 0 : 1;
            // общая скорость приближения каретки и скролла
            const sumSpeed = speedScroll + speedCaret;
            // через какой время каретка и цель встретяться
            const meetingTime = distance / sumSpeed;
            // сколько проедет каретка за указанное выше время
            let scrollingCaret = speedCaret * meetingTime
            // сколько проедет скролл за указанное выше время
            let scrollingContent = meetingTime * speedScroll
            if (diff < scrollingContent)  {
              scrollingContent = diff
              scrollingCaret = distance - diff
            }
            caret.style.transform = `translate3d(0px, ${caretPosition + scrollingCaret}px, 0px)`
            wrapSignals.style.transform = `translate3d(0px, ${(wrapSignalsPosition) - scrollingContent}px, 0px)`
        },
        goTop(objData) {
          let distance = Math.abs(objData.distance) - 24;
          const wrapSignals = objData.wrapSignals;
          const maxScroll = objData.maxScroll;
          const caretPosition = objData.caretPosition;
          const wrapSignalsPosition = Math.abs(objData.wrapSignalsPosition);
          const caret = objData.caret;
          const dopPixel = objData.dopPixel;

          let dopDistance = 0;
          if (caretPosition > maxScroll && maxScroll > 0) {
            dopDistance = caretPosition - maxScroll
          }
          // скорость каретки в условную единицу
          const speedCaret = 1 / (1 + dopPixel);
          // скорость скролла в условную единицу
          const speedScroll = 1;
          // общая скорость приближения каретки и скролла
          const sumSpeed = speedScroll + speedCaret;
          // через какой время каретка и цель встретяться
          const meetingTime = (distance - dopDistance) / sumSpeed;
          // сколько проедет каретка за указанное выше время
          let scrollingCaret = (speedCaret * meetingTime) + dopDistance
          // сколько проедет скролл за указанное выше время
          let scrollingContent = meetingTime * speedScroll

          if (maxScroll === 0) {
            scrollingContent = 0
            scrollingCaret = distance
          }

          caret.style.transform = `translate3d(0px, ${caretPosition + (scrollingCaret * -1)}px, 0px)`
          wrapSignals.style.transform = `translate3d(0px, ${(wrapSignalsPosition * -1) + scrollingContent}px, 0px)`
        }
    }
}
