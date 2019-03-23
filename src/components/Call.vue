<template>
    <transition name="modal">
        <div class="modal-wrapper">
            <div class="modal">
                <h1>Call for a partner</h1> 
                <div class="modal-body">
                    <p v-if="hasPurchaseMoves">If you would prefer to make a purchase and play alone, select one of your cards to give. If you would prefer to play with a partner, select a card below:</p>
                    <div class="inner-container">
                        <Card class="player-cards-item"
                            v-for="move in callMoves" 
                            :key="move.value" :card="move.value" 
                            :is-playable="true" 
                            v-on:do-move="doMove" 
                            :move="move"/>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { bids, types } from '../game/tarot-play'
import { deck, getSuit } from '../game/deck'

import Card from './Card'
export default {
    name: 'Bid',
    components: {
        Card
    },
    props: {
        doMove: Function,
        moves: Array,
    },
    computed: {
        callMoves() {
            return this.moves.filter(move => move.type == types.CALL)
        },
        hasPurchaseMoves() {
            return this.moves.find(move => move.type == types.SELL)
        }
    }
}
</script>

<style>
.inner-container {
    display: flex;
    justify-content: space-around;
    align-items: end;
}
.pile {
    display: inline-flex;
    flex-flow: column-reverse;
    width: 20%;
    vertical-align: top;
}

</style>
