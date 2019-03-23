The "game" object is the bulk of the action here.
to make use of it, initialize it:

```
import Game from './tarot-game'
let game = new Game(numberOfPlayers)
```
_N.B._, I may add further constructor args for things like "rule options."

Next, initialize the state:
```
let state = game.start()
let winner = null
let moves = game.legalPlays(state)

```
_N.B._, I may add a argument to "start" as well, like the `deck` - so that it can be retained and re-seed the next hand.


Now, you can just loop forever. 
While there is no winner, keep showing the legal moves,
and when a move is chosen (either by a player, or by the ai), 
```
state = game.nextState(state, move)
winner = game.winner(state)
let moves = game.legalPlays(state)
```

I propose that if the state lists the active player as a computer, we'll attach a "getMove(state)" function to each of them (maybe they have different AIs!), call that, and continue.

If we wire it up to firebase later, the UI will want to just keep waiting until the state shows the active player as the user again.

The game can be tested on the command line with the `tarot-test.mjs` file like this:
```
node --experimental-modules tarot-test.mjs
```
, but you have to rename all the files in this director as `.mjs` to make it work. :posthorn: