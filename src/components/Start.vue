<template>
    <transition name="modal">
        <section id="start-container" class="modal">
            <section v-if="show=='settings'">
            <header>
                <h1>Jeu de Tarot</h1>
                <button v-on:click="start()">{{ $t("setup.start") }}</button>
            </header>
            <div class="modal-body">
                <fieldset id="num-players-container">
                    <legend>{{ $t("setup.numberOfPlayers") }}</legend>
                    <input type="radio" id="three" value="3" v-model="numPlayers">
                    <label for="three">3</label>
                    <br>
                    <input type="radio" id="four" value="4" v-model="numPlayers">
                    <label for="four">4</label>
                    <br>
                    <input type="radio" id="five" value="5" v-model="numPlayers">
                    <label for="five">5</label>
                </fieldset>

                <fieldset id="deck-style-container">
                    <legend>Deck Style</legend>
                    <input type="radio" id="basic" value="nouveau" v-model="deckStyle">
                    <label for="basic">Tarot Nouveau</label>
                    <br>
                    <input type="radio" id="marseille" value="marseille" v-model="deckStyle">
                    <label for="marseille">Tarot de Marseille</label>
                </fieldset>

                <fieldset id="deck-style-container">
                    <legend>{{ $t("setup.language")}}</legend>
                    <input type="radio" id="french" value="fr" v-model="$i18n.locale">
                    <label for="french">{{ $t("setup.french") }}</label>
                    <br>
                    <input type="radio" id="english" value="en" v-model="$i18n.locale">
                    <label for="english">{{ $t("setup.english") }}</label>
                </fieldset>
            </div>
            <fieldset id="num-players-container">
                    <legend>{{ $t("setup.playerNames") }}</legend>
                    <div>
                        <input id="playerName" v-model="playerName" 
                            type="text" placeholder="Player 1" size=9 />
                        <input id="opponent1Name" v-model="opponent1Name" 
                            type="text" placeholder="Opponent 1" size=9 />
                        <input id="opponent2Name" v-model="opponent2Name" 
                            type="text" placeholder="Opponent 2" size=9 />
                        <input id="opponent3Name" v-if="numPlayers > 3"
                            v-model="opponent3Name" type="text" 
                            placeholder="Opponent 3" size=9/>
                        <input id="opponent4Name" v-if="numPlayers > 4"
                            v-model="opponent4Name" type="text" 
                            placeholder="Opponent 4" size=9/>
                    </div>
                </fieldset>
                <footer>
                    <button @click="show='about'">About</button>
                    <button @click="show='rules'">Rules</button>
                </footer>
            </section>
            <section v-if="show=='about'" class="scroll">
                <h2>About</h2>
                <p><i>Jeu de Tarot</i> is an implementation of the French game of Tarot, as it was played in about 1900. The rules are based on “Règles du jeu de Tarots”, published in Besançon in 1862. (The four- and five- player options are adaptions of these.)
                </p>
                <p>
                    The Tarot de Marseille is the <a href="www.cbdtarot.com">CBD Tarot de Marseille by Dr. Yoav Ben-Dov</a> (CC).
                </p>
                <p>
                    The Tarot Nouveau images from the <a href="http://a.trionfi.eu/WWPCM/">World Web Playing Card Museum</a>
                </p>
                <p>
                    The game was made to experiment with Information Set Monte Carlo Tree Search AI for <a href="https://www.jahnelgroup.com/">Jahnel Group</a>’s 2019 War Week, by Michael Shirk and Dan Kollar.
                </p>
                <button @click="show='settings'">Back</button>
            </section>
            <section v-if="show=='rules'" class="scroll">
                <h2>Rules</h2>
                <p>Tarot is a point-trick game of shifting alliances.</p>
                <p>First, one bids for the right to play alone (or, in the 5 player game, with a partner) against the others combined, and to take a target number of card points.  The target is based on how many of the 3 <i>Oudlers</i> (the 1 and 21 of Trumps, and the Excuse) one takes.</p>
                <p>
                    The card points are: Kings are worth 4, Queens 3, Knights 2, and Jacks 1.  The thee Oudlers are worth 4 each. Finally, every pair of cards is worth 1.
                </p>
                <p>The points needed are <ul>
                    <li>With 3: 36</li>
                    <li>With 2: 41</li>
                    <li>With 1: 51</li>
                    <li>With 0: 56</li>
                    </ul></p>
                    Taking the 1 of Trump on the last trick further reduces this by 10; loosing it on the last trick increases this by 10.
                <p>
                    The bids are:
                    <ol>
                        <li>Take. You add the 6 talon cards to your hand, and discards 6 of your choosing.  You then ‘purchase’ a card you don't have.</li>
                        <li>No purchase. You add the 6 talon cards to your hand, and discards 6 of your choosing.</li>
                        <li>No discard. You play with the cards you were dealt, but count the talon as your own at the end.</li>
                        <li>Slam. You play with the cards you were dealt, and take every trick.</li>
                    </ol>
                </p>
                <p>Once the soloist is chosen, the person on the dealers right leads to the first trick.  You must follow suit if you can; if you cannot, you must trump; if you cannot trump, you may throw off. If a trump has already been played, you must play a higher trump if you can.  The Excuse may be played at any time, and is always kept - but looses the trick.  If played to the last trick, he is lost, unless a slam is being played.</p>
                <p>If the soloist met his target, he is paid the amount he exceeded it by (plus 10 for a No Purchase, or 20 for a No Discard) by each opponent, and he receives the largest pot. If he looses, he pays the same amount to each opponent and doubles or adds to the pots.</p>
                <p>
                    (The breakdown of each score may be seen by mousing over it.)
                </p>
                <hr>
                <p>
                    Rules for the contemporary game may be found <a href="https://www.pagat.com/tarot/frtarot.html">here;</a> deviations from them are:
                </p>
                <p>The bidding is one round with priority: a later bidder must bid higher than a previous, but a previous bidder may ‘hold’ a later bid.</p>
                <p>The lowest bid allows a ‘purchase’ - the trading of a card you don’t want for a suit card of your asking.</p>
                <p>There are no declarations of Handfuls.</p>
                <p>A <i>Petit au bout</i> or <i>Paguet à la fin</i> reduces the target points by 10.</p>
                <p>Scoring is through pots as well as payments.</p>
                <button @click="show='settings'">Back</button>
            </section>
        </section>
    </transition>
</template>

<script>

const choose = (arr) => arr[Math.floor(Math.random() * arr.length)]

//https://www.behindthename.com/top/lists/france/1900?display=max
const femaleNames = [
    'Marie', 'Jeanne', 'Marguerite', 'Germaine', 'Louise', 'Yvonne', 
    'Madeleine', 'Suzanne', 'Marthe', 'Marcelle', 'Maria', 'Anne', 'Josephine', 
    'Eugénie', 'Berthe'
    ]
const maleNames = ['Jean', 'Louis', 'Pierre', 'Joseph', 'Henri', 'Marcel', 
    'Georges', 'André', 'Paul', 'René', 'Charles', 'François', 'Emile', 
    'Maurice', 'Albert']
const names = femaleNames.concat(maleNames)

export default {
    name: 'Start',
    data () {
        return {
            deckStyle: "marseille",
            numPlayers: 3,
            playerName: null,
            opponent1Name: choose(names),
            opponent2Name: choose(names),
            opponent3Name: choose(names),
            opponent4Name: choose(names),
            show: 'settings'
        }
    },
    methods: {
        start() {
            this.$parent.deckStyle = this.deckStyle

            this.$parent.numPlayers = Number(this.numPlayers)

            this.$parent.players = [
                this.playerName || choose(names),
                this.opponent1Name || "AI 1", 
                this.opponent2Name || "AI 2",
                this.opponent3Name || "AI 3",
                this.opponent4Name || "AI 4"
            ].slice(0, this.numPlayers)
            
            this.$parent.playState = "Play"
        }
    }
}
</script>

<style scoped>
h1 {
    display: inline-block;
}
h2 {
    margin-top: 0;
}
#deck-style-container label {
    margin-right: 25px;
}
#num-players-container label {
    margin-right: 25px;
}
#player-name-container input {
    margin-bottom: 15px;
}
.modal-body, header, footer, #num-players-container>div {
    display: flex;
    justify-content: space-between;
}
#num-players-container {
    margin-bottom: .5em;
}
fieldset:not(:first-child) {
    flex-shrink: 0;
}
.scroll {
    height: 100%;
    overflow: auto;
}
</style>
