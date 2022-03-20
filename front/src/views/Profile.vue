<template>
  <div class="card">
    <h1 class="card__title">Mon Espace</h1>
    <p class="card__subtitle">Ma page de profil se constitue de :</p>
    <p><b class="term">Pseudo :</b> {{ pseudo }}</p>
    <p><b class="term">Email :</b> {{ email }}</p>

    <div class="placementPencil">
      <a v-bind:href="'/userUpdate/'+ userId"> <i class="fa-solid fa-pencil"></i> </a>
    </div>


    <div class="form-row">
      <a v-if="Boolean(isAdmin)" href="/forum" class="buttonDeleteUser"> Boutique </a>
      <button @click="deleteUser()" class="button2">
        Supprimer mon compte
      </button>
    </div>
    <div class="form-row">
      <button @click="logOut()" class="button">Déconnexion</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data: function () {
    return {
      userId: null,
      isAdmin: false,
      email: "",
      pseudo: "",
    };
  },
  created() {
    this.isAdmin = localStorage.getItem("isAdmin") == "true" ? true : false;
    console.log(this.isAdmin);
    this.userId = Number(localStorage.getItem("userId"));
  },
  mounted() {
    this.email = localStorage.getItem("email");
    this.pseudo = localStorage.getItem("pseudo");
  },
  methods: {
    deleteUser() {
      fetch(
        process.env.VUE_APP_BASE_API + "user/" + localStorage.getItem("userId"),
        {
          method: "DELETE",
          headers: {
            Authorization: "bearer: " + localStorage.getItem("token"),
          },
        }
      ).then(() => {
        this.logOut();
      });
    },
    logOut() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
p {
  padding: 10px;
  margin: 30px;
}
.buttonDeleteUser {
  background: #d1515a;
  color: black;
  border-radius: 50px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 60%;
  padding: 16px;
  transition: 0.4s background-color;
  margin: auto;
}
.buttonDeleteUser:hover {
  cursor: pointer;
  color: black;
  background: #b4b4b4;
}
.button2 {
  background: #091f43;
  color: white;
  border-radius: 50px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 60%;
  padding: 16px;
  transition: 0.4s background-color;
  margin: 30px;
}
.button2:hover {
  cursor: pointer;
  color: black;
  background: #b4b4b4;
}
.placementPencil{
  display: flex;
  justify-content: end;
}
@media only screen and (min-width: 280px) and (max-width: 800px) {
  .buttonDeleteUser {
    font-weight: 600;
    font-size: 10px;
    width: 40%;
    padding: 16px;
    margin-top: 30px;
  }
}
</style>
>
