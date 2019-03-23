<template>
    <section>
        <div class="avatar" :class="{'is-turn': isTurn}">
            <transition name="bubble">
                <div class="speech-bubble" v-if="speech">
                    {{speech}}
                </div>
            </transition>
            <div class="crown" v-if="isDealer"></div>
            <div class="head">
                <div class="left-eye"></div>
                <div class="right-eye"></div>
                <div class="moustache" v-if="isDeclarer || isPartner">
                    <div class="right-whiskers"></div>
                    <div class="goatee" v-if="isDeclarer"></div>
                    <div class="left-whiskers"></div>
                </div>
                <div class="mouth"></div>
            </div>
            <div class="body">
                <div class="name-tag">{{ name }}
                    <div class="role">{{ role }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'Avatar',
    props: {
        name: String,
        sex: String,
        isDeclarer: Boolean,
        isDealer: Boolean,
        isTurn: Boolean,
        speech: String,
        role: String
    },
    computed: {
        isPartner() {
            return this.role
        }
    }
}
</script>

<style>
.avatar {
    background-color: var(--theme-red);
    border: 5px solid var(--theme-light-red);
    border-radius: 20%;
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    width: 100%;
}
.crown {
    background-color: var(--theme-yellow);
    clip-path: polygon(0% 0%, 25% 50%, 50% 0%, 75% 50%, 100% 0%, 100% 100%, 0% 100%);
    height: 20%;
    left: 24%;
    position: absolute;
    top: 6%;
    transform: rotate(-30deg);
    width: 20%;
    z-index: 3;
}
.head {
    background-color: #fff;
    border-radius: 40%;
    height: 50%;
    left: 27.5%;
    position: absolute;
    top: 20%;
    width: 45%;
    z-index: 2;
}
.left-eye {
    background-color: #333;
    border-radius: 40%;
    height: 16%;
    left: 35%;
    position: absolute;
    top: 30%;
    width: 7%;
}
.right-eye {
    background-color: #333;
    border-radius: 40%;
    height: 16%;
    right: 35%;
    position: absolute;
    top: 30%;
    width: 7%;  
}
.mouth {
    background-color: #333;
    border-radius: 20% 20% 20% 20%;
    height: 3%;
    left: 40%;
    position: absolute;
    top: 75%;
    width: 20%;
}
.body {
    background-color: lightblue;
    border-radius: 50% 50% 20% 20%;
    height: 30%;
    left: 10%;
    position: absolute;
    top: 65%;
    width: 80%;
    z-index: 1;
}
.moustache {
    height: 38%;
    left: 30%;
    position: absolute;
    top: 68%;
    width: 40%;
}
.right-whiskers {
    background-color: #333;
    border-radius: 100% 0% 0% 0%;
    height: 10%;
    position: absolute;
    width: 46%;
}
.left-whiskers {
    background-color: #333;
    border-radius: 0% 100% 0% 0%;
    height: 10%;
    position: absolute;
    right: 0%;
    width: 46%;
}
.goatee {
    background-color: #333;
    border-radius: 0% 0% 100% 100%;
    height: 50%;
    left: 35%;
    position: absolute;
    top: 38%;
    width: 30%;
}
.name-tag {
    font-size: 1.2em;
    font-weight: bold;
    position: absolute;
    text-align: center;
    top: 40%;
    width: 100%;
}
.role {
    background-color: lightyellow;
    font-weight: bold;
    font-size: .75em;
    border-radius: .5em;
    }
.is-turn {
    border: 5px solid pink;
    background-color: var(--theme-light-red);
}
.speech-bubble {
    margin: auto;
    display: inline-block;
	position: absolute;
    bottom: 90%;
	background: white;
	border-radius: .4em;
    padding: .1em 1em;
    z-index: 100;
}
.speech-bubble:after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 0;
	border: .5em solid transparent;
	border-top-color: white;
	border-bottom: 0;
	margin-left: -1em;
	margin-bottom: -.5em;
}
.bubble-enter-active, .bubble-leave-active {
  transition: opacity 1s;
}
.bubble-enter-active {
  animation: bounce-in .5s;
}
.bubble-leave-active {
  animation: bounce-in .5s reverse;
}
.bubble-enter, .bubble-leave-to {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>