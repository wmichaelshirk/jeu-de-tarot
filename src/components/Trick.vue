<template>
    <section id="trick-container">
        <transition-group name="trick" id="cards" tag="div">
            <div v-for="(play, index) in history" :key="play.value"
                :id="'play' + play.player" :class="['play', 'play'+winner, play.value==56?'fool':'']" :style="{ zIndex: history.length - index }">
                <Card :card="play.value" :is-playable="true" />
            </div>
        </transition-group>
    </section>
</template>

<script>
import Card from './Card'

export default {
    name: 'Trick',
    components: {
        Card
    },
    props: {
        history: Array,
        winner: Number
    }
}
</script>

<style>
#trick-container {
    height: 25vw;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20vw;
}
#cards {
    height: 0;
    padding-bottom: 125%;
    position: relative;
}
.play {
  position: absolute;
  width: 40%;
}
/* Three player mode */
.three-player #play0 {
    bottom: 50%;
    left: 30%;
}
.three-player #play1 {
    right: 10%;
}
.three-player #play2 {
    left: 15%;
}
/* Four player mode */
.four-player #play0 {
    bottom: 30%;
    right: 30%;
}
.four-player #play1 {
    right: 0%;
    top: 25%;
}
.four-player #play2 {
    right: 30%;
    top: 5%;
}
.four-player #play3 {
    top: 25%;
    /* left: 15%; */
}
/* Five player mode */
.five-player #play0 {
    bottom: 30%;
    left: 28%;
}
.five-player #play1 {
    right: 0%;
    top: 20%;
}
.five-player #play2 {
    right: 15%;
}
.five-player #play3 {
    left: 10%;
}
.five-player #play4 {
    left: 0%;
    top: 20%;
}

/* Transitions */
.trick-enter-active, .trick-leave-active {
  transition: all .5s;
  will-change: transform, opacity;
}
.trick-enter, .trick-leave-to {
  opacity: 0;
}

.three-player .trick-enter#play0,
.three-player .trick-leave-to.play0,
.three-player .trick-leave-to#play0.fool {
    transform: translateY(5em);
}
.three-player .trick-enter#play1,
.three-player .trick-leave-to.play1,
.three-player .trick-leave-to#play1.fool {
    transform: translateX(5em) translateY(-3em);
}
.three-player .trick-enter#play2,
.three-player .trick-leave-to.play2,
.three-player .trick-leave-to#play2.fool {
    transform: translateX(-5em) translateY(-3em);
}

.four-player .trick-enter#play0,
.four-player .trick-leave-to.play0,
.four-player .trick-leave-to#play0.fool {
    transform: translateX(-50%);
    transform: translateY(5em);
}
.four-player .trick-enter#play1,
.four-player .trick-leave-to.play1,
.four-player .trick-leave-to#play1.fool  {
    transform: translateX(5em);
}
.four-player .trick-enter#play2,
.four-player .trick-leave-to.play2,
.four-player .trick-leave-to#play2.fool  {
    transform: translateY(-5em);
}
.four-player .trick-enter#play3,
.four-player .trick-leave-to.play3,
.four-player .trick-leave-to#play3.fool  {
    transform: translateX(-5em);
}

.five-player .trick-enter#play0,
.five-player .trick-leave-to.play0,
.five-player .trick-leave-to#play0.fool  {
    transform: translateY(5em);
}
.five-player .trick-enter#play1,
.five-player .trick-leave-to.play1,
.five-player .trick-leave-to#play1.fool {
    transform: translateX(5em) translateY(3em);
}
.five-player .trick-enter#play2,
.five-player .trick-leave-to.play2,
.five-player .trick-leave-to#play2.fool {
    transform: translateX(4em) translateY(-5em);
}
.five-player .trick-enter#play3,
.five-player .trick-leave-to.play3,
.five-player .trick-leave-to#play3.fool {
    transform: translateX(-4em) translateY(-5em);
}
.five-player .trick-enter#play4,
.five-player .trick-leave-to.play4,
.five-player .trick-leave-to#play4.fool {
    transform: translateX(-5em) translateY(3em);
}
</style>
