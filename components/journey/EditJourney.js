import React, { Component } from 'react';
import Journey from './Journey';
import { Redirect } from "react-router-dom";
import axios from 'axios';

export default class EditJourney extends Component {

    constructor(props){
      super(props);
      this.state = {
        redirect: false
      }
    }

    saveJourney(e){
        e.preventDefault();
    }

    render() {

      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }

        return (
          <div className="display-flex-center" style={{marginBottom: '100px'}}>
            <h1 className="mgtop50">Modifier un trajet</h1>
            <div className="form-container" style={{minWidth: '70%'}}>
              <form method="POST" encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="select-delivery-company">Entreprise de livraison</label>
                  <select className="form-control" id="select-delivery-company" onChange={() => {this.setState({delivery_company: document.querySelector('#select-delivery-company').value})}} >
                    <option id="1">SDY Transport</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="departure">Ville de départ</label>
                  <input type="text" className="form-control" id="departure" onChange={() => {this.setState({departure: document.querySelector('#departure').value})}} placeholder="Ex : Marseille" />
                </div>
                <div className="form-group">
                  <label htmlFor="arrival">Ville d'arrivée</label>
                  <input type="text" className="form-control" id="arrival" onChange={() => {this.setState({arrival: document.querySelector('#arrival').value})}} placeholder="Ex : Toulouse" />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="date-departure">Date de départ</label>

                  <input type="date" className="form-control" id="date-departure"  onChange={() => {this.setState({date_departure: document.querySelector('#date-departure').value})}} />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="hour-departure">Heure de départ</label>
                  <input type="time" className="form-control" id="time-departure" onChange={() => {this.setState({time_departure: document.querySelector('#time-departure').value})}} />
                </div>
                <div className="form-group">
                  <label htmlFor="avalaible_places">Emplacements disponibles du camion</label>
                  <Journey spaces={this.state.spaces} page="add-journey"/>
                </div>
                <div className="display-flex-center">
                  <button type="submit" onClick={this.saveJourney.bind(this)} className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        );
      }
  
    }