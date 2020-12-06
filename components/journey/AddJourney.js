import React, { Component } from 'react';
import DateTimePicker from './DateTimePicker';

export default class AddJourney extends Component {

    constructor(props){
      super(props);
      let today = new Date();
      this.state = {
        showPickyDateTime: false,
        date: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        hour: today.getHours(),
        minute: today.getMinutes(),
        second: today.getSeconds(),
        meridiem: 'PM'
      }
    }

    showDatePicker(e){
      e.stopPropagation();
      if(this.state.showPickyDateTime == false){
        this.setState({showPickyDateTime: true})
      }
    }

    hideDatePicker(){
      this.setState({showPickyDateTime: false})
    }

    updateDate(data){
      this.setState(data);
    }

    render() {

      let date_picker = this.state.date + '/' + this.state.month + '/' + this.state.year
      let datepicker = '';
      if(this.state.showPickyDateTime){
        datepicker = <DateTimePicker showPickyDateTime={this.state.showPickyDateTime} hideDatePicker={this.hideDatePicker.bind(this)} updateDate={this.updateDate.bind(this)}/>
      }
        return (
          <div className="display-flex-center">
            <h1 className="mgtop50">Ajouter un trajet</h1>
            <div className="form-container">
              <form>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">Entreprise de livraison</label>
                  <select className="form-control" id="exampleFormControlSelect1">
                    <option id="3">SDY Transport</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="departure">Ville de départ</label>
                  <input type="text" className="form-control" id="departure" placeholder="Ex : Marseille" />
                </div>
                <div className="form-group">
                  <label htmlFor="arrival">Ville d'arrivée</label>
                  <input type="text" className="form-control" id="arrival" placeholder="Ex : Toulouse" />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label>Date de départ</label>
                  {/* <input type="text" onClick={this.showDatePicker.bind(this)} className="form-control" id="date_departure" value={date_picker}/>
                  {datepicker} */}
                  <input type="date" className="form-control"/>
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label>Heure de départ</label>
                  <input type="time" className="form-control"/>
                </div>
                <div className="form-group">
                  <label htmlFor="avalaible_places">Emplacements disponibles du camion</label>

                </div>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </form>
            </div>
          </div>
        );
      }
  
    }