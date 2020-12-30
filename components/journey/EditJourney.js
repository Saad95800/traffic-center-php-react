import React, { Component } from 'react'
import Journey from './Journey'
import { Redirect } from "react-router-dom"
import axios from 'axios'
import moment from 'moment'
import $ from 'jQuery'

export default class EditJourney extends Component {

    constructor(props){
      super(props);
      this.state = {
        redirect: false,
        delivery_company: localStorage.getItem('id_company'),
        departure: '',
        arrival: '',
        date_departure: '',
        date_arrival: '',
        time_departure: '',
        date_arrival: '',
        spaces: [],
        nbStopOver: 0
      }
      this.id_journey = null
    }

    componentDidMount(){

      let data = {};
      let id_journey = document.location.href.split('/')[5]
      this.id_journey = id_journey
        axios({
          method: 'POST',
          url: '/get-journey/'+id_journey,
          responseType: 'json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: data
        })
        .then((response) => {
          console.log(response)
          if(response.statusText == 'OK'){
            if(response.data.error == true){
              this.viewMessageFlash('Erreur lors de la récupération des données', true);
            }else{
              this.setState({
                journey: response.data,
                departure: response.data.departure.charAt(0).toUpperCase() + response.data.departure.slice(1),
                arrival: response.data.arrival.charAt(0).toUpperCase() + response.data.arrival.slice(1),
                date_departure: moment.unix(parseInt(response.data.date_departure)).format("YYYY-MM-DD"),
                time_departure: moment.unix(parseInt(response.data.date_departure)).format("HH:mm"),
                date_arrival: moment.unix(parseInt(response.data.date_arrival)).format("YYYY-MM-DD"),
                spaces: response.data.spaces,
                stopovers: response.data.stopovers
              })

              let self = this
              response.data.stopovers.map((stopover, index) => {
                $("#container-stop-over").append('<div class="block-stop-over" id="block-stop-over-'+stopover.nb_stopover+'"><label for="stop-over-'+stopover.nb_stopover+'">Escale '+(parseInt(stopover.nb_stopover)+1)+'</label><button type="button" class="close btn-delete-stop-over" aria-label="Close" style="display: inline-block;position:inherit;right:0px;"><span aria-hidden="true">×</span></button><input type="text" value="'+stopover.city+'" class="form-control stop-over-input" id="stop-over-'+stopover.nb_stopover+'" placeholder="Ex : Marseille" /></div>')
                self.setState({nbStopOver: this.state.nbStopOver +1})
              })

              $(".btn-delete-stop-over").each(function(){
                console.log($(this).parent().attr('id'))
                console.log("block-stop-over-"+(self.state.nbStopOver-1) )
                if($(this).parent().attr('id') != "block-stop-over-"+(self.state.nbStopOver-1) ){
                  $(this).css('display', 'none')
                }
              })
              
            }
          }else{
            this.viewMessageFlash('Erreur lors de la récupération des données', true);
          }

        })
        .catch( (error) => {
          console.log(error);
        });

        let self = this
        $(document).on('click', '.btn-delete-stop-over', function(){
          // self.setState({nbStopOver: $(".block-stop-over").length})
          $(this).parent().remove()
          self.setState({nbStopOver: self.state.nbStopOver - 1})
          $("#block-stop-over-"+(self.state.nbStopOver - 1)).find(".btn-delete-stop-over").css("display", "inline-block")
          self.state.nbStopOver - 1
          console.log('stop over removed')
        })
    }

    updateJourney(e){
        e.preventDefault();

        if( this.state.delivery_company == '' ||
          this.state.departure == '' ||
          this.state.arrival == '' ||
          this.state.date_departure == '' ||
          this.state.date_arrival == '' ||
          this.state.time_departure == ''
        ){
          this.props.viewMessageFlash('Tout les champs doivent être remplis', true);
          return;
        }

        let formData = new FormData();
        formData.append('delivery_company', this.state.delivery_company);
        formData.append('departure', this.state.departure);
        formData.append('arrival', this.state.arrival);
        formData.append('date_departure', this.state.date_departure);
        formData.append('date_arrival', this.state.date_arrival);
        formData.append('time_departure', this.state.time_departure);
        formData.append('spaces', JSON.stringify(this.state.spaces));
        formData.append('id_journey', this.id_journey);
        if($(".stop-over-input").length > 0){
          let i = 0
          $(".stop-over-input").each(function(){
            formData.append('stop-over-'+i, $(this).val());
            i++
          })
        }
        axios({
          method: 'POST',
          url: '/update-journey-ajax',
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
          this.props.viewMessageFlash('Erreur lors de l\'enregistrement', true);
        });
  
    }

    updateSpaces(newSpaces){
      this.setState({spaces: newSpaces})
    }

    addStopover(e){
      console.log("add stop over")
      e.preventDefault()
      $(".btn-delete-stop-over").each(function(){
        $(this).css('display', 'none')
      })
      $("#container-stop-over").append('<div class="block-stop-over" id="block-stop-over-'+this.state.nbStopOver+'"><label for="stop-over-'+this.state.nbStopOver+'">Escale '+(this.state.nbStopOver+1)+'</label><button type="button" class="close btn-delete-stop-over" aria-label="Close" style="display: inline-block;position:inherit;right:0px;"><span aria-hidden="true">×</span></button><input type="text" class="form-control stop-over-input" id="stop-over-'+this.state.nbStopOver+'" placeholder="Ex : Marseille" /></div>')
      this.setState({nbStopOver: this.state.nbStopOver +1})
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
                  <input type="text" className="form-control" id="departure" value={this.state.departure} onChange={() => {this.setState({departure: document.querySelector('#departure').value})}} placeholder="Ex : Marseille" />
                  <a href="" onClick={(e) => {this.addStopover(e)}} style={{display: 'inline-block', marginLeft: '10px'}}>Ajouter une escale</a>
                </div>
                <div className="form-group" id="container-stop-over" style={{paddingLeft: '30px'}}></div>
                <div className="form-group">
                  <label htmlFor="arrival">Ville d'arrivée</label>
                  <input type="text" className="form-control" id="arrival" value={this.state.arrival} onChange={() => {this.setState({arrival: document.querySelector('#arrival').value})}} placeholder="Ex : Toulouse" />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="date-departure">Date de départ</label>
                  <input type="date" className="form-control" id="date-departure" value={this.state.date_departure}  onChange={() => {this.setState({date_departure: document.querySelector('#date-departure').value})}} />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="hour-departure">Heure de départ</label>
                  <input type="time" className="form-control" id="time-departure" value={this.state.time_departure} onChange={() => {this.setState({time_departure: document.querySelector('#time-departure').value})}} />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="hour-departure">Date d'arrivée</label>
                  <input type="date" className="form-control" id="date-arrival" value={this.state.date_arrival} onChange={() => {this.setState({date_arrival: document.querySelector('#date-arrival').value})}} />
                </div>
                <div className="form-group">
                  <label htmlFor="avalaible_places">Emplacements disponibles du camion</label>
                  <Journey spaces={this.state.spaces} page="edit-journey" updateSpaces={this.updateSpaces.bind(this)} spaces={this.state.spaces}/>
                </div>
                <div className="display-flex-center">
                  <button type="submit" onClick={this.updateJourney.bind(this)} className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        );
      }
  
    }