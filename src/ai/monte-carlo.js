/*
Adapted from kjlubick/ISMCTS.py (python, knockout whist) and
quasimik/medium-mcts (js, connect 4)
*/

import Node from './monte-carlo-node'

const movePolicy = {
    MAX_CHILD: 'MAX_CHILD',
    ROBUST_CHILD: 'ROBUST_CHILD'
} 


function informationSetMonteCarloTreeSearch (game, rootState, timeout, policy=movePolicy.MAX_CHILD, ucb = 450, verbose=false) {

    let rootNode = new Node()

    let end = Date.now() + timeout * 1000
    while (Date.now() < end) {
        let node = rootNode

        // "Determinize"
        // Randomize the state
        let state = rootState.cloneAndRandomize(rootState.player)
                
        // Select
        let moves = game.legalPlays(state)
        while (moves.length &&
            !node.getUntriedMoves(moves).length) {
                // magic number that seems to do ok
                node = node.ucbSelectChild(moves, ucb)
                state = game.nextState(state, node.move)
                moves = game.legalPlays(state)
        }

        // Expand
        let untriedMoves = node.getUntriedMoves(moves)
        if (untriedMoves.length) {
            let move = untriedMoves[Math.floor(Math.random() * untriedMoves.length)]
            let player = state.player
            state = game.nextState(state, move)
            node = node.addChild(move, player)
        }

        // Simulate
        moves = game.legalPlays(state)
        while(moves.length) {
            // TODO - replace this with "epsilon greedy?"
            let move = moves[Math.floor(Math.random() * moves.length)]
            state = game.nextState(state, move)
            moves = game.legalPlays(state)
        }

        // Backpropogate
        while (node) {
            node.update(game, state)
            node = node.parent
        }
    }
    if (verbose) {
        // eslint-disable-next-line
        console.log(rootNode.treeToString(0))
    } else {
        // eslint-disable-next-line
        console.log(rootNode.childrenToString())
    }

    // various policies could be implimented (and are in the exmaple code):
    // max child (highest reward)
    // robust child (most visited)
    // max-robust child (combo)
    // secure child (maximise Lower Confidence Bound)
    let theMove
    let max = -Infinity
    rootNode.childNodes.forEach(child => {
        if (policy == movePolicy.MAX_CHILD) {
            let score = child.wins / child.visits
            if (score > max) {
                theMove = child.move
                max = score
            }
        } else if (policy == movePolicy.ROBUST_CHILD) {
            if (child.visits > max) {
                theMove = child.move
                max = child.visits
            }
        }
    })
    return theMove
}

export default informationSetMonteCarloTreeSearch
export { movePolicy }