window.sessionManager = {
    setTokenAndUsername: function(token, userN) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userN', userN);
    },
    getToken: function() {
      return localStorage.getItem('authToken');
    },
    getUserN: function(){
      return localStorage.getItem('userN');
    },
    clearToken: function() {
      localStorage.removeItem('authToken');
    },
    isAuthenticated: async function() {
      fetch("../Backend/index.php", {
        method: "POST",
        body: new URLSearchParams({
          Command: "authUser",
          Token: this.getToken(),
          userN: this.getUserN(),
        }),
      }).then((response) => {
        if(!response.ok){
          throw new Error("Authentification failed");
        }
        return response.json();
      }).then((data)=> {
        if(data[0]){
          console.log("authentification successful.");
          return true;
        }else{
          console.log("Authentification failed because of",data[1]);
          return false;
        }
      });
    }
};
  
