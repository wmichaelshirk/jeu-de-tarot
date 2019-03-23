<template>
    <section id="player-container">
        <transition-group name="player-cards" class="player-cards">
            <Card class="player-cards-item"
                v-for="card in hand" 
                :key="card" :card="card" 
                :is-playable="isPlayable(card)" 
                v-on:do-move="doMove" 
                :move="getMove(card)" />
        </transition-group>
        <div id="player-avatar-container" :class="{'dealer': isDealer}">
            <Avatar id="player-avatar"
                :is-turn="isTurn" :speech="speech" :is-declarer="isDeclarer" :name="name"
                :is-dealer="isDealer"
                :role="role"/>
        </div>
    </section>
</template>

<script>
import Avatar from './Avatar'
import Card from './Card'

export default {
    name: 'Player',
    components: {
        Avatar, Card
    },
    props: {
        speech: String,
        role: String,
        doMove: Function,
        hand: Array,
        isDealer: Boolean,
        isDeclarer: Boolean,
        isTurn: Boolean,
        moves: Array,
        name: String
    },
    methods: {
        getMove(card) {
            if (this.isPlayable(card)) {
                return this.moves.find(m => m.value == card)
            }
        },
        isPlayable(card) {
            return this.isTurn && this.playableCards.some(c => c == card)
        }
    },
    computed: {
        playableCards() {
            return this.moves.map(move => move.value)
        }
    }
}
</script>

<style scoped>
#player-container {
    bottom: 0;
    box-sizing: border-box;
    display: grid;
    grid-template-areas:
        'cards avatar';
    grid-template-columns: auto 16%;
    min-height: 9em;
    overflow: hidden;
    position: absolute;
    text-align: center;
    width: 100%;
}
#player-avatar-container {
    padding: 1em;
}
#player-avatar {
    grid-area: avatar;
    padding-bottom: 100%;
    position: relative;
    width: 100%;
}
.player-cards-item {
    display: inline-block;
    transition: all 1s;
}
.player-cards-enter, .player-cards-leave-to
{
    opacity: 0;
    transform: translateY(-200px);
}
.player-cards-leave-active {
    position: absolute;
}
.player-cards {
    display: flex;
    flex-wrap: wrap;
    grid-area: cards;
    justify-content: center;
}
</style>
