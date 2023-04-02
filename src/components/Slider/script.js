import SliderItem from "./SliderItem";
import { getArrImages } from "@/utils/arrImages";

export default {
  name: "Slider",
  props: {
    partSliders: {
      type: String
    }
  },
  components: {
    SliderItem
  },
  data() {
      return {
        slidersArr: [],
        first: null,
        time: 500,
        stopClick: false
      }
  },
  computed: {
    rootStyle() {
      return {
        "--time": this.time + "ms"
      }
    }
  },
  watch: {
    partSliders(val) {
      this.slidersArr =  getArrImages()[val];
    }
  },
  created() {
    this.slidersArr = getArrImages()[this.partSliders];
  },
  methods: {
    nextSlide() {
      if (this.stopClick) return;
      this.first = this.slidersArr[0];
      this.slidersArr = this.slidersArr.filter((_, index) => index !== 0);
      this.stopClick = true;
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      this.stopClick = false;
    },
    enter(el, done) {
      let start = null;
      let time = this.time;
      window.requestAnimationFrame(function animate (timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start; // сколько милисекунд прошло с начала анимации
        let value = (progress / time);
        el.style.opacity = value;

        if (value < 1) {
          return window.requestAnimationFrame(animate);
        }
        el.style.opacity = 1;
        done();
      })
    },
    leave(el, done) {
      let start = null;
      let time = this.time;
      let valueTransform = 0;
      const _that = this;
      window.requestAnimationFrame(function animate (timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start; // сколько милисекунд прошло с начала анимации
        let value = (progress / time);
        valueTransform += 0.8;
        el.style.opacity = 1 - value + 0.005;
        el.style.transform = `translate3d(${valueTransform * -1 + "%"}, 0, 0)`;

        if (value < 1) {
          return window.requestAnimationFrame(animate);
        }

        setTimeout(() => {
          done();
          _that.slidersArr.push(_that.first);
        }, _that.time)
      })
    }
  }
}
