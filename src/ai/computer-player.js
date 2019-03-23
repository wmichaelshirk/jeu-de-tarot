// 
// Make a choose computer move function that returns a promise;
// fires it across to the webworker, and resolves on the response.
/* eslint-disable */

import { EXCUSE, PAGUET, MONDE, TRUMP, getRank, getSuit, toPrettyString } from "../game/deck";
import { bids } from '../game/tarot-play'
import Game from '../game/tarot-game'
import monteCarlo from '../ai/monte-carlo'
import Worker from "worker-loader!./worker"

const numSort = (a, b) => b - a

/**
 * Adjusted from Noël CHAVEY 
 * publié dans son livre le Jeu de Tarot
 * @param {[Card]} playerHand 
 */
function evaluateHand(playerHand) {
    let total = 0
    let hand = [...playerHand]

    let trumpBase = hand.length == 24 ? 6 :
            hand.length == 18 ? 4 :
            3
    let suitBase = hand.length == 24 ? 6 :
            hand.length == 18 ? 5 :
            4
    let numberOfTrumps = hand
        .filter(TRUMP)
        .length

    // Oudlers
    if (hand.includes(MONDE)) total += 10
    if (hand.includes(EXCUSE)) total += 8
    if (hand.includes(PAGUET)) {
        if (numberOfTrumps >= trumpBase + 2) total += 9
        else if (numberOfTrumps == trumpBase + 1) total += 7
        else if (numberOfTrumps == trumpBase) total += 5
    }
    // Trumps
    let majorTrumps = hand
        .filter(c => TRUMP(c) && getRank(c) >= 16)
        .sort(numSort)
    if (numberOfTrumps >= trumpBase) total += (2 * numberOfTrumps)
    total += (2 * majorTrumps.length)
    majorTrumps.forEach((t, i, arr) => {
        if (arr[i+1] == t+1) total += 1
    })
    // courts
    hand.filter(c => !TRUMP(c))
        .forEach(c => {
            if (getRank(c) == 14) total += 6
            if (getRank(c) == 13) total += 3
            if (getRank(c) == 12) total += 2
            if (getRank(c) == 11) total += 1
    })
    // suits
    let suitCounts = {
        0: [],
        1: [],
        2: [],
        3: []
    }
    hand.filter(c => !TRUMP(c))
        .forEach(c => {
            suitCounts[getSuit(c)].push(c)
        })
    let voids = Object.keys(suitCounts)
        .map(key => suitCounts[key].length)
        .filter(v => v == 0)
        .length
    total += (6 * voids)
    // add points for consecutive face cards.
    Object.keys(suitCounts)
        .map(key => suitCounts[key])
        .forEach(suit => {
            suit.sort(numSort)
            suit.filter(c => getRank(c) >= 11)
                .forEach((c, i, arr) => {
                if (arr[i+1] == c+1) total += 1
            })
        })
    Object.keys(suitCounts)
        .map(key => suitCounts[key].length)
        .forEach(val => {
            if (val == 1) total += 3
            else if (val == suitBase) total += 5
            else if (val == suitBase + 1) total += 7
            else if (val >= suitBase + 2) total += 9
        })

    // console.log(hand.sort(numSort).map(c => toPrettyString(c)).toString())
    // console.log('hand evaluation score: ' + total)
    let bid;
    if (total < 40) bid = bids.PASSE
    else if (total <= 55) bid = bids.PRIS
    else if (total <= 70) bid = bids.SANSACHAT
    else if (total <= 80) bid = bids.SANSECART
    return bid
}


const myWorker = new Worker();


function chooseMove(state) {
    const secondsToProcess = 1
    const game = new Game()

    return new Promise((resolve, reject) => {
        // if (state.phase == 'BID') {
        //     let bid = evaluateHand(state.playerHands[state.player])
        //     let moves = game.legalPlays(state)
        //     let move = moves.find(m => m.value == bid)
        //     if (!move) move = moves.find(m => m.value == bids.PASSE)
        //     if (!move) reject('Error occured while bidding: Passe not found.')
        //     else resolve(move)
        // } else {
            myWorker.postMessage(state.clone());
            myWorker.onmessage = ({data}) => {
                myWorker.onmessage = null
                resolve(data)
            }
        // }
    })
}

export default chooseMove