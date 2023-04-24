<template>
  <div class="App">
    <Scroller :arrSignals="arrSignals" @setPart="setPart"/>
    <Slider :partSliders="partSliders"/>
  </div>
</template>

<script>
import Scroller from "./components/Scroller";
import Slider from "./components/Slider";

const arrSignals=  [
    {id: 3, title: "Города", part: "city" },
    {id: 2, title: "Животные", part: "animal" },
    {id: 1, title: "Природа", part: "nature" },
    {id: 4, title: "Море и океан", part: "sea" },
    {id: 5, title: "Машины", part: "car" },
    {id: 6, title: "Рыбы", part: "fish" },
    {id: 7, title: "Люди", part: "people" },
    {id: 8, title: "Насекомые", part: "bug" }
]

export default {
  name: 'App',
  components: {
    Scroller,
    Slider
  },
  data() {
    return {
      partSliders: arrSignals[0].part,
      arrSignals: arrSignals
    }
  },
  methods: {
    setPart(val) {
      this.partSliders = val;
    }
  }
}
</script>

<style lang="stylus">
  :root
    --index: calc(1vh + 1vw)

  body
    margin: 0
    padding: 0
    min-height 100vh
    background #F0F9FF
    display flex
    flex-direction column

  body * 
    margin 0
    padding 0
    box-sizing border-box

  .App
    flex-grow 1
    display: flex
    padding 8px
    gap 8px
    width calc(100vw -  16px)
    height calc(100vh - 16px)
    margin 0
    overflow hidden
</style>
