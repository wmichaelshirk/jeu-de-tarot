<template>
    <transition name="modal">
        <div class="modal-wrapper">  
            <div class="modal">
                <h1>{{ $t('headings.playAgain') }}</h1>
                <div class="modal-body">
                    <div class="table-container">
                        {{ $t("headings.pots") }}: {{ score.pots.join(', ') }}
                    <table>
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
                                <th v-for="(player, index) in players" :key="index">{{ player }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(game, no) in score.scores[0]" :key="no">
                                <td>{{ no + 1 }}</td>
                                <td v-for="(playerScore, i) in score.scores" :key="i"
                                :title="breakdown(playerScore[no])"
                                :class="{'declarer': playerScore[no].declarer, 'loser': playerScore[no].payout < 0, 'partner': playerScore[no].partner}"
                                >{{ total(playerScore[no]) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td v-for="(playerScore, i) in score.scores" :key="i">{{ sum(playerScore.map(total)) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                    </div>
                    <button @click="$emit('new-game')">{{ $t('headings.yes') }}</button>
                    <button @click="$emit('start-over')">{{ $t('headings.no') }}</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { bids, types } from '../game/tarot-play'
import { deck } from '../game/deck';

export default {
    name: 'Bid',
    methods: {
        sum(arr) {
            return arr.reduce((a, b) => a + b, 0)
        },
        total(gamescore) {
            return (gamescore.stake || 0) + 
                (gamescore.score || 0) + 
                (gamescore.payout || 0) + 
                (gamescore.purchase || 0)
        },
        breakdown(gamescore) {
            return [
                (gamescore.stake ? 'Stake: ' + gamescore.stake : ''),
                (gamescore.purchase ? 'Purchase: ' + gamescore.purchase : ''),
                (gamescore.score ? 'Score: ' + gamescore.score : ''),
                (gamescore.payout ? 'Payout: ' + gamescore.payout : '')
            ].filter(s=>s).join(', ')
        }

    },
    props: {
        score: Object,
        players: Array
    }
}
</script>

<style scoped>
.modal {
    height: 16em;
}
.modal-body table {
    table-layout: auto;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    color: darkslategrey;
}
thead tr th {
    position:sticky;
    top:0;
    background: white;
}
.table-container {
    height: 9em;
    width: 100%;
    overflow-y: auto;
    margin-bottom: 1em;
}
tfoot {
    border-top: 1px solid grey;
    font-weight: bold;
}
.modal-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 1em;
}
.declarer {
    font-weight: bold;
    color:white;
    background-color: navy;
    border-radius: 1em;
}
.partner {
    font-weight: bold;
}
.loser {
    background-color: crimson;
}
</style>
