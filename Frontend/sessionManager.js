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
      const userNa = localStorage.getItem('userN');
      
      if (!token || !userNa) {
        return false;
      }
    
      try {
        const response = await fetch("../Backend/index.php", {
          method: "POST",
          body: new URLSearchParams({
            Command: "authUser",
            Token: token,
            userN: userNa,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
    
        const data = await response.json();
    
        if (data[0]) {
          console.log("Authentication successful.");
          return true;
        } else {
          console.log("Authentication failed because of", data[1]);
          return false;
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        return false;
      }
    }
};
  
