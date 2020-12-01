import React, { Component } from 'react';
import NavItem from './NavItem';

export default class NavBar extends Component {

  constructor(props){

    super(props);

    let hidden = false;
    if(screen.width < 450){
      hidden = true;
    }
    this.state = {
      menuHidden: hidden
    }
console.log(screen.width);
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

  render() {

    let cssNavbar = '-120px';
    if(this.state.menuHidden === false){
      cssNavbar = '0px';
    }

    return (
      <div>
        <div className="nav-mobile" onClick={this.viewMenu.bind(this)}></div>
        <nav className="navbar-app" style={{left: cssNavbar}}>
            <NavItem
                            url={'/app'}
                            class="display-flex-center logo-item vitrine-item"
                            namelink=""
                            text="Traffic Center"
                            imgClassName="size50 logo-img display-flex-center"
                          />
            <NavItem
                            url={'/app'}
                            class="display-flex-center navbar-item list-journey"
                            namelink="Liste des trajets"
                            text=""
                            imgClassName="size50 list-journey-img"
                          />
            <NavItem
                            url={'/add-journey'}
                            class="display-flex-center navbar-item add-journey"
                            namelink="Ajouter un trajet"
                            text=""
                            imgClassName="size50 add-journey-img"
                          />
            <NavItem
                            url={'/logout'}
                            class="display-flex-center navbar-item logout"
                            namelink="Se déconnecter"
                            text=""
                            imgClassName="size50 logout-img"
                          />
        </nav>
      </div>
    );

  }
}
