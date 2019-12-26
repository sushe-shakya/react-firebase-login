import React, {Component} from 'react';

var firebase = require('firebase');
var firebaseConfig = {
  apiKey: "AIzaSyD_KukMtJH-_wxJUFvfXdc5KwsTcKvOcNk",
  authDomain: "fir-login-7551c.firebaseapp.com",
  databaseURL: "https://fir-login-7551c.firebaseio.com",
  projectId: "fir-login-7551c",
  storageBucket: "fir-login-7551c.appspot.com",
  messagingSenderId: "221322866205",
  appId: "1:221322866205:web:c3256a0d0901bae06760f4",
  measurementId: "G-QB271MG4PF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

class Authentication extends Component {

  login(event){
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    console.log(email,password)

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    // TODO: handle login promise
    promise.then( resp=> {
      var lout = document.getElementById("logout");
      this.setState({message:"Welcome "+resp.user.email});
      lout.classList.remove('hide');
    }
    );

    // using fat arrow function
    promise.catch(e => {
      var message = e.message;
      console.log(message);
      this.setState({message:message});
    });
  }

  logout(){
    firebase.auth().signOut();
    var lout = document.getElementById("logout");
    lout.classList.add('hide');
    this.setState({message: "Logged out successfully"});
  }

  signUp(event){
      const email = this.refs.email.value;
      const password = this.refs.password.value;
      console.log(email,password);
      const auth = firebase.auth();

      const promise = auth.createUserWithEmailAndPassword(email, password);
      promise
      .then(resp =>{
        console.log(resp);
        var message = "Account created for "+ resp.user.email;
        firebase.database().ref('users/'+resp.user.uid).set({email:resp.user.email});
        this.setState({message:message});
      })
      .catch(e => {
        var message = e.message;
        console.log(message);
        this.setState({message:message});
      });
  }

  google(event){
    console.log("I am in google method");
    var provider = new firebase.auth.GoogleAuthProvider();
    const promise = firebase.auth().signInWithPopup(provider);

    promise.then(resp=>{
      var user = resp.user;
      console.log(resp);
      firebase.database().ref('users/'+user.uid).set({email:user.email, name:user.displayName});
      this.setState({message:"Account created for "+user.email});
    }).catch(e=>{
      var message = e.message;
      this.setState({message:message});
    });
  }

  constructor(props){
    super(props);

    this.state = {
      message:''
    };
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
  }
  render(){
    return(
      <div>
        <input id="email" ref="email" type="email" placeholder="Enter your email"/><br/>
        <input id="pass" ref="password" type="password" placeholder="Enter your password"/><br/>
        <p>{this.state.message}</p>
        <button onClick={this.login}> Log In</button>
        <button onClick={this.signUp}> Sign Up</button>
        <button id="logout" className="hide" onClick={this.logout}> Log Out</button><br/>
        <button id="google" className="google" onClick={this.google}>Sign In with Google</button>
      </div>
    );
  }
}
export default Authentication;
