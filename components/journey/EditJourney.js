import React, { Component } from 'react'
import Journey from './Journey'
import { Redirect } from "react-router-dom"
import axios from 'axios'
import $ from 'jQuery'
// import { Preview, print } from 'react-html2pdf';

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
        truck_registration: '',
        tractor_registration: '',
        spaces: [],
        nbStopOver: 0,
        collision: false
      }
      this.id_journey = document.location.href.split('/')[5]
    }

    componentDidMount(){

        let self = this
        $(document).on('click', '.btn-delete-stop-over', function(){
          $(this).parent().remove()
          self.setState({nbStopOver: self.state.nbStopOver - 1})
          $(".btn-delete-stop-over").each(function(){
            $(this).css('display', 'none')
          })
          $("#block-stop-over-"+(self.state.nbStopOver - 1)).find(".btn-delete-stop-over").css("display", "inline-block")
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

        if(this.state.collision){
          this.props.viewMessageFlash('Il y a une ou plusieurs collisions entre vos palettes !', true)
          return;
        }

        let formData = new FormData();
        formData.append('delivery_company', this.state.delivery_company);
        formData.append('departure', this.state.departure);
        formData.append('arrival', this.state.arrival);
        formData.append('date_departure', this.state.date_departure);
        formData.append('date_arrival', this.state.date_arrival);
        formData.append('time_departure', this.state.time_departure);
        formData.append('truck_registration', this.state.truck_registration);
        formData.append('tractor_registration', this.state.tractor_registration);
        let spaces = []
        $(".box-space").each(function(){
          spaces.push({
            pallet_number: $(this).data('pallet_number'),
            customer_name: $(this).data('customer_name'),
            goods_nature: $(this).data('goods_nature'),
            address: $(this).data('address'),
            delivery_city: $(this).data('delivery_city'),
            delivery_country: $(this).data('delivery_country'),
            loading_address: $(this).data('loading_address'),
            loading_city: $(this).data('loading_city'),
            loading_country: $(this).data('loading_country'),
            date_delivery: $(this).attr('data-date_delivery') == 'Invalid date' ? '' : $(this).attr('data-date_delivery'),
            hour_delivery: $(this).attr('data-hour_delivery'),
            _top: $(this).data('top'),
            _left: $(this).data('left'),
            size: $(this).data('size'),
            position: $(this).data('position')
          })
        })
        formData.append('spaces', JSON.stringify(spaces));
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

    // updateSpaces(newSpaces){
    //   this.setState({spaces: newSpaces})
    // }

    displayJourneyData(data){

      this.setState({
        departure: data.departure,
        arrival: data.arrival,
        date_departure: data.date_departure,
        date_arrival: data.date_arrival,
        truck_registration: data.truck_registration,
        tractor_registration: data.tractor_registration,
        time_departure: data.time_departure,
        spaces: data.spaces,
      })
    }

    addStopover(e){
      e.preventDefault()
      $(".btn-delete-stop-over").each(function(){
        $(this).css('display', 'none')
      })
      $("#container-stop-over").append('<div class="block-stop-over" id="block-stop-over-'+this.state.nbStopOver+'"><label for="stop-over-'+this.state.nbStopOver+'">Escale '+(this.state.nbStopOver+1)+'</label><button type="button" class="close btn-delete-stop-over" aria-label="Close" style="display: inline-block;position:inherit;right:0px;"><span aria-hidden="true">×</span></button><input type="text" class="form-control form-control-sm stop-over-input" id="stop-over-'+this.state.nbStopOver+'" placeholder="Ex : Marseille" /></div>')
      this.setState({nbStopOver: this.state.nbStopOver +1})
    }

    setCollision(collision){
      this.setState({collision: collision})
    }

    render() {

      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }
        return (
          <div className="display-flex-center" style={{marginBottom: '100px'}}>
            <h1 className="mgtop50">Modifier un trajet</h1>
            <div className="form-container" id="form-container" style={{minWidth: '70%'}}>
              <form method="POST" encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="select-delivery-company">Entreprise de livraison</label>
                  <select className="form-control form-control-sm" id="select-delivery-company" onChange={() => {this.setState({delivery_company: document.querySelector('#select-delivery-company').value})}} >
                    <option id="1">SDY Transport</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="departure">Ville de départ</label>
                  <input type="text" className="form-control form-control-sm" id="departure" value={this.state.departure} onChange={() => {this.setState({departure: document.querySelector('#departure').value})}} placeholder="Ex : Marseille" />
                  <a href="" onClick={(e) => {this.addStopover(e)}} style={{display: 'inline-block', marginLeft: '10px'}}>Ajouter une escale</a>
                </div>
                <div className="form-group" id="container-stop-over" style={{paddingLeft: '30px'}}></div>
                <div className="form-group">
                  <label htmlFor="arrival">Ville d'arrivée</label>
                  <input type="text" className="form-control form-control-sm" id="arrival" value={this.state.arrival} onChange={() => {this.setState({arrival: document.querySelector('#arrival').value})}} placeholder="Ex : Toulouse" />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="date-departure">Date de départ</label>
                  <input type="date" className="form-control form-control-sm" id="date-departure" value={this.state.date_departure}  onChange={() => {this.setState({date_departure: document.querySelector('#date-departure').value})}} />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="hour-departure">Heure de départ</label>
                  <input type="time" className="form-control form-control-sm" id="time-departure" value={this.state.time_departure} onChange={() => {this.setState({time_departure: document.querySelector('#time-departure').value})}} />
                </div>
                <div className="form-group" id="container-picky-date-time">
                  <label htmlFor="hour-departure">Date d'arrivée</label>
                  <input type="date" className="form-control form-control-sm" id="date-arrival" value={this.state.date_arrival} onChange={() => {this.setState({date_arrival: document.querySelector('#date-arrival').value})}} />
                </div>
                <div className="form-group">
                  <label htmlFor="truck_registration">Immatriculation du camion</label>
                  <input type="text" className="form-control form-control-sm" id="truck_registration" value={this.state.truck_registration} onChange={() => {this.setState({truck_registration: document.querySelector('#truck_registration').value})}} />
                </div>
                <div className="form-group">
                  <label htmlFor="tractor_registration">Immatriculation du tracteur</label>
                  <input type="text" className="form-control form-control-sm" id="tractor_registration" value={this.state.tractor_registration} onChange={() => {this.setState({tractor_registration: document.querySelector('#tractor_registration').value})}} />
                </div>
                <div className="form-group">
                  <label htmlFor="avalaible_places">Emplacements disponibles du camion</label>
                  <Journey setCollision={this.setCollision.bind(this)} stateParent={this.state} spaces={this.state.spaces} page="edit-journey" displayJourneyData={this.displayJourneyData.bind(this)}/*updateSpaces={this.updateSpaces.bind(this)}*/ spaces={this.state.spaces} viewMessageFlash={this.props.viewMessageFlash}/>
                </div>
                <div className="display-flex-center">
                  <button type="submit" onClick={this.updateJourney.bind(this)} className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Enregistrer</button>
                </div>
              </form>
            </div>

            {/* <Preview id={'jsx-template'} >
                  <p>adsf</p>
              </Preview>
              <button onClick={(e)=>{e.preventDefault();print('a', 'jsx-template')}}> print</button> */}

          </div>
        );
      }
  
    }