<template>
  <div class="image">
    <img src="../assets/logo.png" />
  </div>
  <h2 class="card__title3">Modifier votre profil:</h2>
  <div v-if="loading">En Chargement . . .</div>
  <div v-else class="form-row-column">
    <div class="form-row__input">
      <label for="pseudo"> Titre </label>
      <input id="pseudo" v-model="pseudoView" type="pseudo" />
    </div>
    <div class="form-row__input">
      <div>
        <input type="file" @change="updateImagePost2" />
        <img v-bind:src="oldImagePP" alt="Ancienne image User" />
      </div>
      <button @click="updatePost()" class="button">Mettre à jour</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      id: null,
      oldImagePPPP: null,
      pseudoView: null,
      userImagePP: null,
      loading: true,
    };
  },

  created() {
    fetch(process.env.VUE_APP_BASE_API + "user/" + localStorage.getItem("userId"), {
      method: "GET",
      headers: {
        Authorization: "bearer: " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        return response.json();
        
      })
      .then((data) => {
        console.log(data);
        this.pseudoView = data.pseudo;
        this.oldImagePP = data.image;
        this.id = data.id;
        this.loading = false;
        const isAdmin =
          localStorage.getItem("isAdmin") == "true" ? true : false;
        if (!(isAdmin || localStorage.getItem("userId") == data.User.id)) {
          this.$router.push("/forum");
        }
      });
  },
  methods: {
    updatePost() {
      let formData = new FormData();
      formData.append("pseudo", this.pseudoView);
      if (this.userImagePP != null) {
        formData.append("image", this.userImagePP);
      }
      fetch(process.env.VUE_APP_BASE_API + "user/" + localStorage.getItem("userId") , {
        method: "PUT",
        headers: {
          Authorization: "bearer: " + localStorage.getItem("token"),
        },
        body: formData,
      })
        .then(() => {
          this.pseudoView = "";
          this.userImagePP = "";
          this.$router.push("/profile");
        })
        .catch(() => alert("Veuillez re essayer plus tard "));
    },
    updateImagePost2(e) {
      this.userImagePP = e.target.files[0];
    },
  },
};
</script>

<style scoped>
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}
.form-row__input::placeholder {
  color: #aaaaaa;
}
.image {
  max-width: 50%;
  display: flex;
  justify-content: center;
  width: 80%;
}
.card__title3 {
  text-align: start;
  font-weight: 600;
  color: white;
}
</style>
