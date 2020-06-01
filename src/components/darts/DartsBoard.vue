<template>
  <div class="wrapper">
    <div class="play-wrapper" v-if="gameInProgress">
      <div id="dartboard" :style="{ width: boardSize + 'px', height: boardSize + 'px' }"></div>
      <div>
        <div class="table-wrapper">
          <h2>Teraz kolej: {{ selectedUsers[selectedUserIndex].userName }}</h2>
          <div class="flex-center">
            <div
              class="custom-button"
              v-if="logsOfShots.length > 0"
              @click="shotBack"
            >
              Cofnij rzut
            </div>
            <div
              class="custom-button"
              @click="nextPlayer"
            >
              Następny gracz
            </div>
          </div>
          <h2>Tabela wyników:</h2>
          <div class="flex-center players-table">
             <div
                class="table-item flex-center m-2"
                v-for="(user, index) in selectedUsers"
                :key="`dupa${index}`"
              >
                <h2>{{ user.userName }}:</h2><h2>{{ user.pointsToWin }}</h2>
              </div>
          </div>
          <div class="shots-log ">
            <div class="flex-center"
              v-for="(shot, index) in logsOfShots"
              :key="`cwel${index}`"
            >
              Gracz:<b>{{ shot.userName }}</b>,
              trafione punkty: <b>{{ shot.shotPoints}}</b>,
              całkowita liczba rzutów: {{ shot.shotIndexOfUser }},
              pozostałe punkty: {{ shot.pointsToWin }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!gameInProgress">
      <div class="users-wrapper flex-center wh-100">
        <div>
          <h2>Tworzenie gry:</h2>
          <p>Wybierz graczy</p>
          <div class="flex-center select-user-wrapper">
            <div class="user-wrapper" v-for="(user, index) in existUsers" :key="index">
            <div class="checkbox">
              <div v-if="!user.isSelected" @click="selectUser(user, index)" class="wh-100"></div>
                <img
                  v-if="user.isSelected"
                  @click="unselectUser(user, index)"
                  src="@/assets/like.svg"
                />
              </div>
              <p>
                {{ user.userName }}
              </p>
            </div>
          </div>
        </div>
        <!-- <div>
          Wpisz wielkość tarczy:
          <input type="number" placeholder="wysokość i szerokość" v-model="boardSize">
          Na ile punktów gramy ?
          <input type="number" placeholder="Punkty" v-model="pointToWin">
        </div> -->
      </div>
      <div v-if="addingPlayer">
        Dodaj usera:
        <input placeholder="nazwa" v-model="userName">
        <input placeholder="hasło" type="password" v-model="userPassword">
        <button @click="createUser">Dodaj usera</button>
      </div>
    </div>
    <div v-if="!gameInProgress">
      <div class="start-button" @click="startGame">Start!</div>
    </div>
    <div class="video-wrapper" v-if='showGif'>
      <img
        width="500"
        :src="require(`@/assets/${gifs[gifsIndex]}`)"
      />
    </div>
    <div class="restart-button" @click="restart">Restart</div>
    <div
      v-if="gameInProgress && !statsIsSave && logsOfShots.length > 0"
      class="stats-button"
      @click="saveStats"
    >
      Zapisz statystyki
    </div>
  </div>
</template>
<script>
import Dartboard from './src/dartboard';
import { pushToFirebase, getFromFirebase } from '../../mixins/firebase';
/* eslint-disable */

export default {
  data() {
    return {
      addingPlayer: false,
      boardSize: 1000,
      gameInProgress: false,
      punktyDawida: 0,
      userName: '',
      userPassword: '',
      existUsers: '',
      selectedUsers: [],
      selectedUserIndex: 0,
      pointToWin: 301,
      logsOfShots: [],
      eventClick : '',
      gifSrc: '200w_d.gif',
      gifsIndex: 1,
      statsIsSave: false,
      gifs: [
        'awesome.gif',
        '200w_d.gif',
        '1.gif',
        '2.gif',
        '3.gif',
        '4.gif',
        '5.gif',
        '6.gif',
        '7.gif',
        '8.gif',
      ],
      showGif: false,
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    bigBoard() {
      this.boardWidth += 100;
      this.boardHeight += 100;
      const dartboard = new Dartboard('#dartboard');
        dartboard.render();
    },
    smallBoard() {
      this.boardWidth -= 100;
      this.boardHeight -= 100;
      const dartboard = new Dartboard('#dartboard');
        dartboard.render();
    },
    restart() {
      location.reload();
    },
    unselectUser(user, index) {
      this.existUsers[index].isSelected = false;
      this.selectedUsers.push(user);
    },
    selectUser(user, index) {
      this.existUsers[index].isSelected = true;
      this.selectedUsers.push(user);
    },
    createUser() {
      const user = {
        userName: this.userName,
        userPassword: this.userPassword ,
      }
      this.existUsers.push({...user, pointsToWin: this.pointToWin, shots: 0, isSelected: false});
      this.userName = '';
      this.userPassword = '';
      pushToFirebase('users', user)
    },
    getAllUsers() {
      getFromFirebase('users').then((response) => {
        let usersFromFirebase = response;
        const endArr = [];
        usersFromFirebase.map((user) => {
          user.pointsToWin = this.pointToWin;
          user.shots = 0;
          user.isSelected = false;
          endArr.push(user);
        })
        this.existUsers = endArr;

      });
    },
    startGame() {
      if(!(this.selectedUsers.length === 0)) {
        this.gameInProgress = true;
      setTimeout(() => {
        const dartboard = new Dartboard('#dartboard');
        dartboard.render();
        document.querySelector('#dartboard').addEventListener('throw', (shotEvent) => {
          this.makeShots(shotEvent);
        });
      }, 1 * 1000);
      } else {
        alert('usera wybierz noobie')
      }
    },
    makeShots(shotEvent) {
      console.log('this.gifs.length', this.gifs.length);
      console.log('this.gifsIndex', this.gifsIndex);
      const goodShot = shotEvent.detail.score >= 50;
      if(goodShot) {
        this.showGif = true;
        setTimeout(() => {
          this.showGif = false;
          if(this.gifs.length - 1 === this.gifsIndex) {
            this.gifsIndex = 0;
          } else {
            this.gifsIndex += 1;
          }
        }, 3000);
      }
      this.selectedUsers[this.selectedUserIndex].shots += 1;
      this.selectedUsers[this.selectedUserIndex].pointsToWin -= shotEvent.detail.score;
      this.logsOfShots.push({
        userName: this.selectedUsers[this.selectedUserIndex].userName,
        shotIndexOfUser: this.selectedUsers[this.selectedUserIndex].shots,
        shotPoints: shotEvent.detail.score,
        pointsToWin: this.selectedUsers[this.selectedUserIndex].pointsToWin,
        userData: this.selectedUsers[this.selectedUserIndex],
        shotDedail: shotEvent.detail,
        })
        // this.pushStatistics(this.selectedUsers[this.selectedUserIndex].fireKey, shotEvent.detail)
    },
    saveStats() {
      this.statsIsSave = true;
      this.pushMatchStats(this.logsOfShots);
    },
    pushMatchStats(stats) {
      const key = `matches/`
      pushToFirebase(key, stats);
    },
    shotBack() {
      const fireKeyIsSame = (element, key) => {
        return element.fireKey === key;
      }
      const lastShot = this.logsOfShots.pop();
      const userWhoShotFireKey = lastShot.userData.fireKey;
      this.selectedUsers.forEach((user) => {
        if(user.fireKey === userWhoShotFireKey) {
          user.shots -= 1;
          user.pointsToWin += lastShot.shotPoints;
        }
      })
    },
    nextPlayer() {
      if (this.selectedUserIndex === this.selectedUsers.length - 1) {
        this.selectedUserIndex = 0;
      } else {
        this.selectedUserIndex += 1;
      }
    }
  },
};
</script>

<style lang='scss' scoped>
.players-table {
  width:800px;
}
.m-2 {
  margin: 15px;
}
.select-user-wrapper {
  flex-wrap: wrap;

}
.custom-button {
  padding: 10px;
  margin: 5px;
  border: 2px solid sandybrown;
  width: 200px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
}
.shots-log {
  height: 600px;
  overflow: auto;
}
.start-button {
  padding: 30px;
  margin: 30px;
  border: 2px solid sandybrown;
  background: sandybrown;
  color: white;
  font-size: 60px;
  font-weight: 900;
}
.restart-button {
  background: sandybrown;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-right: 50px;
  position: absolute;
  top: 0;
  right: 0;
}
.stats-button {
  background: sandybrown;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-right: 50px;
  position: absolute;
  top: 0;
  right: 100px;
}
.video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wh-100 {
  width: 100%;
  height: 100%;
}
.flex-center {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.wrapper {
  width: 100%;
  height: 100%;
}
.users-wrapper {
  margin-top: 40px;
  margin-bottom: 40px;
}
.user-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkbox {
  width: 60px;
  height: 60px;
  margin: 30px;
  background: white;
  border: 1px black solid;
}
.play-wrapper {
  display: flex;
   justify-content: space-around;
}
.table-item {
  display: flex;
}
.table-wrapper {
  margin-left: 30px;
}
</style>
