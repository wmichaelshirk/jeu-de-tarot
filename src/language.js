import { types, bids } from './game/tarot-play'
import { getRank, getSuit } from './game/deck'

const messages = {
    en: {
        setup: {
            playerNames: 'Player Names',
            numberOfPlayers: 'Number of Players',
            deckStyle: 'Deck Style',
            language: 'Language',
            french: 'French',
            english: 'English',
            start: 'Start'
        },
        bids: {
            [bids.PRIS]: 'I’ll take it.',
            [bids.SANSACHAT]: 'I’ll take without the purchase.',
            [bids.SANSECART]: 'I’ll take without a discard.',
            [bids.CHELEM]: 'I’ll take with a slam.',
            [bids.PASSE]: 'I pass.',
            avous: 'All yours.',
            pousse: 'I’ll push it.',
            garde: 'I’ll keep it.'
        },
        shortBids: {
            [bids.PRIS]: 'Take',
            [bids.SANSACHAT]: 'No purchase',
            [bids.SANSECART]: 'No discard',
            [bids.CHELEM]: 'Slam',
        },
        cards: {
            purchase: 'I’ll buy ',
            call: 'I’ll call ',
            king: "the King",
            queen: "the Queen",
            knight: "the Knight",
            jack: "the Jack",
            ofSpades: "of Spades",
            ofClubs: "of Clubs",
            ofHearts: "of Hearts",
            ofDiamonds: "of Diamonds",
            ofCups: "of Cups",
            ofBatons: "of Batons",
            ofSwords: "of Swords",
            ofCoins: "of Coins"
        },
        headings: {
            bid: 'Bid',
            playAgain: 'Play another hand?',
            pots: 'Pots',
            yes: 'Yes',
            no: 'No',
            purchase: "Purchase",
            selectCard: 'Select a card to trade.'
        }
    },
    fr: {
        setup: {
            playerNames: 'Noms de joueurs',
            numberOfPlayers: 'Nombre de joueurs',
            deckStyle: 'Deck Style',
            language: 'Langage',
            french: 'Français',
            english: 'Anglais',
            start: 'Commencer'
        },
        bids: {
            [bids.PRIS]: 'Je prends.',
            [bids.SANSACHAT]: 'Je prends sans achat.',
            [bids.SANSECART]: 'Je prends sans écart.',
            [bids.CHELEM]: 'Je prends avec un chélèm.',
            [bids.PASSE]: 'Je passe.',
            avous: 'À vous.',
            pousse: 'Je pousse.',
            garde: 'Je garde.'
        },
        shortBids: {
            [bids.PRIS]: 'Pris',
            [bids.SANSACHAT]: 'Sans achat',
            [bids.SANSECART]: 'Sans écart',
            [bids.CHELEM]: 'Chélèm',
        },
        cards: {
            purchase: 'J’achète ',
            call: 'J’appelle ',
            king: "le Roi",
            queen: "la Dame",
            knight: "le Cavalier",
            jack: "le Valet",
            ofSpades: "de pique",
            ofClubs: "de trèfle",
            ofHearts: "de cœur",
            ofDiamonds: "de carreau",
            ofCups: "de coupe",
            ofBatons: "de bâton",
            ofSwords: "d’épée",
            ofCoins: "de denier"
        },
        headings: {
            bid: 'Les enchères',
            playAgain: 'Rejouer?',
            pots: 'Bêtes',
            yes: 'Oui',
            no: 'Non',
            purchase: "Achat",
            selectCard: 'Select a card to trade.'
        }
    }
  }


function getBidName(that, prevBids, move) {
    if (!move || move.type != types.BID) return
    const lastBidder = prevBids
        .filter(m => m.value != bids.PASSE)
        .slice(-1)[0]
    const alreadyBid = prevBids
        .filter(m => m.value != bids.PASSE)
        .slice(0, -1)
        .find(m => m.player == move.player)
    let bidOrder = [bids.PRIS, bids.SANSACHAT, bids.SANSECART, bids.CHELEM]
    if (alreadyBid) {
        if (move.value != bids.PASSE)
            return that.$i18n.t('bids.garde')
        else 
        return that.$i18n.t('bids.avous')
    } else if (lastBidder && bidOrder.indexOf(move.value) - bidOrder.indexOf(lastBidder.value) == 1) 
        return that.$i18n.t('bids.pousse')
            // .replace('prends', 'pousse')
    else return that.$i18n.t(`bids.${move.value}`)
}

function updateSpeech(that, speech, state) {
    function getRankName(value) {
        let rankNames = {
            13: 'king',
            12: 'queen',
            11: 'knight',
            10: 'jack'
        }
        let rank = getRank(value)
        return rankNames[rank] ? that.$i18n.t(`cards.${rankNames[rank]}`) : rank + 1
    }
    function getSuitName(value) {
        let frenchSuits = {
            0: 'ofClubs',
            1: 'ofHearts',
            2: 'ofSpades',
            3: 'ofDiamonds'
        }
        let italianSuits = {
            0: 'ofBatons',
            1: 'ofCups',
            2: 'ofSwords',
            3: 'ofCoins'
        }
        let suitNames = that.deckStyle == 'marseille' ? italianSuits : frenchSuits
        return that.$i18n.t(`cards.${suitNames[getSuit(value)]}`)
    }
    if (!state) return []
    if (!state.playHistory.length) {
        return Array.from({length: state.numberOfPlayers})
    }
    let lastPlay = state.playHistory[state.playHistory.length - 1]
    if (lastPlay.type == types.BID) {
        speech[lastPlay.player] = ''
        speech[lastPlay.player] = getBidName(that, state.playHistory.slice(0, state.playHistory.length-1), lastPlay)
    }
    if (lastPlay.type == types.PURCHASE) {
        let seller = state.playHistory
            .find(m => m.type == types.SELL)
            .player
        speech = Array.from({length: state.numberOfPlayers})
        speech[seller] = that.$i18n.t(`cards.purchase`) + getRankName(lastPlay.value) + ' ' + getSuitName(lastPlay.value) + '.'
    }
    if (lastPlay.type == types.CALL) {
        speech = Array.from({length: state.numberOfPlayers})
        speech[lastPlay.player] = that.$i18n.t(`cards.call`) + getRankName(lastPlay.value) + ' ' + getSuitName(lastPlay.value) + '.'
    }
    if (lastPlay.type == types.LEAD) {
        speech = Array.from({length: state.numberOfPlayers})
    }
    return speech
}

function updateRole(that, role, state) {
    function getRankName(value) {
        let rankNames = {
            13: 'R',
            12: 'D',
            11: 'C',
            10: 'V'
        }
        let rank = getRank(value)
        return rankNames[rank] 
    }
    function getSuitName(value) {
        let frenchSuits = {0: "♣️", 1: "♥️", 2: "♠", 3: "♦" }
        let italianSuits = {0: "🏑", 1: "🏆", 2: "🗡", 3:"🌼" }
        let suitNames = that.deckStyle == 'marseille' ? italianSuits : frenchSuits
        return suitNames[getSuit(value)]
    }
    if (!state) return []
    if (!state.playHistory.length) {
        return Array.from({length: state.numberOfPlayers})
    }
    let lastPlay = state.playHistory[state.playHistory.length - 1]
    if (lastPlay.type == types.BID) {
        if (state.declarer != null) {
            role[state.declarer] = that.$i18n.t(`shortBids.${state.bid}`)
        }
    }

    if (lastPlay.type == types.CALL) {
        let rank = getRankName(lastPlay.value)
        role[state.declarer] += ' ' + (rank != 'R' ? rank : '') +
              getSuitName(lastPlay.value)
    }
    if (lastPlay.type == types.LEAD || lastPlay.type == types.FOLLOW) {
        let call = state.playHistory.find(p => p.type == types.CALL)
        if (call && lastPlay.value == call.value) {
            if (state.partner != state.declarer) {
                let rank = getRankName(lastPlay.value)
                role[state.partner] = (rank != 'R' ? rank : '') +
                getSuitName(lastPlay.value)
            } else {
                role[state.declarer] = getSuitName(lastPlay.value) + ' ' + role[state.declarer]
            }
        }
    }
    return role
}

export default messages
export {
    updateSpeech, updateRole
}