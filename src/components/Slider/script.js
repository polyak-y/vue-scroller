export default {
    name: "Slider",
    data() {
        return {
          slidersArr: [1,2,3,4,5,6,7],
          first: null,
          time: 500
        }
    },
    computed: {
      rootStyle() {
        return {
          "--time": this.time + "ms"
        }
      }
    },
    methods: {
      nextSlide() {
        this.first = this.slidersArr[0];
        this.slidersArr = this.slidersArr.filter((item, index) => index !== 0)
      },
      beforeEnter(el) {
        el.style.opacity = 0
      },
      enter(el, done) {
        let start = null;
        let time = this.time;
        window.requestAnimationFrame(function animate (timestamp) {
          if (!start) start = timestamp;
          let progress = timestamp - start // сколько милисекунд прошло с начала анимации
          let value = (progress / time)
          el.style.opacity = value

          if (value < 1) {
            return window.requestAnimationFrame(animate)
          }
          done()
        })
      },
      leave(el, done) {
        let start = null;
        let time = this.time;
        let valueTransform = 0
        const _that = this
        window.requestAnimationFrame(function animate (timestamp) {
          if (!start) start = timestamp;
          let progress = timestamp - start // сколько милисекунд прошло с начала анимации
          let value = (progress / time)
          valueTransform += 0.8
          el.style.opacity = 1 - value + 0.005
          el.style.transform = `translate3d(${valueTransform * -1 + "%"}, 0, 0)`

          if (value < 1) {
            return window.requestAnimationFrame(animate)
          }

          setTimeout(() => {
            done()
            _that.slidersArr.push(_that.first)
          }, _that.time)
        })
      }
    }
}