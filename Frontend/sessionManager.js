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
      const token = localStorage.getItem('authToken');
      const userNa= localStorage.getItem('userN');
      console.log("token in storage: "+ token + "userN in storage: " + userNa);
      if(!token || !userNa){
        return false;
      }

      await fetch("../Backend/index.php", {
        method: "POST",
        body: new URLSearchParams({
          Command: "authUser",
          Token: token,
          userN: userNa,
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
  
