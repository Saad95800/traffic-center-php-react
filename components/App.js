import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import NavBar from './navbar/Navbar';
import Logout from './log/Logout';
import AddJourney from './journey/AddJourney';
import JourneyList from './journey/JourneyList.js';


export default class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {

    let data = {};
    data.app = 'client';

    return (
      <div>
      <BrowserRouter>
            <div className="">
                <div id="message-flash"></div>
                
                <div className="container-app">
                
                  <AnimatedSwitch
                    atEnter={{ opacity: 0 }}
                    atLeave={{ opacity: 0 }}
                    atActive={{ opacity: 1 }}
                    className="switch-wrapper">
                          <Route 
                            path="/app"
                            data={data}
                            render={(props) => { return <JourneyList {...props}/>}} 
                          />
                          <Route 
                            path="/add-journey"
                            data={data}
                            render={(props) => { return <AddJourney {...props}/>}} 
                          />
                          <Route 
                            path="/logout"
                            data={data}
                            render={(props) => { return <Logout {...props}/>}} 
                          />
                  </AnimatedSwitch>
                </div>
                <Route 
                  render={ (props) => { return <NavBar {...props}/>} }
                />
            </div>
      </BrowserRouter>
      </div>
    );
  }
}