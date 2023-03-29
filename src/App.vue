<template>
  <div class="App">
    <Scroller />
    <Slider />
  </div>
</template>

<script>
import Scroller from "./components/Scroller";
import Slider from "./components/Slider";

export default {
  name: 'App',
  components: {
    Scroller,
    Slider
  }
}
</script>

<style lang="stylus">

  body * 
    margin 0
    padding 0
    box-sizing border-box

  .App
    display: flex
    padding 8px
    gap 8px
    min-width calc(100vw -  16px)
    max-width calc(100vw -  16px)
    min-height calc(100vh - 16px)
    max-height calc(100vh - 16px)
    margin 0

</style>
