<template>
    <section id="talon-container">
        <transition-group name="talon-cards" class="talon-cards">
            <Card class="talon-cards-item"
                v-for="card in cards" 
                :key="card" :card="card" 
                :is-playable="true"
                :is-facedown="!expose" />
        </transition-group>
    </section>
</template>

<script>
import Card from './Card'

export default {
    name: 'Talon',
    components: {
        Card
    },
    props: {
        cards: Array,
        expose: Boolean
    }
}
</script>

<style>
#talon-container {
    height: 15vw;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 30vw;
}
.talon-cards-item {
    display: inline-block;
    transition: all 1s;
}
.talon-cards-enter, .talon-cards-leave-to
{
    opacity: 0;
    transform: translateY(200px);
}
.talon-cards-leave-active {
    position: absolute;
}
.talon-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
