import { types, bids } from './tarot-play'

function initializeScore(state) {
    const score = {
        scores: Array.from({length: state.numberOfPlayers}, () => []),
        pots: [],
        doubled: false
    }
    let pot = 0
    score.scores.forEach((score, i) => {
        const stake = state.dealer == i ? 20 : 10
        score.push({ stake: -stake })
        pot += stake
    })
    score.pots.push(pot)
    return score
}

function stakePot(score, state) {
    if (score.pots.length) {
        let pot = score.pots.pop()
        let value = 5
        score.pots.push(pot + value)
        score.scores.forEach((score, i) => {
            const stake = state.dealer == i ? value : 0
            score.push({ stake: -stake })
        })
    } else {
        let pot = 0
        score.scores.forEach((score, i) => {
            const stake = state.dealer == i ? 20 : 10
            score.push({ stake: -stake })
            pot += stake
        })
        score.pots.push(pot)
        score.doubled = false
    }
    return score
}

function updateScore(game, score, state) {
    if (game.winner(state) != null) {
        for (let player = 0; player < state.numberOfPlayers; player++) {
            // score
            let theScore = score.scores[player][score.scores[player].length-1]
            theScore.score = game.winner(state, player)

            // purchase
            let seller = state.playHistory
                .find(m => m.type == types.PURCHASE)
            if (state.bid == bids.PRIS && seller) {
                if (player == state.declarer) {
                    theScore.purchase = -10
                } else if (player == seller.seller) {
                    theScore.purchase = 10
                }
            }

            // payout
            if (player == state.declarer && theScore.score >= 0) { 
                let potVal = score.pots.pop()
                if (state.partner != null && state.partner != state.declarer) {
                    theScore.payout = Math.ceil(potVal / 2)
                    score.scores[state.partner][score.scores[player].length-1]
                        .payout = Math.floor(potVal / 2)
                    score.scores[state.partner][score.scores[player].length-1]
                        .partner = true
                } else {
                    theScore.payout = potVal
                }
                theScore.declarer = true
            } else if (player == state.declarer && theScore.score < 0) {
                if (score.doubled) {
                    let value = score.pots.slice(-1)[0]
                    score.pots.push(value)
                    theScore.payout = -value
                } else {
                    let value = score.pots.pop()
                    score.pots.push(value * 2)
                    theScore.payout = -value
                    score.doubled = true
                }
                theScore.declarer = true
                if (state.partner != null && state.partner != state.declarer) {
                    score.scores[state.partner][score.scores[player].length-1]
                        .partner = true
                }
            }
        }
    }
    return score
}

export {
    initializeScore,
    stakePot,
    updateScore
}