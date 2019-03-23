import { types, bids } from './tarot-play'
import { deck, shuffle } from './deck'

class State_Tarot {

    constructor(numberOfPlayers, dealer, player, phase,
            playHistory, playerHands, talon, currentTrick, playerTricks) {
        this.numberOfPlayers = numberOfPlayers
        this.player = player
        this.dealer = dealer,
        this.phase = phase
        
        this.playHistory = playHistory || []

        this.playerHands = playerHands || 
            Array.from({length: numberOfPlayers}, () => new Set())
        this.talon = talon || new Set()
        this.currentTrick = currentTrick || []
        this.playerTricks = playerTricks ||
            Array.from({length: numberOfPlayers}, () => new Set())

        this.handSize = (78 - (numberOfPlayers == 5 ? 3 : 6)) / numberOfPlayers
    }

    clone () {
        const newState = new State_Tarot(
            this.numberOfPlayers,
            this.dealer,
            this.player,
            this.phase,

            this.playHistory.slice(),
            this.playerHands.map(p => new Set(p)),
            new Set(this.talon),
            this.currentTrick.slice(),
            this.playerTricks.map(p => new Set(p))
        )

        newState.setContract(this.declarer, this.bid, this.partner)
        return newState
    }

    setContract(declarer, bid, partner) {
        this.declarer = declarer
        this.bid = bid
        this.partner = partner
    }

    /**
     * Create a clone of the state which randomizes any 
     * information not visible to the observer.
     * @param {Number} observer 
     */
    cloneAndRandomize(observer) {
        const newState = this.clone()

        let seenCards = this.playHistory
            .filter(p => p.type == types.LEAD || p.type == types.FOLLOW)
            .map(p => p.value)
            .concat(this.playerHands[observer])

        // If I had the dog, I've seen those to;
        // If someone else bid a pris or a sansachat, the dog
        // was exposed: I know two people who *don't* have those cards -
        // but not where they are.
        // TODO about this last part.
        if ((this.bid == bids.PRIS || this.bid == bids.SANSACHAT) &&
                this.declarer == observer) {
            seenCards = seenCards.concat(this.playHistory
                .filter(p => p.type == types.DISCARD)
                .map(p => p.value))
        }

        const unseenCards = [...deck]
            .filter(c => !seenCards.find(sc => sc.id == c.id))
        shuffle(unseenCards)

        // take the unseen cards, and randomize them into the players hands
        // TODO - they need to be randomized into the dog as well, accounting
        // for kings, oudlers and trumps not being there.
        this.playerHands.filter((p, i) => i != observer)
            .forEach(hand => {
                hand.forEach((c, i) => hand[i] = unseenCards.pop())
            })
        
        return newState
    }

    isPlayer(player) {
        return (player === this.player)
    }

    hash() {
        return JSON.stringify(this.playHistory)
    }
}

export default State_Tarot