import React, { Component } from 'react';
// import DateTimePicker from './DateTimePicker';
import Journey from './Journey';
import { Redirect } from "react-router-dom";
import axios from 'axios';

export default class AddJourney extends Component {

    constructor(props){
      super(props);
      // let today = new Date();
      this.state = {
        delivery_company: localStorage.getItem('id_company'),
        departure: '',
        arrival: '',
        date_departure: '',
        time_departure: '',
        spaces: [],
        redirect: null
        // showPickyDateTime: false,
        // date: today.getDate(),
        // month: today.getMonth(),
        // year: today.getFullYear(),
        // hour: today.getHours(),
        // minute: today.getMinutes(),
        // second: today.getSeconds(),
        // meridiem: 'PM'
      }
    }

    // showDatePicker(e){
    //   e.stopPropagation();
    //   if(this.state.showPickyDateTime == false){
    //     this.setState({showPickyDateTime: true})
    //   }
    // }

    // hideDatePicker(){
    //   this.setState({showPickyDateTime: false})
    // }

    // updateDate(data){
    //   this.setState(data);
    // }

    saveJourney(e){

      e.preventDefault();
      if( this.state.delivery_company == '' ||
          this.state.departure == '' ||
          this.state.arrival == '' ||
          this.state.date_departure == '' ||
          this.state.time_departure == ''
      ){
        console.log('here')
        this.props.viewMessageFlash('Tout les champs doivent être remplis', true);
        return;
      }

      let formData = new FormData();
      formData.append('delivery_company', this.state.delivery_company);
      formData.append('departure', this.state.departure);
      formData.append('arrival', this.state.arrival);
      formData.append('date_departure', this.state.date_departure);
      formData.append('time_departure', this.state.time_departure);
      formData.append('spaces', JSON.stringify(this.state.spaces));

      axios({
        method: 'POST',
        url: '/save-journey-ajax',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      })
      .then((response) => {
        console.log(response);
        if(response.statusText == 'OK'){
          if(response.data.error == true){
            this.props.viewMessageFlash(response.data.msg, true);
          }else{
            this.props.viewMessageFlash(response.data.msg, false, false);
            this.setState({redirect: '/app'})
            // document.location.href="/app";
          }
        }else{
          this.props.viewMessageFlash('Erreur lors de l\'enregistrement', true);
        }

      })
      .catch( (error) => {
        console.log(error);
        this.props.viewMessageFlash('Erreur lors de l\'ajout', true);
      });

    }

    updateSpaces(newSpaces){
      this.setState({spaces: newSpaces})
    }

    render() {

      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }

      // let date_picker = this.state.date + '/' + this.state.month + '/' + this.state.year
      // let datepicker = '';
      // if(this.state.showPickyDateTime){
      //   datepicker = <DateTimePicker showPickyDateTime={this.state.showPickyDateTime} hideDatePicker={this.hideDatePicker.bind(this)} updateDate={this.updateDate.bind(this)}/>
      // }

        return (
          <div className="display-flex-center">
            <h1 className="mgtop50">Ajouter un trajet</h1>
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
                  <Journey spaces={this.state.spaces} page="add-journey" updateSpaces={this.updateSpaces.bind(this)}/>
                </div>
                <button type="submit" onClick={this.saveJourney.bind(this)} className="btn btn-primary">Enregistrer</button>
              </form>
            </div>
          </div>
        );
      }
  
    }