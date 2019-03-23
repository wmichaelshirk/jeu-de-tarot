<template>
    <transition name="modal">
        <div class="modal-wrapper">  
            <div class="modal">
                <h1>{{ $t("headings.bid") }}</h1>
                <div class="modal-body">
                    <slot name="body">
                        <div v-for="(move, index) in moves" :key="'move' + index">
                            <button @click="$emit('do-move', move)">{{ $t(`bids.${move.value}`) }}</button>
                        </div>
                    </slot>
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
    props: {
        bids: Array,
        moves: Array,
        players: Array
    }
}
</script>

<style scoped>
.modal-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
</style>
