<template>
  <header class="header">
    <h1 class="header__title">Стаканы</h1>
    <nav class="nav">
      <router-link to="/">Состояние стаканов</router-link>
      <router-link to="/change">Изменить символ</router-link>
    </nav>
  </header>
  <router-view v-slot="{ Component }">
    <keep-alive include="HomeView,ChangeView" :max="4">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #031526;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  overflow-y: hidden;
}

body {
  height: 100%;
  max-height: 100vh;
}

.header {
  width: 100vw;
  display: flex;
  align-items: center;
  padding: 20px 30px;
  background-color: #181a20;
  color: white;

  &__title {
    font-size: 24px;
  }
}

.nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  color: white;

  a {
    border-radius: 4px;
    min-height: 24px;
    border: none;
    background-image: none;
    background-color: rgb(252, 213, 53);
    font-weight: bold;
    color: #2c3e50;
    padding: 0.55em;
    margin-right: 10px;
    text-decoration: none;
    transition: background-color 0.3s ease-out;

    &:hover {
      background-color: rgb(230, 192, 140);
    }

    &.router-link-exact-active {
      background-color: rgb(255, 242, 190);
      font-weight: bold;
      color: #072c50;
    }
  }
}
</style>
