<template>
  <div class="home">
    <p v-if="loading">Wczytywanie danych</p>
    <p v-if="users[selectUser]">Całkowita ilość rzutów: {{ users[selectUser].points.length}}</p>
    <select @change="selectPerson($event.target.value)" v-if="!loading">
      <option>Wybierz usera</option>
      <option v-for="(user, index) in users" :key="index" :value="user.key">
        {{ user.key }}
      </option>
    </select>
    <D3BarChart
      v-if="showPoints"
      :config="chart_config"
      :datum="chart_data"
      :title="chart_title"
      :source="chart_source"
    ></D3BarChart>
  </div>
</template>

<script>
// @ is an alias to /src
import { D3BarChart } from 'vue-d3-charts';
import { getFromFirebase } from '../mixins/firebase';

export default {
  data() {
    return {
      showPoints: false,
      loading: true,
      chart_title: 'Punkty dla gracza',
      chart_source: 'Punkty',
      chart_data: [],
      chart_config: {
        key: 'points',
        values: ['amount'],
      },
      matches: [],
      users: [],
      awaliblePoints: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
        14, 15, 16, 17, 18, 19, 20, 2, 4, 6, 8, 10, 12, 14, 16, 18,
        20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 3, 6, 9, 12, 15,
        18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
      selectUser: '',
      selectPoint: 10,
      howMuchShots: '',
    };
  },
  components: {
    D3BarChart,
  },
  mounted() {
    this.getFromFirebase('users').then((response) => {
      this.loading = true;
      response.forEach((user) => {
        this.users.push(user.userName);
      });
      this.users = this.users.map((userString) => ({ key: userString, points: [] }));

      this.getFromFirebase('matches').then((response2) => {
        response2.forEach((match) => {
          if (match.length > 10) {
            this.matches.push(match);
          }
        });
        this.setShotsToUsers();
      });
    });
  },
  computed: {
  },
  methods: {
    selectPerson(person) {
      this.showPoints = false;
      this.getPointsForUser(person);
    },
    getFromFirebase,
    setShotsToUsers() {
      this.matches.forEach((match) => {
        match.forEach((shot) => {
          this.users.forEach((user) => {
            if (user.key === shot.userName) {
              user.points.push(shot.shotPoints);
            }
          });
          this.loading = false;
        });
      });
      const userWithPoint = [];
      this.users.forEach((user) => {
        if (user.points.length > 0) {
          userWithPoint.push(user);
        }
      });
      this.users = userWithPoint;
    },
    getPointsForUser(user) {
      this.users.forEach((userObj, index) => {
        if (userObj.key === user) {
          this.selectUser = index;
        }
      });
      this.createStats(this.selectPoint, this.selectUser);
    },
    createStats() {
      const count = {};
      this.users[this.selectUser].points.forEach((i) => {
        count[i] = (count[i] || 0) + 1;
      });
      const values = Object.values(count);
      const keys = Object.keys(count);
      const arrayToStats = [];
      values.forEach((value, index) => {
        const object = { amount: value, points: keys[index] };
        arrayToStats.push(object);
      });
      this.chart_data = arrayToStats;
      setTimeout(() => {
        this.showPoints = true;
      }, 500);
    },
  },
};
</script>
