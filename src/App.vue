<template>
  <div id="app">
    <img
      width="300"
      src="@/assets/logo.svg"
    />
    <div class="menu-wrapper">
      <router-link to="/">Start</router-link>
      <router-link to="/dashboard">Stats</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.menu-wrapper {
  position: absolute;
  bottom: 30px;
  right: 40px;
  a {
    padding: 30px;
    text-decoration: none;
    color: black;
    font-size: 30px;
  }
}
</style>
