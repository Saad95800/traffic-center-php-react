import React, { Component } from 'react';
import NavItem from './NavItem';
import axios from 'axios';

export default class NavBar extends Component {

  constructor(props){

    super(props);

    let hidden = false;
    if(screen.width < 450){
      hidden = true;
    }
    this.state = {
      menuHidden: this.props.menuHidden,
      companyName: ''
    }
    
  }

  componentDidMount(){
    let id_company = localStorage.getItem('id_company');
    let formData = new FormData();
    formData.append('id_company', id_company);
    
    axios({
      method: 'POST',
      url: '/get-company-ajax',
      responseType: 'json',
      data: formData
    })
    .then((response) => {

      console.log(response);
      if(response.statusText == 'OK'){
        if(response.data.error == true){
          this.viewMessageFlash('Erreur lors de l\'affichage des données', true);
        }else{
          this.setState({companyName: response.data.name_company})
        }
      }else{
        this.viewMessageFlash('Erreur lors de l\'affichage des données', true);
      }


    })
    .catch( (error) => {
      console.log(error);
    });

  }

  viewMenu(){
    if(this.state.menuHidden === false){
      this.setState({menuHidden: true})
    }else{
      this.setState({
        menuHidden: false
      })
    }
  }

  logout(e){
    e.preventDefault();

    axios({
      method: 'POST',
      url: '/logout',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {}
    })
    .then((response) => {
      console.log(response);
      if(response.statusText == 'OK'){
        window.localStorage.setItem('id_company', '');
        window.localStorage.setItem('date_connexion', '');
        document.location.href="/";
      }else{
        this.viewMessageFlash('Erreur lors de la tentative de déconnexion', true);
      }

    })
    .catch( (error) => {
      console.log(error);
      this.viewMessageFlash('Erreur lors de la déconnexion', true);
    });

  }

  render() {

    let cssNavbar = '-120px';
    if(this.state.menuHidden === false){
      cssNavbar = '0px';
    }
    let add_journey = '';

    if(localStorage.getItem('id_company') == 1){
      add_journey = <NavItem
                            url={'/add-journey'}
                            class="display-flex-center navbar-item add-journey"
                            namelink="Ajouter un trajet"
                            text=""
                            imgClassName="size50 add-journey-img"
                          />      
    }

    return (
      <div>
        <div className="nav-mobile" onClick={this.viewMenu.bind(this)}></div>
        <nav className="navbar-app" style={{left: cssNavbar}}>
            <NavItem
                            url={'/app'}
                            class="display-flex-center logo-item vitrine-item"
                            namelink=""
                            text={this.state.companyName}
                            imgClassName="size50 logo-img display-flex-center"
                          />
            <NavItem
                            url={'/app'}
                            class="display-flex-center navbar-item list-journey"
                            namelink="Liste des trajets"
                            text=""
                            imgClassName="size50 list-journey-img"
                          />
            {add_journey}
            {/* <NavItem
                            url={'/logout'}
                            class="display-flex-center navbar-item logout"
                            namelink="Se déconnecter"
                            text=""
                            imgClassName="size50 logout-img"
                          /> */}
            <div className="display-flex-center navbar-item logout">
                <a href="/logout" onClick={this.logout.bind(this)}>
                  <div className="display-flex-center">
                    <div className="size50 logout-img" style={{textAlign: 'center'}}></div>
                    <span style={{textAlign: 'center', fontSize: '16px', color: '#fff'}}>Se déconnecter</span>
                  </div> 
                </a>
            </div>

        </nav>
      </div>
    );

  }
}
