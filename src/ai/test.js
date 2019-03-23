// @ts-nocheck
import Game from '../game/tarot-game'
import { evaluateHand } from './computer-player'
import { movePolicy } from './monte-carlo'
import monteCarlo from './monte-carlo'

let game = new Game()

let originalState = game.start(3)
originalState.ucb=[1000, 1000, 950]

console.log('starting test')
for (let x = 0; x < 100; x++) {
    let state = originalState.clone()
    state.ucb = [1000, 1000, 50 + x * 10]

    let moves = game.legalPlays(state)
    while (moves.length) {
        let move;
        if (state.phase == 'BID') {
            let bid = evaluateHand(state.playerHands[state.player])
            let moves = game.legalPlays(state)
            move = moves.find(m => m.value == bid)
            if (!move) move = moves.find(m => m.value == bids.PASSE)
        } else {
            move = monteCarlo(game, state, 1, movePolicy.ROBUST_CHILD)
        }
        state = game.nextState(state, move)
        moves = game.legalPlays(state)
    }

    console.log(`ucb: ${50 + x * 10}; score: ${game.winner(state, 2)}`)
}
