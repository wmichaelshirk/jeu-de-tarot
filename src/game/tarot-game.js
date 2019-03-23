/* eslint-disable */
//
// Adapted from 
// kjlubick/ISMCTS.py and 
// quasimik/medium-mcts

/*
TODOS
add "expose talon" as a state, so that it gets exposed.

Be sure Excuse takes last trick of slam; is lost on last trick otherwise.
*/
import State from './tarot-state'
import Play from './tarot-play'
import { types, bids } from './tarot-play'
import { deck, shuffle, TRUMP, EXCUSE, PAGUET, getRank, getSuit, cardPoints, MONDE } from './deck'

const numSort = (a, b) => b - a
const pointTarget = { 
    0: 56,
    1: 51,
    2: 41,
    3: 36
}
class Game_Tarot {

    /** Generate and return the initial game state. */
    // shuffle, assign dealer, deal cards
    start(numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers
        // pick dealer.
        const dealer = Math.floor(Math.random() * numberOfPlayers);
        return this.setup(numberOfPlayers, dealer)
    }
    newGame(state) {
        const dealer = this.nextPlayer(state.numberOfPlayers, state.dealer);
        return this.setup(state.numberOfPlayers, dealer)

    }
    setup(numberOfPlayers, dealer) {
        // shuffle deck
        const thisDeck = [...deck]
        shuffle(thisDeck)
        const newState = 
            new State(numberOfPlayers, dealer, this.nextPlayer(numberOfPlayers, dealer), 'BID')

        // deal cards to players and talon.
        newState.talon = thisDeck.splice(numberOfPlayers == 5 ? -3 : -6)
        
        let currentPlayer = this.nextPlayer(numberOfPlayers, dealer)
        while (thisDeck.length) {
            newState.playerHands[currentPlayer] = 
                new Set([...newState.playerHands[currentPlayer], 
                    ...thisDeck.splice(0, 3)])
            currentPlayer = this.nextPlayer(newState.numberOfPlayers, currentPlayer)
        }
        return newState
    }

    /** Return the current player's legal moves from given state */
    // any card if on lead;
    // follow if on follow;
    // bid if not done
    legalPlays(state) {
        let legalPlays = []
        if (state.phase == 'BID') {
            // if everyone has already passed - there are no moves.
            if (state.playHistory.filter(p => p.value == bids.PASSE).length == state.numberOfPlayers) {
                return []
            }
            // if there is no declarer yet, the open plays are:
            // pass, and all bids higher (or equal) to any yet bid.
            let permittedBids = Object.keys(bids)
            const previousBids = state.playHistory.filter(play => play.value != bids.PASSE)
            const lastBid = previousBids.slice(-1)[0]
            if (previousBids.length == 0) {
                permittedBids.forEach(bid => legalPlays
                    .push(new Play(state.player, types.BID, bid)))
            // if the previous bidder is lower, must go higher;
            // (this logic doesn't work.)
            } else if (this.elderPlayers(state.numberOfPlayers, state.dealer, state.player).includes(lastBid.player)) {
                permittedBids.filter((bid, i) => permittedBids.indexOf(lastBid.value) < i)
                .forEach(bid => legalPlays
                    .push(new Play(state.player, types.BID, bid)))
            // otherwise, must match.
            } else {
                [lastBid.value, bids.PASSE].forEach(bid => legalPlays
                    .push(new Play(state.player, types.BID, bid)))
            }
        }
        
        // Discards
        else if (state.phase == 'DISCARD') {
            // If there is a declarer, and fewer than 6 discards:
            // the plays are discards of any card not a king or oudler.
            legalPlays = [...state.playerHands[state.player]]
                .filter(card => !TRUMP(card) && getRank(card) != 13)
                .map(card => new Play(state.player, types.DISCARD, card))
        }

        // PURCHASE
        else if (state.phase == 'PURCHASE') {
            const sold = state.playHistory.find(m => m.type == types.SELL)
            if (!sold) {
                state.playerHands[state.player]
                    .forEach(card => {
                        if (!TRUMP(card)) legalPlays.push(new Play(state.player, types.SELL, card))
                    })
                // In the 4-player game, a "prise" may call for a king instead 
                // of a purchase.
                if (state.numberOfPlayers == 4) {
                    let kings = [13, 27, 41, 55]
                    kings.forEach(card => {
                        legalPlays.push(new Play(state.player, types.CALL, card))
                    })
                    // if a player has all four kings, he may call a queen instead.
                    if (kings.every(k => state.playerHands[state.player].has(k))) {
                        kings.forEach(card => {
                            legalPlays.push(new Play(state.player, types.CALL, card-1))
                        })
                    }
                }
            } else {
                // any suit card you don't have:
                legalPlays = Array.apply(null, { length: 56 })
                .map(eval.call, Number)
                .filter(c => !state.playerHands[state.declarer].has(c) && 
                    !state.talon.has(c) && c != sold.value)
                .map(c => new Play(state.player, types.PURCHASE, c))
            }
        }
        // the plays are call card
        else if (state.phase == 'CALL') {
            let kings = [13, 27, 41, 55]
            kings.forEach(card => {
                legalPlays.push(new Play(state.player, types.CALL, card))
            })
            // if a player has all four kings, he may call a queen instead.
            if (kings.every(k => state.playerHands[state.player].has(k))) {
                kings.forEach(card => {
                    legalPlays.push(new Play(state.player, types.CALL, card-1))
                })
            }
            // if a player has all four Queens also, he may call a Knight instead.
            if (kings.every(k => state.playerHands[state.player].has(k-1))) {
                kings.forEach(card => {
                    legalPlays.push(new Play(state.player, types.CALL, card-2))
                })
            }
        }
        // Announcements
        // we'll hold off for now.

        // plays
        // if you have the lead: wide open.
        // if not, follow rules.
        if (state.phase == 'PLAY') {
            // if you've lost a slam, game over.
            if (state.bid == bids.CHELEM && 
                state.playerTricks
                    .filter((_, i) => i != state.declarer)
                    .some(hand => hand.size > 1)) {
                return []
            }
            // lead may play anything;
            // others must follow.
            let lead = state.currentTrick[0]
            // but if scuse was led,
            if (lead && lead.value == EXCUSE) {
                lead = state.currentTrick[1]
            }
            if (lead) {
                let available = [...state.playerHands[state.player]]
                // follow if a suit;
                available = available.filter(c => getSuit(c) == getSuit(lead.value)) 

                // if can't follow, trump
                if (available.length == 0) {
                    available = [...state.playerHands[state.player]]
                        .filter(TRUMP)
                }

                // Must overtrump
                let maxTrump = Math.max.apply(null, state.currentTrick
                    .map(c => c.value)
                    .filter(TRUMP))
                if (maxTrump > 0 && available
                        .find(c => c > maxTrump)) {
                    available = [...state.playerHands[state.player]]
                        .filter(c => c > maxTrump)
                }    
                // if no cards available, play any.
                if (available.length == 0 || (available.length == 1 && available[0] == EXCUSE)) {
                    available = [...state.playerHands[state.player]]
                }
                if (state.playerHands[state.player].has(EXCUSE) && !available.includes(EXCUSE)) { available.push(EXCUSE)}
                available.forEach(card => 
                    legalPlays.push(new Play(state.player, types.FOLLOW, card)))
            } else {
                let type = (state.currentTrick[0] && state.currentTrick[0].value == EXCUSE) ? types.FOLLOW : types.LEAD
                state.playerHands[state.player]
                   .forEach(card => legalPlays.push(new Play(state.player, type, card)))
            }   
        }
        return legalPlays
    }

    /** Advance the given state and return it */
    /**
     * 
     * @param {State} state 
     * @param {Play} play 
     */
    nextState(state, play) {
        const newState = state.clone()
        newState.playHistory.push(play)

        /*
        Bidding is always between two people, except the first.
        // If the first bid, it just goes in, and to the next person.
        // if there are players-1 passes and one bid; the bid wins.

        // If it's not the first:
        It's between the first two people that haven't passed.
        Of those two:
        If it's the second, he can bid anything higher;
        if it's the first, he can hold or pass.

        */
        // Bids
        if (play.type == types.BID) {
            newState.phase = 'BID'
            if (newState.playHistory.length == 1) {
                newState.player = this.nextPlayer(newState.numberOfPlayers, newState.player)
            } else {
                let passedPlayers = newState.playHistory
                    .filter(p => p.value == bids.PASSE)
                    .map(p => p.player)
                let activeBidders = newState.playHistory
                    .filter(p => !passedPlayers.includes(p.player))
                    // latest bids only.
                    .filter((p, i, arr) => 
                        !arr.slice(i+1).find(b => b.player == p.player))
                let activeBid = activeBidders.reverse()[0]
                // Everyone passed
                if (passedPlayers.length == newState.numberOfPlayers) {
                    // everyone passed; no moves.

                }
                // Everyone passed but one
                else if (passedPlayers.length == newState.numberOfPlayers - 1 &&
                        activeBid) {
                    newState.setContract(activeBid.player, activeBid.value)
                    if ([bids.PRIS, bids.SANSACHAT].includes(activeBid.value)) {
                        newState.player = activeBid.player
                        newState.phase = 'DISCARD'
                        newState.playerHands[newState.player] = new Set([
                            ...newState.playerHands[activeBid.player], ...newState.talon])
                        newState.talon = new Set()
                    } else {
                        if (newState.numberOfPlayers == 5) {
                            newState.phase = 'CALL'
                            newState.player = activeBid.player
                        } else {
                            newState.player = this.nextPlayer(newState.numberOfPlayers, newState.dealer)
                            newState.phase = 'PLAY'
                        }
                    }
                // still need to duke it out.
                } else {
                    if (!activeBid)
                        newState.player = this.nextPlayer(newState.numberOfPlayers, newState.player)
                    else if (activeBidders.length == 1) {
                        newState.player = this.nextPlayer(newState.numberOfPlayers, activeBid.player)
                        while (passedPlayers.includes(newState.player)) {
                            newState.player = this.nextPlayer(newState.numberOfPlayers, newState.player)
                        }
                    } else 
                        newState.player = activeBidders
                            .filter(p => p.player != play.player)[0].player
                }
            }
        }
        // Discards
        // if there are fewer than 6 discards:
        // discard, and stay put;
        // if achat stay put, otherwise to eldest to lead.
        else if (play.type == types.DISCARD) {
            let lastDiscard = newState.playHistory.filter(play => 
                play.type == types.DISCARD)
                .length == (newState.numberOfPlayers == 5 ? 3 : 6)
                
            newState.playerHands[newState.player].delete(play.value)
            newState.talon.add(play.value)
            if (lastDiscard) {
                if (newState.bid == bids.PRIS) {
                    newState.phase = 'PURCHASE'
                } else {
                    if (newState.numberOfPlayers == 5) {
                        newState.phase = 'CALL'
                        newState.player = newState.declarer
                    } else {
                        newState.phase = 'PLAY'
                        newState.player = this.nextPlayer(newState.numberOfPlayers, newState.dealer)
                    }
                }
            }
        }
        // Purchases
        // If there is a declarer, the bid is pris, and there are 6 discards:
        else if (play.type == types.PURCHASE) {
            const soldCard = newState.playHistory
                .find(m => m.type == types.SELL)
                .value
            // find seller
            for (let p = 0; p < newState.numberOfPlayers; p++) {
                if (p != play.player) {
                    if (newState.playerHands[p].has(play.value)) {
                        play.seller = p
                        newState.playerHands[p].delete(play.value)
                        newState.playerHands[p].add(soldCard)
                        break;
                    }
                }
            }
            newState.playerHands[newState.declarer].delete(soldCard)
            newState.playerHands[newState.declarer].add(play.value)
            if (newState.numberOfPlayers == 5) {
                newState.phase = 'CALL'
                newState.player = newState.declarer
            } else {
                newState.phase = 'PLAY'
                newState.player = this.nextPlayer(newState.numberOfPlayers, newState.dealer)
            }
        }
        else if (play.type == types.CALL) {
            // find called card in player hands,
            // assign player as partner.
            for (let player = 0, numHands = newState.playerHands.length; player < numHands; player++) {
                if (newState.playerHands[player].has(play.value)) {
                    newState.partner = player
                }
            }
            newState.phase = 'PLAY'
            newState.player = this.nextPlayer(newState.numberOfPlayers, newState.dealer)
        }
        // the plays are call card
        // then exchange
        // then to eldest to lead.

        // Announcements
        // we'll hold off for now.

        // plays
        // if you have the lead: wide open.
        // if not, follow rules.
        else if (play.type == types.LEAD) {
            newState.playerHands[newState.player].delete(play.value)
            newState.currentTrick.push(play)
            newState.phase = 'PLAY'
            newState.player = this.nextPlayer(newState.numberOfPlayers, newState.player)
        }
        else if (play.type == types.FOLLOW) {
        // if not end of trick, just keep going.
            newState.playerHands[newState.player].delete(play.value)
            newState.currentTrick.push(play)

            if (newState.currentTrick.length < newState.numberOfPlayers) {
                newState.phase = 'PLAY'
                newState.player = this.nextPlayer(newState.numberOfPlayers, newState.player)
            } else {
                // who won the trick?
                // and if it was the last card, move to win.
                
                // Is the scuse there? get him out - unless it's the last trick.
                // In which case - win if slam, loose if not.
                let excuse = newState.currentTrick.find(p => p.value == EXCUSE)
                let excuseWinner;
                if (excuse) {
                    // last trick?
                    if (newState.playerHands.every(h => !h.size)) {
                        // Slam?
                        // TODO - need to account for a defender's slam
                        if ((excuse.player == newState.declarer || excuse.player === newState.partner) && (newState.playerTricks
                                .filter((p, i) => i != newState.declarer && i !== newState.partner)
                                .every(h => !h.length))) {
                            newState.playerTricks[excuse.player] = 
                                    new Set([...newState.playerTricks[excuse.player],
                                        ...newState.currentTrick.map(p => p.value)])
                            return newState
                        }
                    } else {
                        excuseWinner = newState.playerTricks[excuse.player]
                    }
                    newState.currentTrick = newState.currentTrick.filter(c => c.value != EXCUSE)
                }
                // lead
                let suit = getSuit(newState.currentTrick[0].value)
                let follows = newState.currentTrick.filter(p => getSuit(p.value) == suit)
                let trumps = newState.currentTrick.filter(p => TRUMP(p.value))

                let valSort = (a, b) => b.value - a.value
                let winner = [...trumps.sort(valSort), ...follows.sort(valSort)][0]
                newState.playerTricks[winner.player] = 
                    new Set([...newState.playerTricks[winner.player],
                        ...newState.currentTrick.map(p => p.value)])
                if (excuse) {
                    excuseWinner = excuseWinner || newState.playerTricks[winner.player];
                    excuseWinner.add(EXCUSE)
                }
                newState.currentTrick = []
                newState.phase = 'PLAY'
                newState.player = winner.player
            }
        }
        return newState
    }

    /** Return the score of a given player of the game. */
    winner(state, player) {
        // if 3 passes, return 0
        if (state.playHistory.length == state.numberOfPlayers &&
                state.playHistory.map(p => p.value)
                    .every(v => v == bids.PASSE)) {
            return 0
        }
        // if it's a slam and the declarer (or his partner) has lost a trick,
        // it's loss
        if (state.bid == bids.CHELEM && state.playerTricks
                .filter((_, i) => i != state.declarer && i !== state.partner)
                .some(tricks => tricks.size > 1)) {
            if (state.partner != null && state.partner != state.declarer) {
                if (state.declarer == player) return -200 * (state.numberOfPlayers - 3)
                else if (state.partner === player) return -200
                else return 200
            } else {
                return state.declarer == player ? (-200 * (state.numberOfPlayers - 1)) :  200
            }
        }
        // if the cards aren't played out, there's no winner yet;
        if (state.playerHands.some(hand => hand.size > 0)) {
            return null
        }
        // if the cards are played out, and it's a slam, bid or not:
        let declarerTrickSize = state.playerTricks[state.declarer].size + ((state.partner != null && state.partner != state.declarer) ? state.playerTricks[state.partner].size : 0)
        if (declarerTrickSize > 70) {
            if (state.partner != null && state.partner != state.declarer) {
                if (state.declarer == player) return 200 * (state.numberOfPlayers - 3)
                else if (state.partner === player) return 200
                else return -200
            } else {
                return state.declarer == player ? (200 * (state.numberOfPlayers - 1)) :  -200
            }
        }
        if (declarerTrickSize <=1) {
            if (state.partner != null && state.partner != state.declarer) {
                if (state.declarer == player) return -200 * (state.numberOfPlayers - 3)
                else if (state.partner == player) return -200
                else return 200
            } else {
                return state.declarer == player ? (-200 * (state.numberOfPlayers- 1)) :  200
            }
        }

        // win can be figured as win/loss, 0-1,
        // or as a larger range.
      
        const { cardpoints, partnerPoints, talonPoints, oudlers, pagatUltimo, target } = this.winnerStats(state)

        let totalPoints = cardpoints + partnerPoints + talonPoints
        // difference.
        // const declarerWon = cardpoints > target ? 1 : 0
        const bidVal = {
            [bids.PRIS]: 0,
            [bids.SANSACHAT]: 10,
            [bids.SANSECART]: 20
        }[state.bid] || 0
        let score = Math.floor(Math.abs(totalPoints - target)) + bidVal 
        if (target > totalPoints) score = -score

        // Should return "won" or not: 
        // but need to move this from 0-1 to actual score.
        // return state.declarer == player ? declarerWon : 1 - declarerWon
        if (state.partner != null && state.partner != state.declarer) {
            if (state.declarer == player) return score * (state.numberOfPlayers - 3)
            else if (state.partner == player) return score
            else return -score
        } else {
            return state.declarer == player ? (score * (state.numberOfPlayers - 1)) :  -score
        }
    }

    winnerStats(state) {
        /*
        TODO Pagat ultimo should need to _win_ the trick,
        not merely have it.
        */
        let cardpoints = 0
        let partnerPoints = 0
        let talonPoints = 0
        let oudlers = new Set()
        let declarerOudlers = new Set()
        let hasPagat = false
        if (state.declarer != null) { 
            let hasPartner = state.partner != null && 
                state.partner != state.declarer
            if (state.playerHands.every(h => !h.size)) {
                let pagatPlay = state.playHistory
                    .slice(-state.numberOfPlayers)
                    .find(p => p.value == PAGUET)
                hasPagat = pagatPlay && state.player == pagatPlay.player
            } 

            for (let oudler of [PAGUET, MONDE, EXCUSE]) {
                if (state.playerTricks[state.declarer].has(oudler)) {
                    oudlers.add(oudler)
                    declarerOudlers.add(oudler)
                }
                if (hasPartner && state.playerTricks[state.partner].has(oudler))
                oudlers.add(oudler)
            }
            for (let card of state.playerTricks[state.declarer]) {
                cardpoints += cardPoints[card]
            }
            for (let card of state.talon) {
                talonPoints += cardPoints[card]
            }
            if (hasPartner) {
                for (let card of state.playerTricks[state.partner]) {
                    partnerPoints += cardPoints[card]
                }
            }
        }
        let pagatUltimo = hasPagat ? (oudlers.has(PAGUET) ? 10 : -10 ) : 0
        return { 
            cardpoints,
            partnerPoints,
            talonPoints,
            oudlers: oudlers.size,
            pagatUltimo,
            target: pointTarget[oudlers.size] - pagatUltimo,
            declarerTarget: pointTarget[declarerOudlers.size] - pagatUltimo
        }
    }


    // helpers
    nextPlayer(numberOfPlayers, player) {
        return (player + 1) % numberOfPlayers
    }

    elderPlayers(numberOfPlayers, dealer, player) {
        const elders = []
        let curPlayer = this.nextPlayer(numberOfPlayers, dealer)
        while (curPlayer != player) {
            elders.push(curPlayer)
            curPlayer = this.nextPlayer(numberOfPlayers, curPlayer)
        }
        return elders
    }
}

export default Game_Tarot
