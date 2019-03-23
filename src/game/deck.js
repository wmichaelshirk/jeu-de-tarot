
const ranks = "123456789TJCQK".split('')

// const shuffle = () => 0.5 - Math.random()

const shuffle = (array) => {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}

function toPrettyString(card) {
    if (TRUMP(card)) {
        return ('0' + getRank(card)).slice(-2)
    } else {
        return ranks[getRank(card)] + [
            '\x1b[31m♥︎\x1b[0m',
            '\x1b[30m♠︎\x1b[0m',
            '\x1b[31m♦︎\x1b[0m',
            '\x1b[30m♣︎\x1b[0m'
        ][getSuit(card)]
    }
}


const deck = Array.apply(null, { length: 78 }).map(eval.call, Number)

const EXCUSE = 56
const PAGUET = 57
const MONDE = 77
const TRUMP = card => card > 55
const getRank = card => card > 55 ? card - 56 : card % 14
const getSuit = card => card > 55 ? 4 : Math.floor(card / 14)

const cardPoints = deck.reduce((acc, el) => {
    if ([PAGUET, MONDE, EXCUSE].includes(el) ||
        getRank(el) == 13) acc[el] = 4.5
    else if (getRank(el) == 12) acc[el] = 3.5
    else if (getRank(el) == 11) acc[el] = 2.5
    else if (getRank(el) == 10) acc[el] = 1.5
    else acc[el] = 0.5
    return acc
}, {})

export {
    deck, shuffle, TRUMP, EXCUSE, PAGUET, MONDE,
    getRank, getSuit, toPrettyString, cardPoints
}