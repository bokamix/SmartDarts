<template>
  <div class="wrapper">
    <div class="play-wrapper" v-if="gameInProgress">
      <button @click="restart">Restart</button>
      <div id="dartboard" style="width:700px; height: 700px;"></div>
      <div>
        <div class="table-wrapper">
          Teraz kolej:
          {{ selectedUsers[selectedUserIndex].userName }}
          <button @click="nextPlayer">Następny gracz</button>
          <h2>Tabela wyników:</h2>
          <div class="flex-center" v-for="(shot, index) in logsOfShots" :key="`cwel${index}`">
            {{ shot.userName }}, {{ shot.shotIndexOfUser }}, {{ shot.shotPoints}},
            {{ shot.pointsToWin }}
          </div>
          <div class="table-item" v-for="(user, index) in selectedUsers" :key="`dupa${index}`">
            <p>{{ user.userName }}:</p><p>{{ user.pointsToWin }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!gameInProgress">
      <div class="users-wrapper">
        <h2>Tworzenie gry:</h2>
        <p>Wybierz graczy</p>
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
      Dodaj usera:
      <input v-model="userName">
      <input type="password" v-model="userPassword">
      <button @click="createUser">Dodaj usera</button>
      <button @click="startGame">Start!</button>
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
      gameInProgress: false,
      punktyDawida: 0,
      userName: '',
      userPassword: '',
      existUsers: '',
      selectedUsers: [],
      selectedUserIndex: 0,
      pointToWin: 301,
      logsOfShots: [],
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
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
        console.log(endArr)
        this.existUsers = endArr;

      });
    },
    startGame() {
      console.log(this.selectedUsers.length)
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
      console.log(shotEvent.detail.score);
      this.selectedUsers[this.selectedUserIndex].shots += 1;
      this.selectedUsers[this.selectedUserIndex].pointsToWin -= shotEvent.detail.score;
      console.log('pointsToWin', this.selectedUsers[this.selectedUserIndex].pointsToWin);
      console.log('shots', this.selectedUsers[this.selectedUserIndex].shots)
      this.logsOfShots.push({
        userName: this.selectedUsers[this.selectedUserIndex].userName,
        shotIndexOfUser: this.selectedUsers[this.selectedUserIndex].shots,
        shotPoints: shotEvent.detail.score,
        pointsToWin: this.selectedUsers[this.selectedUserIndex].pointsToWin
        })

    },
    nextPlayer() {
      if (this.selectedUserIndex === this.selectedUsers.length - 1) {
        this.selectedUserIndex = 0;
      } else {
        this.selectedUserIndex += 1;
      }
      console.log(this.selectedUsers[this.selectedUserIndex])
    }
  },
};
</script>

<style lang='scss' scoped>
.wh-100 {
  width: 100%;
  height: 100%;
}
.flex-center {
  display: flex;
  justify-content: center;
}
.wrapper {
  width: 1000px;
  height: 1000px;
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
  width: 30px;
  height: 30px;
  margin: 10px;
  background: white;
  border: 1px black solid;
}
.play-wrapper {
  display: flex;
}
.table-item {
  display: flex;
}
</style>
