<template>
    <div id="app">
        <Start v-if="playState == 'Stop'" />
        <Table v-if="playState == 'Play'"
            :deck-style="deckStyle"
            :players="players"
            :num-players="numPlayers"
            @start-over="playState='Stop'"/>
    </div>
</template>

<script>
import Start from './components/Start';
import Table from './components/Table';

export default {
    name: 'app',
    components: {
        Start, Table
    },
    data () {
        return {
            deckStyle: "marseille",
            numPlayers: 3,
            players: [],
            playState: "Stop"
        }
    }
}
</script>

<style>
@import 'styles/marseille.css';
@import 'styles/nouveau.css';
@import url('https://fonts.googleapis.com/css?family=Amarante');

body {
    color: darkred;
    height: 100%;
    margin: 0;
    --theme-blue: #0f8bbc;
    --theme-light-blue: #119bd1;
    --theme-navy: #2a3a4b;
    --theme-light-navy: #34495e;
    --theme-green: #009a7c;
    --theme-light-green: #00c19c;
    --theme-red: #cf4335;
    --theme-light-red: #e74c3c;
    --theme-yellow: #dec019;
    --theme-light-gray: #bebebe;

    /* background: (2,0,36);
    background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(55,153,43,1) 100%, rgba(0,212,255,1) 100%); */
    background: linear-gradient(forestgreen, darkgreen);
}
html {
    overflow-y: hidden;
    height: 100vh;
    box-sizing: border-box;
}
h1, h2, h3, h4, h5, h6 {
    font-family: 'Amarante', 'Times New Roman', Times, serif;
}
h1 { 
    font-size: 2em;
    margin: 0 0 .5em 0;
}

button, input, select, textarea {
  font-family : inherit;
  font-size   : 100%;
}

#app {
    height: 100%;
}
.modal-wrapper {
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.modal {
  margin: 4em auto;
  padding: 1em;
  background: white;
  border: 3px groove blue;
  min-width: 300px;
  max-width: 600px;
  height: 17em;
  border-radius: .5em;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
  z-index: 999;
}
.modal-body {
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

button {
    background-color: linen;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    height: 50px;
    width: 150px;
}
</style>
