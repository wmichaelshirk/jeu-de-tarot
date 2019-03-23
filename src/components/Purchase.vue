<template>
    <transition name="modal">
        <div class="modal-wrapper">
            <div class="modal">
                <h1>Purchase</h1> 
                <div class="modal-body">
                    <p v-if="moves[0].type == 'sell'">Select a card to trade.</p>
                    <div v-else class="inner-container">
                        <div v-for="(suit, index) in movePiles" class="pile" :key="index">
                            <Card class="player-cards-item"
                                v-for="move in suit" 
                                :key="move.value" :card="move.value" 
                                :is-playable="true" 
                                v-on:do-move="doMove" 
                                :move="move"/>
                        </div>
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
        movePiles() {
            return this.moves.reduce((acc, el) => {
                acc[getSuit(el.value)] = (acc[getSuit(el.value)] || []).concat(el)
                return acc
            }, {})
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
