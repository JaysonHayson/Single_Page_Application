const sessionManager = {
    token: null,
  
    init() {
      this.token = localStorage.getItem('sessionToken');
    },
  
    setToken(token) {
      this.token = token;
      localStorage.setItem('sessionToken', token);
    },
  
    clearToken() {
      this.token = null;
      localStorage.removeItem('sessionToken');
    },
  
    isAuthenticated() {
      return this.token !== null;
    }
};
  
export default sessionManager;