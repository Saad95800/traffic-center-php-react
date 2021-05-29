import React, { Component } from 'react';
import NavItem from './NavItem';
import axios from 'axios';

export default class NavBar extends Component {

  constructor(props){

    super(props);

    let hidden = false;
    if(screen.width < 450){
      hidden = true;
    }else{
      hidden = this.props.menuHidden;
    }
    this.state = {
      menuHidden: hidden,
      companyName: '',
      displayMenuTop: 'none'
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

  viewMenuTop(e){
    e.preventDefault()
    if(this.state.displayMenuTop == 'block'){
      this.setState({displayMenuTop: 'none'})
    }else{
      this.setState({displayMenuTop: 'block'})
    }
  }

  render() {

    let cssNavbar = '-120px';
    if(this.state.menuHidden === false){
      cssNavbar = '0px';
    }
    let add_journey = '';
    let old_journey = '';

    if(localStorage.getItem('id_company') == 1){
      add_journey = <NavItem
                            url={'/add-journey'}
                            class="display-flex-center navbar-item add-journey"
                            namelink=""
                            text=""
                            imgClassName="size30 add-journey-img"
                            style={{backgroundColor: (this.props.navItemActive =='add-journey')? '#76768a': 'transparent'}}
                            nameItem="Ajouter un trajet"
                            styleBlock={{}}
                          />    
      old_journey = <NavItem
                          url={'/old-journey-list'}
                          class="display-flex-center navbar-item list-old-journey"
                          namelink=""
                          text=""
                          imgClassName="size30 list-old-journey-img"
                          style={{backgroundColor: (this.props.navItemActive =='old-journey-list')? '#76768a': 'transparent'}}
                          nameItem="Trajets archivés"
                          styleBlock={{}}
                        />        
    }

    return (
      <div>
        <div className="nav-mobile" onClick={this.viewMenu.bind(this)}></div>
        <nav className="navbar-app" style={{left: cssNavbar}}>
            <NavItem
                            url={'/app'}
                            class="display-flex-center navbar-item list-journey"
                            namelink=""
                            text=""
                            imgClassName="size30 list-journey-img"
                            style={{marginTop: '75px', backgroundColor: (this.props.navItemActive =='journey-list')? '#76768a': 'transparent'}}
                            nameItem="Trajets en cours"
                            styleBlock={{}}
                          />
            {add_journey}
            {old_journey}
            <div className="display-flex-center navbar-item logout">
                <a href="/logout" onClick={this.logout.bind(this)}>
                  <div className="display-flex-center">
                    <div className="size30 logout-img" style={{textAlign: 'center'}}></div>
                    <span style={{textAlign: 'center', fontSize: '16px', color: '#fff'}}></span>
                  </div> 
                </a>
            </div>

        </nav>
        <nav className="navbar-app-top">
          {/* <NavItem
              url={'/app'}
              class="logo-item vitrine-item"
              namelink=""
              text={this.state.companyName}
              imgClassName="size30 logo-img"
              style={{}}
              styleBlock={{alignItems: 'flex-end'}}
            /> */}
            <div className="nav-item-company" onClick={this.viewMenuTop.bind(this)}>
              {this.state.companyName}
                <div className="menu-top" style={{display: this.state.displayMenuTop}}>
                    <div className="arrow-menu-top"></div>
                    <div>Item 1</div>
                    <div>Item 2</div>
                    <div>Item 3</div>
                </div>
            </div>
        </nav>
      </div>
    );

  }
}
