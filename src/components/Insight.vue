<template>
    <section id="insight-container">
        <h1>Insight</h1>
        <div>
            Pots: {{ score.pots.join(', ') }}
        </div>
        <div>
            Points taken: {{ stats.cardpoints + (showPartner ? stats.partnerPoints : 0) + (gameOver ? stats.talonPoints : 0) }} / {{ showPartner ? stats.target : stats.declarerTarget }}
        </div>
        <div>
            Trumps played: {{ trumpsPlayed }}
        </div>
    </section>
</template>

<script>
import Game from '../game/tarot-game.js'
import { types } from '../game/tarot-play'
import { TRUMP } from '../game/deck'
const game = new Game()

export default {
    name: 'Insight',
    props: {
        state: Object,
        players: Array,
        score: Object
    },
    computed: {
        stats() {
            return game.winnerStats(this.state)
        },
        trumpsPlayed() {
            return this.state.playHistory
                .filter(play => (play.type == types.LEAD ||
                    play.type == types.FOLLOW) && TRUMP(play.value))
                .length
        },
        showPartner() {
            let calledKing = this.state.playHistory
                .find(play => play.type == types.CALL)
            calledKing = calledKing && calledKing.value
            return this.state.partner != null &&
                this.state.playHistory.find(play => 
                (play.type == types.LEAD || play.type == types.FOLLOW) && play.value == calledKing)
        },
        gameOver() {
            return this.state.playerHands.every(h => h.size == 0)
        }
    }

}
</script>

<style>
#insight-container {
    background-color: var(--theme-green);
    color: white;
    padding: 1em;
}
</style>
