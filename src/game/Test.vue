<template>
<div>
    Player: {{ curPlayer }}<br>
    {{ moves[0] && moves[0].type}}
    <span v-for="move in moves" :key="move.value">
        <button @click="doMove(move)">{{ move.value }}</button>
    </span>
</div>
</template>

<script>
import Game from './tarot-game'
import ai from '../ai/computer-player'

let game = new Game()

let players = ['Dan', 'Michael', 'Stella']
let state = game.start(3)
// let winner = null


export default {
  name: 'app',
  data () {
      return {
          state: state
      }
  },
  mounted() {
    if (this.state.player != 0 && game.legalPlays(this.state).length) {
        ai(this.state)
            .then(move => {
                // eslint-disable-next-line
                console.log(`${players[move.player]}: ${move.type} ${move.value.toString()}`)
                this.doMove(move)
            })
    } else {
        printHand(this.state.playerHands[this.state.player])
    }
  }, 
  methods: {
      doMove(move) {
        this.state = game.nextState(this.state, move)
        if (this.state.player == 0) {
            printHand(this.state.playerHands[this.state.player])
        } else if (game.legalPlays(this.state).length) {
            ai(this.state)
                .then(move => {
                    // eslint-disable-next-line
                    console.log(`${players[move.player]}: ${move.type} ${move.value.toString()}`)
                    this.doMove(move)
                })
        } else {
            // eslint-disable-next-line
            console.log('game over')
        }
        if (game.winner(this.state)) {
            // eslint-disable-next-line
            console.log("Declarer: " + this.state.declarer + ", Bid: " + this.state.bid + ", Score: " + game.winner(this.state, this.state.declarer))
        }
      }
  },
  computed: {
      curPlayer() {
          return players[this.state.player]
      },
      moves() {
          return game.legalPlays(this.state)
      }

  }
}

function printHand(hand) {
    let displayHand = [...hand]
    displayHand.sort((a, b) => b.suit.localeCompare(a.suit) || b.rank - a.rank)
    displayHand = displayHand.map(card => {
        return card.toPrettyString()
    })
    // eslint-disable-next-line no-console
    console.log(displayHand.toString())
}

</script>