<template>
    <section :id="id" class="opponent-container" :class="{'dealer': isDealer}">
        <Avatar :is-turn="isTurn" :speech="speech" :is-declarer="isDeclarer" :name="name"
        :is-dealer="isDealer"
        :role="role"/>
    </section>
</template>

<script>
import Avatar from './Avatar'

export default {
    name: 'Opponent',
    components: {
        Avatar
    },
    props: {
        id: String,
        name: String,
        isDealer: Boolean,
        isDeclarer: Boolean,
        isTurn: Boolean,
        speech: String,
        role: String
    }
}
</script>

<style scoped>
.opponent-container {
    height: 12vw;
    margin: 0 auto 0 auto;
    position: absolute;
    width: 12vw;
}
/* Three player mode */
.three-player #opponent1 {
    right: 10%;
    top: 10%;
}
.three-player #opponent2 {
    left: 10%;
    top: 10%;
}
/* Four player mode */
.four-player #opponent1 {
    right: 10%;
    top: 40%;
}
.four-player #opponent2 {
    left: 18%;
    top: 4%;
}
.four-player #opponent3 {
    bottom: 10%;
    left: 10%;
}
/* Five player mode */
.five-player #opponent1 {
    bottom: 5%;
    right: 10%;
}
.five-player #opponent2 {
    right: 10%;
    top: 5%;
}
.five-player #opponent3 {
    left: 10%;
    top: 5%;
}
.five-player #opponent4 {
    bottom: 5%;
    left: 10%;
}
</style>
