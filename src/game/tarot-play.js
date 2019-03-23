const types = {
    BID: 'bid',
    EXPOSE: 'expose',
    DISCARD: 'discard',
    PURCHASE: 'purchase',
    SELL: 'sell',
    CALL: 'call',
    ANNOUNCE: 'announce',
    LEAD: 'lead',
    FOLLOW: 'follow'
}

const bids = {
    PRIS: 'PRIS',
    SANSACHAT: 'SANSACHAT',
    SANSECART: 'SANSECART',
    CHELEM: 'CHELEM',
    PASSE: 'PASSE'
}

class Play_Tarot {

    constructor(player, type, value) {
        this.player = player
        this.type = type
        this.value = value
    }

    hash() {
        return this.player.toString() + ',' + 
            this.type.toString() + "," + this.value.toString()
    }

    toString() {
        return `player: ${this.player}, ${this.type}, ` + this.value.toString()
    }
}

export default Play_Tarot
export { types, bids }