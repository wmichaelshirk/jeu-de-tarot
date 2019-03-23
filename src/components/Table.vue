<template>
    <section id="game-container" :class="Object.assign({}, deckMode, playerMode)">
        <NewGame v-if="showNewGame" 
            :score="score"
            :players="players" 
            @new-game="newGame"
            @start-over="startOver" />
        <Bid v-if="showBid"
            :bids="bids"
            :moves="moves"
            :players="players"
            v-on:do-move="doMove"/>
        <Purchase v-if="showPurchase"
            :moves="moves"
            :do-move="doMove"/>
        <Call v-if="showCall"
            :moves="moves"
            :do-move="doMove"/>
        <Insight
            :state="state"
            :players="players"
            :score="score"/>
        <section id="inner-container">
            <Opponent v-for="(player, index) in otherPlayers"
                :key="index"
                :id="'opponent' + (index + 1)"
                :speech="speech[index + 1]"
                :name="player"
                :is-dealer="state.dealer == index + 1" 
                :is-declarer="state.declarer == index + 1"
                :is-turn="state.player == index + 1"
                :role="role[index+1]"/>
            <Talon v-if="showTalon" :expose="exposeTalon" 
                :cards="talonCards"/>
            <Trick v-else :history="curTrick" :winner="state.player"/>
        </section>
        <Player :name="players[0]" 
            :is-dealer="state.dealer == 0"
            :is-declarer="state.declarer == 0"
            :is-turn="state.player == 0"
            :hand="getHand(0)" 
            :moves="moves"
            :speech="speech[0]"
            :role="role[0]"
            :do-move="doMove"/>
    </section>
</template>

<script>
import ai from '../ai/computer-player'
import Bid from './Bid'
import Game from '../game/tarot-game'
import Insight from './Insight'
import NewGame from './NewGame'
import Opponent from './Opponent'
import Player from './Player'
import Talon from './Talon'
import Trick from './Trick'
import Purchase from './Purchase'
import Call from './Call'

import { updateSpeech, updateRole } from '../language'
import { types, bids } from '../game/tarot-play'
import { toPrettyString } from '../game/deck'
import { initializeScore, stakePot, updateScore } from '../game/tarot-score'

let game
let state
let score
let speech
let role

export default {
    name: 'Table',
    components: {
        Bid, Insight, Opponent, Player, Talon, Trick, Purchase, Call, NewGame
    },
    props: {
        deckStyle: String,
        numPlayers: Number,
        players: Array
    },
    data () {
        return {
            game: game,
            state: state,
            score: score,
            originalTalon: [],
            speech: [],
            role: []
        }
    },
    created() {
        this.game = new Game()
        this.state = this.game.start(this.numPlayers)
        this.score = initializeScore(this.state)
        this.originalTalon = this.state.talon.slice()
        this.speech = []
        this.role = []
    },
    mounted() {
        this.start()
    }, 
    methods: {
        doMove(move) {
            this.state = this.game.nextState(this.state, move)
            this.speech = updateSpeech(this, this.speech, this.state)
            this.role = updateRole(this, this.role, this.state)

            if (this.state.player == 0) { 
                printHand(this.state.playerHands[this.state.player])
            } else if (this.game.legalPlays(this.state).length) {
                ai(this.state)
                    .then(move => {
                        // eslint-disable-next-line
                        console.log(`${this.players[move.player]}: ${move.type} ${move.value}`)
                        if ([types.BID, types.CALL, types.PURCHASE].includes(move.type) && move.value != bids.PASSE) {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                        this.$set(this.speech, [move.player], "")
                                        resolve(move)
                                    }, 500)
                            })
                        } else {
                            return move
                        }
                    })
                    .then(move => {
                        this.doMove(move)
                    })
            } else {
                // eslint-disable-next-line
                console.log('game over')
                console.log(this.game.winner(this.state))
            }
            if (this.game.winner(this.state) != null) {
                this.score = updateScore(this.game, this.score, this.state)
                // eslint-disable-next-line
                console.log("Declarer: " + this.state.declarer + ", Bid: " + this.state.bid + ", Score: " + this.game.winner(this.state, this.state.declarer))
            }
        },
        getHand(playerIndex) {
            let hand = [...this.state.playerHands[playerIndex]]
            hand.sort((a, b) => b - a)
            return hand
        },
        newGame() {
            this.state = this.game.newGame(this.state)
            this.score = stakePot(this.score, this.state)
            this.originalTalon = this.state.talon.slice()
            this.speech = updateSpeech(this.speech, this.state)
            this.role = updateRole(this.role, this.state)
            this.start()
        },
        start() {
            if (this.state.player != 0 && this.game.legalPlays(this.state).length) {
                ai(this.state)
                    .then(move => {
                        // eslint-disable-next-line
                        console.log(`${this.players[move.player]}: ${move.type} ${move.value}`)
                        this.doMove(move)
                    })
            } else {
                printHand(this.state.playerHands[this.state.player])
            }
        },
        startOver() {
            this.$emit('start-over')
        }

    },
    computed: {
        bids() {
            return this.state.playHistory.slice(0, this.numPlayers - 1)
        },
        curPlayer() {
            return this.players[this.state.player]
        },
        curTrick() {
            const history = this.state.playHistory.slice().reverse()
            const leadIndex = history.map(h => h.type).indexOf("lead")
            return (leadIndex > -1) ? history.slice(0, leadIndex + 1) : []
        },
        dealer() {
            return this.players[this.state.dealer]
        },
        deckMode() {
            return {
                'marseille': this.deckStyle == 'marseille',
                'nouveau': this.deckStyle == 'nouveau'
            }
        },
        declarer() {
            return this.players[this.state.declarer]
        },
        moves() {
            return this.game.legalPlays(this.state)
        },
        otherPlayers() {
            return this.players.filter((p, i) => i != 0)
        },
        playerMode() {
            return {
                'three-player': this.numPlayers == 3,
                'four-player': this.numPlayers == 4,
                'five-player': this.numPlayers == 5
            }
        },
        showBid() {
            return this.state.player == 0 && this.moves[0] && this.moves[0].type == types.BID
        },
        showPurchase() {
            return this.state.player == 0 && this.moves[0] && 
            this.moves.every(move => [types.SELL, types.PURCHASE].includes(move.type))
        },
        showCall() {
            return this.state.player == 0 && this.moves[0] && (this.moves.find(move => move.type == types.CALL))
        },
        showTalon() {
            return this.moves[0] && ![types.LEAD, types.FOLLOW].includes(this.moves[0].type)
        },
        exposeTalon() {
            return [types.DISCARD].includes(this.moves[0].type)
        },
        talonCards() {
            return this.state.declarer === 0 && this.state.talon.size > 0 ? [...this.state.talon] :  this.originalTalon
        },
        showNewGame() {
            return this.moves.length == 0
        }
    }
}

function printHand(hand) {
    let displayHand = [...hand]
    displayHand.sort((a, b) => b - a)
    displayHand = displayHand.map(toPrettyString)
    // eslint-disable-next-line no-console
    // console.log(displayHand.toString())
}

</script>

<style>
#game-container {
    display: grid;
    grid-gap: 10px;
    grid-template-areas:
        'inner      insight'
        'inner      .'
        'player     player ';
    grid-template-columns: auto 20%;
    grid-template-rows: auto auto 35%;
    min-height: 100%;
}
#inner-container {
    position: relative;
    grid-area: inner;
}
#insight-container { grid-area: insight; }
#player-container { grid-area: player; }
#score-container { grid-area: score; }
</style>
