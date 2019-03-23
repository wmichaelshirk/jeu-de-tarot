<template>
    <div class="card" :class="classes"
        :disabled="!isPlayable"
        @click="$emit('do-move', move)">
        <div class="card-inner">
            <div class="card-front" :class="cardFace">
                <div class="cardText">{{ string }}</div>
            </div>
            <div class="z00 card-back">
                <!-- Card Back -->
            </div>
        </div>
    </div>
</template>

<script>
import { getRank, getSuit, TRUMP } from '../game/deck';

const className = card => "bceda"[getSuit(card)] + 
        ('0' + (getRank(card) + (getSuit(card) == 4 ? 0 : 1))).slice(-2)

export default {
    name: 'Card',
    props: {
        card: Number,
        isFacedown: Boolean,
        isPlayable: Boolean,
        move: Object
    },
    computed: {
        string() {
            return TRUMP(this.card) ? getRank(this.card) : "123456789TVCDR"[getRank(this.card)] + ' ' + [
                '♣️', '♥️', '♠️', '♦️'
            ][getSuit(this.card)]
        },
        classes() {
            return {
                'facedown-card': this.isFacedown
            }
        },
        cardFace() {
            return { 
                [className(this.card)]: true ||!this.isFacedown, 
                'disabled-card': !this.isPlayable
                }
        }
    }
}
</script>

<style>
.card {
    border-radius: 0.5em;
    cursor: pointer;
    font-size: 14px;
    height: 7em;
    margin: 5px;
    width: 5em;
    margin-bottom: -2em;
    margin-right: -2em;
    display: inline-block;
    perspective: 1000px;
}
.card-inner {
  box-shadow: 0 0.0625em 0.5em rgba(0, 0, 0, 1);
  border-radius: 0.5em;
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}
.facedown-card .card-inner, card:hover .card-inner {
  transform: rotateY(180deg);
}
.card-front, .card-back {
  border-radius: 0.5em;
  position: absolute;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.card-back {
    transform: rotateY(180deg);
}
.cardText {
    vertical-align: middle;
}
.disabled-card {
    background-color: #cccccc;
    background-blend-mode: darken;
    cursor: not-allowed;
}
.facedown-card {
    cursor: not-allowed;
}
</style>
