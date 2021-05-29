import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import NavBar from './navbar/Navbar';
import Logout from './log/Logout';
import AddJourney from './journey/AddJourney';
import EditJourney from './journey/EditJourney';
import JourneyList from './journey/JourneyList.js';

let styles = {
  mfs: {
    width: '100%', 
    height: '0px', 
    backgroundColor: '#00ba62', 
    color: 'white',
    position: 'fixed',
    top: '0px',
    zIndex: '2',
    textAlign: 'center',
    transition: 'height 0.5s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  }
}

export default class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      displayMessageFlash: 'none',
      menuHidden: false,
      navItemActive: 'list-journey'
    }
  }

  viewMessageFlash(msg, error = false){
    console.log(msg)
    let mf = document.querySelector("#message-flash");
    mf.style.height = '40px';
    this.setState({displayMessageFlash: 'inline-block'});
    mf.querySelector("#message-flash-box").innerHTML = msg;
    if(error){
      mf.style.backgroundColor = 'rgb(255, 29, 22)';
    }else{
      mf.style.backgroundColor = '#00ba62';
    }
  }

  hideMessageFlash(){
      this.setState({displayMessageFlash: 'none'})
      let mf = document.querySelector("#message-flash");
      mf.style.height = '0px'
  }

  hideMenu(){
    console.log('click hide menu')
    this.setState({menuHidden: true})
  }

  setColorNavItem(navItem){
    console.log(navItem)
    this.setState({navItemActive: navItem})
  }

  render() {

    let data = {};
    data.app = 'client';

    return (
      <div>
      <BrowserRouter>
            <div className="">
                <div id="message-flash" style={styles.mfs}>
                    <span id="message-flash-box"style={{flex: '15'}} ></span>
                    <button type="button" onClick={this.hideMessageFlash.bind(this)} style={{flex: '1', color: '#fff', display: this.state.displayMessageFlash}} className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div className="container-app">
                
                  {/* <AnimatedSwitch
                    atEnter={{ opacity: 0 }}
                    atLeave={{ opacity: 0 }}
                    atActive={{ opacity: 1 }}
                    className="switch-wrapper"> */}
                          <Route 
                            path="/app"
                            data={data}
                            render={(props) => { return <JourneyList {...props} setColorNavItem={this.setColorNavItem.bind(this)} old="false" hideMenu={() => {this.hideMenu()}}/>}} 
                          />
                           {/* <Route 
                            path="/old-journey_list"
                            data={data}
                            render={(props) => { return <Toto {...props}/>}} 
                          /> */}
                          <Route
                            path="/add-journey"
                            data={data}
                            render={(props) => { return <AddJourney {...props} setColorNavItem={this.setColorNavItem.bind(this)} hideMenu={() => {this.hideMenu()}} viewMessageFlash={this.viewMessageFlash.bind(this)} hideMessageFlash={this.hideMessageFlash.bind(this)} />}} 
                          />
                          <Route 
                            path="/old-journey-list"
                            data={data}
                            render={(props) => { return <JourneyList {...props} setColorNavItem={this.setColorNavItem.bind(this)} old="true" hideMenu={() => {this.hideMenu()}} viewMessageFlash={this.viewMessageFlash.bind(this)} hideMessageFlash={this.hideMessageFlash.bind(this)} />}} 
                          />
                          <Route 
                            path="/journey/edit/:id_journey"
                            data={data}
                            render={(props) => { return <EditJourney {...props} setColorNavItem={this.setColorNavItem.bind(this)} hideMenu={() => {this.hideMenu()}} viewMessageFlash={this.viewMessageFlash.bind(this)} hideMessageFlash={this.hideMessageFlash.bind(this)} />}} 
                          />
                          {/* <Route 
                            path="/logout"
                            data={data}
                            render={(props) => { return <Logout {...props}/>}} 
                          /> */}
                  {/* </AnimatedSwitch> */}
                </div>
                <Route 
                  render={ (props) => { return <NavBar navItemActive={this.state.navItemActive} {...props} menuHidden={this.state.menuHidden}/>} }
                />
            </div>
      </BrowserRouter>
      </div>
    );
  }
}