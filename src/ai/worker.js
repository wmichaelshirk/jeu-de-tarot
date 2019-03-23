/* eslint-disable */

import Game from '../game/tarot-game'
import monteCarlo from './monte-carlo'
import State from '../game/tarot-state'
import { movePolicy } from './monte-carlo'

let game = new Game()

self.onmessage = function(e) {
    let { 
        numberOfPlayers, dealer, player, phase,
        playHistory, playerHands, talon, currentTrick, 
        playerTricks 
    } = e.data
    let state = new State(numberOfPlayers, dealer, player, phase, playHistory, playerHands, talon, currentTrick, playerTricks)
    state.setContract(e.data.declarer, e.data.bid)

    /*12-5-2018: 
        at 3/4 of a second: 645-826 (bidding - discards); 1275 halfway through.
        at 1 second: 945-1169 (bidding, first plays)

        Making "Play" immutable, and using an immutable Map in the Node, to ease hashing: 374 bidding. :-O  Undo.

    */
    /* Right now we're hitting 1100+ iterations per second;
    Cowling et al's Spades version did 2500 in 1/4 second.
    */

    let time = 1
    let ucb = 350
    // if (state.phase == 'BID') {
    //     time = 2
    // } else {
    //     time = 1
    // }
    let move = monteCarlo(game, state, time, movePolicy.ROBUST_CHILD, ucb)
    self.postMessage(move)
}