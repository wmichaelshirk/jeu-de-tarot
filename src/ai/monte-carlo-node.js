/* eslint-disable */
class MonteCarloNode {
    // wins are always from the viewpoint of playerJustMoved
    constructor(move = null, parent = null, playerJustMoved = null) {
        // The move that got us here; 
        // null for the root.
        this.move = move 
        this.parent = parent // null for root
        this.childNodes = new Map()
        this.wins = 0
        this.visits = 0
        this.avails = 1
        // The only part of the state the node needs
        // to retain.
        this.playerJustMoved = playerJustMoved
    }

    getUntriedMoves(legalMoves) {
        return legalMoves.filter(move => 
                !this.childNodes.has(move.hash()))
    }

    ucbSelectChild(legalMoves, exploration = 0.7) {
        // Use the UCB1 formula to select a child node
        let selectedChild
        let bestUCB1 = -Infinity

        let legalMoveSet = new Set(legalMoves.map(m => m.hash()))
        for (const [hash, child] of this.childNodes) {
            if (legalMoveSet.has(hash)) {
                let childUCB = (child.wins / child.visits) + 
                (exploration * Math.sqrt(Math.log(child.avails))
                /child.visits)
                if (childUCB > bestUCB1) {
                    bestUCB1 = childUCB
                    selectedChild = child
                }
                child.avails += 1
            }
        }
        return selectedChild
    }

    addChild(play, playerJustMoved) {
        const node = new MonteCarloNode(play, this, playerJustMoved)
        this.childNodes.set(play.hash(), node)
        return node
    }
    
    update(game, terminalState) {
        this.visits += 1
        if (this.playerJustMoved != null) {
            this.wins += game.winner(terminalState, this.playerJustMoved)
        }
    }

    // view methods
    toString() {
        return `[M:${this.move} W/V/A: ${this.wins/this.visits}/${this.visits}/${this.avails}]`
    }
    treeToString(indent) {
        let s = this.indentString(indent) + this.toString()
        this.childNodes.forEach(child => 
            s += child.treeToString(indent + 1))
        return s
    }
    indentString(indent) {
        let s = "\n"
        for (let i = 1; i < indent; i++) {
            s += "| "
        }
        return s
    }
    childrenToString() {
        return [...this.childNodes]
            .map(child => child[1].toString())
            .join('\n')
    }
}

export default MonteCarloNode