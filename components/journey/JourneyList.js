import React, { Component } from 'react';
import axios from 'axios';
import {timeConverter, getDate, getHour} from './../functions';

export default class JourneyList extends Component {

    constructor(props){
      super(props);

      this.state = {
          journeys: []
      }

    }

    componentDidMount(){

        let data = {};

          axios({
            method: 'post',
            url: '/get-journey-list',
            responseType: 'json',
            data: data
          })
          .then((response) => {
            console.log(response);
            this.setState({journeys: response.data})
          })
          .catch( (error) => {
            console.log(error);
          });
    
        }

    render() {
        let journeys = this.state.journeys.map((journey, index) => {

          let date_departure = getDate(journey.date_departure)
          console.log(date_departure);
          
          let date_arrival_expected = getHour(journey.date_arrival_expected)
          console.log(date_arrival_expected);
            return <div className="row line-journey">
                    <div className="col-md-2" style={{borderRight: '1px solid grey'}}>
                      <div className="height50p row">
                        <div className="col-2 logo-green-point"></div>
                        <div className="col-10"><span className="fontwb">Ville de départ: </span><span className="fontwb colorblue">{journey.departure}</span></div>
                      </div>
                      <div className="height50p row">
                        <div className="col-2 logo-green-arrow"></div>
                        <div className="col-10"><span className="fontwb">Ville d'arrivée: </span><span className="fontwb colorblue">{journey.arrival}</span></div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="height50p row">
                        <div className="col-2 logo-date"></div>
                        <div className="col-10"><span className="fontwb">Date de départ: </span><span className="fontwb colorblue">{date_departure}</span></div>
                      </div>
                      <div className="height50p row">
                        <div className="col-2 logo-clock"></div>
                        <div className="col-10"><span className="fontwb">Heure de départ prévue: </span><span className="fontwb colorblue">{date_arrival_expected}</span></div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="display-flex-center height100">
                        <div className="row width100" style={{minHeight: '100px'}}>
                          <div className="col-7" style={{marginRight: '-16px', height: '130px'}}>
                            <div className="block-line-squares">
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                            </div>
                            <div className="block-line-squares">
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                            </div>
                            <div className="block-line-squares">
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                              <div className="little-square"></div>
                            </div>
                          </div>
                          <div className="col-3">
                            <img src="http://traffic-center.local/public/img/front-truck.png" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                   </div>
        })
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