<template>
  <div class="card">
    <img src="../assets/logomyd32px.png" />
    <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
    <h1 class="card__title" v-else>Inscription</h1>
    <p class="card__subtitle" v-if="mode == 'login'">
      Tu n'as pas encore de compte ?
      <span class="card__action" @click="switchToCreateAccount()"
        >Créer un compte</span
      >
    </p>
    <p class="card__subtitle" v-else>
      Tu as déjà un compte ?
      <span class="card__action" @click="switchToLogin()">Se connecter</span>
    </p>



    <div class="form-row" >
      <input
        v-model="pseudo"
        class="form-row__input"
        type="text"
        placeholder="Pseudo"
      />
      <span v-if="errors.pseudo">{{ errors.pseudo }}</span>
    </div>

        <div class="form-row" v-if="mode == 'create'">
      <input
        v-model="email"
        class="form-row__input"
        type="text"
        placeholder="Adresse mail"
      />
      <span v-if="errors.email">{{ errors.email }}</span>
    </div>
    
    <div class="form-row">
      <input
        v-model="password"
        class="form-row__input"
        type="password"
        placeholder="Mot de passe"
      />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>
   
    <div class="form-row">
      <button
        @click="login()"
        class="button"
        :class="classButton"
        v-if="mode == 'login'"
      >
      
        <span >Connexion</span>
      </button>
      <button
        @click="createAccount()"
        class="button"
        :class="classButton"
        v-else
      >
        
        <span >Créer mon compte</span>
      </button>
      <span v-if="success">{{ success }}</span>
      <span v-if="error">{{error}}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "Login",
  data: function () {
    return {
      mode: "login",
      email: "",
      pseudo: "",
      password: "",
      errors: [],
      error:"",
      success: "",
    };
  },
  watch: {
    email(newValue) {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(newValue)) {
        this.errors["email"] = "";
      } else {
        this.errors["email"] = "L'adresse email n'a pas un bon format";
      }
    },
    pseudo(newValue) {
      if (
        !/^[À-ÿA-z]+$|^[À-ÿA-z]+-[À-ÿA-z]+$/.test(newValue) ||
        newValue.length > 20
      ) {
        //Regex marche à l'envers
        this.errors["pseudo"] = "Saisissez votre prénom correctement";
      } else {
        this.errors["pseudo"] = "";
      }
    },
    password(newValue) {
      if (newValue.length < 9 && newValue.length > 30) {
        this.errors["password"] =
          "Saisissez un mot de passe qui ne soit pas trop long ";
      } else {
        this.errors["password"] = "";
      }
    },
  },
  computed: {
    classButton() {
      if (this.mode == "create") {
        if (!this.verifyInput()) {
          return "button--disabled";
        }
        return "";
      }
      return "";
    },
  },
  methods: {
    switchToCreateAccount() {
      this.mode = "create";
    },
    switchToLogin() {
      this.mode = "login";
    },
    login() {
      if (this.pseudo == "" || this.password == "") {
        alert("Veuillez entrer votre login et votre mot de passe");
      } else {
        fetch(process.env.VUE_APP_BASE_API + "auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pseudo: this.pseudo,
            password: this.password,
          }),
        })
        .then(response => {
            if(response.ok){
                
                return response.json()
            }else{
                this.error="Identifiant inccorecte"
            }
        })
          .then((response) => {
            
            console.log(response);
            
              localStorage.setItem("userId", response.userId);
              localStorage.setItem("isAdmin", response.isAdmin);
              localStorage.setItem("token", response.token);
              localStorage.setItem("pseudo", response.pseudo);
              localStorage.setItem("email", response.email);
              
              this.$router.push("/profile");
 
          })
          //Si échec authentification, avertissement de l'utilisateur
          .catch((error) => {
            console.log(error);
          });
      }
    },
    createAccount() {
      if (this.verifyInput()) {
        fetch(process.env.VUE_APP_BASE_API + "auth/signup", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pseudo: this.pseudo,
            email: this.email,
            password: this.password,
          }),
        })
          .then((response) => {
            console.log(response);
            if(response.ok){
                this.success =
              "Merci pour votre inscription, vous pouvez maintenant vous connecter";
            this.switchToLogin(); // Appeler la méthode page de connexion
            }else{
              this.success = "Il y a eu une erreur "
            }
            
          })
          .catch(() => alert("Veuillez re essayer plus tard "));
      }
    },
    verifyInput() {
      if (this.mode == "create") {
        return (
          this.errors["pseudo"] == "" &&
          this.errors["email"] == "" &&
          this.errors["password"] == ""
        );
      }
    },
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
}
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
</style>