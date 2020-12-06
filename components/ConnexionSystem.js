import React, { Component } from 'react';
import axios from 'axios';

export default class ConnexionSystem extends Component {

    constructor(props){
      super(props);

      this.state = {
        viewLoginForm: true,
        viewSignUpForm: false,
      }

    }
    
    displaySignUpForm(){
        console.log('view signup form')
        this.setState({viewSignUpForm: true, viewLoginForm: false});
    }
    displayLoginForm(){
        console.log('view login form')
        this.setState({viewSignUpForm: false, viewLoginForm: true});
    }


    render() {

        let signUpForm = '';
        let loginForm = '';
        if(this.state.viewSignUpForm === true && this.state.viewLoginForm === false){
            signUpForm =    <form id="form-signup">
                                <h1>Inscription</h1>
                                <div className="form-group">
                                    <label htmlFor="login-email">Adresse email</label>
                                    <input type="email" className="form-control" id="login-email" placeholder="Votre email"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="login-siret">Siret</label>
                                    <input type="text" className="form-control" id="login-siret" placeholder="Numéro de siret"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="login-password1">Mot de passe</label>
                                    <input type="password" className="form-control" id="login-password1" placeholder="Mot de passe"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="login-password2">Confirmation du mot de passe</label>
                                    <input type="password" className="form-control" id="login-password2" placeholder="Confirmation du mot de passe"/>
                                    <div className="link-login" onClick={this.displayLoginForm.bind(this)}>Déjà inscrit ? Se connecter</div>
                                </div>
                                <div className="display-flex-center">
                                    <button type="submit" className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>S'inscrire</button>
                                </div>
                            </form>
        }else{
            loginForm = <form id="form-signin">
                            <h1>Connexion</h1>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Adresse email</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Mot de passe</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                                <div className="link-login" onClick={this.displaySignUpForm.bind(this)}>Pas encore inscrit ? Créer un compte</div>
                            </div>
                            <div className="display-flex-center">
                                <button type="submit" className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Se connecter</button>
                            </div>
                        </form>
        }
        return (
                <div style={{width: '80%'}}>
                    {loginForm}
                    {signUpForm}
                </div>
        );
      }
  
    }