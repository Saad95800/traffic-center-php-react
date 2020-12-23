import React, { Component } from 'react';
import axios from 'axios';
import {getDate, getHour} from './../functions';
import Journey from './Journey';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default class JourneyList extends Component {

    constructor(props){
      super(props);

      this.state = {
          journeys: []
      }

    }

    componentDidMount(){

        this.props.hideMenu()

        let data = {};

          axios({
            method: 'POST',
            url: '/get-journey-list',
            responseType: 'json',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
          })
          .then((response) => {

            if(response.statusText == 'OK'){
              if(response.data.error == true){
                if(response.data.error_code == 1){
                  // this.viewMessageFlash(response.data.msg, true);
                  // document.location.href="/app";
                }else{
                  // this.viewMessageFlash(response.data.msg, true);
                }

              }else{
                this.setState({journeys: response.data})
              }
            }else{
              this.viewMessageFlash('Erreur lors de la tentative de connexion', true);
            }


          })
          .catch( (error) => {
            console.log(error);
          });
    
        }

    render() {

          let journeys = '';
          console.log(this.state.journeys.length)
          if(this.state.journeys.length != 0 && this.state.journeys.length != undefined){

            journeys = this.state.journeys.map((journey, index) => {
              
              let date_departure = moment.unix(journey.date_departure).format("DD/MM/YYYY");
              let time_departure = moment.unix(journey.date_departure).format("hh:mm");
              let link = "/journey/edit/"+journey.id_journey
              return <Link to={link}>
                    <div className="row line-journey">
                      <div className="col-md-4" style={{margin: '10px 0px 10px 0px'}}>
                        <div className="height50p row">
                          <div className="col-2 logo-green-point"></div>
                          <div className="col-10"><span className="fontwb">Ville de départ: </span><span className="fontwb colorblue">{journey.departure}</span></div>
                        </div>
                        <div className="height50p row">
                          <div className="col-2 logo-green-arrow"></div>
                          <div className="col-10"><span className="fontwb">Ville d'arrivée: </span><span className="fontwb colorblue">{journey.arrival}</span></div>
                        </div>
                      </div>
                      <div className="col-md-4" style={{margin: '10px 0px 10px 0px'}}>
                        <div className="height50p row">
                          <div className="col-2 logo-date"></div>
                          <div className="col-10"><span className="fontwb">Date de départ: </span><span className="fontwb colorblue">{date_departure}</span></div>
                        </div>
                        <div className="height50p row">
                          <div className="col-2 logo-clock"></div>
                          <div className="col-10"><span className="fontwb">Heure de départ: </span><span className="fontwb colorblue">{time_departure}</span></div>
                        </div>
                      </div>
                      <div className="col-md-4" style={{margin: '10px 0px 10px 0px'}}>
                        <div className="height50p row">
                          <div className="col-2 logo-date"></div>
                          <div className="col-10"><span className="fontwb">Date d'arrivée: </span><span className="fontwb colorblue">---</span></div>
                        </div>
                        <div className="height50p row">
                          <div className="col-2 logo-mini-truck"></div>
                          <div className="col-10"><span className="fontwb">Transporteur: </span><span className="fontwb colorblue">{journey.name_company}</span></div>
                        </div>
                      </div>
                      {/* <Journey key={index} id_journey={journey.id_journey} spaces={journey.spaces} page="list-journey"/> */}
                    </div>
                    </Link>
            })

          }else{
            journeys = ''
          }
        return (
          <div className="container-list-journey-page display-flex-center">
                <h1 className="mgtop50">Liste des trajets</h1>
                <div className="container-list-journey">
                  {journeys}
                </div>
          </div>
        );
      }
  
    }