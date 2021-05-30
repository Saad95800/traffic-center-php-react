import React, { Component } from 'react'
import axios from 'axios'
// import {getDate, getHour} from './../functions'
// import Journey from './Journey'
import moment from 'moment'
import { Link } from 'react-router-dom'
import $ from 'jQuery'

export default class JourneyList extends Component {

    constructor(props){
      super(props);

      this.state = {
          journeys: [],
          journeysList: [],
          keywordSearch: '',
          keywordSearchDeparture: '',
          keywordSearchArrival: '',
          keywordSearchDateDeparture: '',
          keywordSearchDateArrival: '',
          lastPage: false,
          offset: 0,
          nbPages: 1
      }

      this.journeys = []
      // this.state.offset = 0
      if(this.props.old == 'true'){
        this.props.setColorNavItem('old-journey-list')
      }else{
        this.props.setColorNavItem('journey-list')
      }
    }

    componentDidMount(){
      console.log(this.props.old)

      this.props.hideMenu()
      let formData = new FormData();
      formData.append('old', this.props.old);
      axios({
        method: 'POST',
        url: '/get-journey-list',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
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
            console.log(response.data)
            let nbJourneys = response.data.nbjourneys
            let nbPages = 1

            if(nbJourneys > 15){
              nbPages = Math.trunc(nbJourneys / 15)
              console.log(nbPages)
              if(nbJourneys % 15 > 0){
                nbPages++
              }
            }
            this.setState({journeys: response.data.journeys, journeysList: response.data.journeys, nbPages: nbPages})
            this.journeys = response.data
          }
        }else{
          this.viewMessageFlash('Erreur lors de la tentative de connexion', true);
        }

      })
      .catch( (error) => {
        console.log(error);
        return false
      });
 
    }

    // changePage(val){

    //   if(val == 'next'){
    //     this.state.offset++
    //   }else{
    //     if(this.state.offset > 0){
    //       this.state.offset--
    //     }
    //   }

    //   let formData = new FormData();
    //   formData.append('offset', this.state.offset);
    //   formData.append('old', this.props.old);

    //   axios({
    //     method: 'POST',
    //     url: '/get-journey-list',
    //     responseType: 'json',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     data: formData
    //   })
    //   .then((response) => {

    //     if(response.statusText == 'OK'){
    //       if(response.data.error == true){
    //         if(response.data.error_code == 1){
    //           // this.viewMessageFlash(response.data.msg, true);
    //           // document.location.href="/app";
    //         }else{
    //           // this.viewMessageFlash(response.data.msg, true);
    //         }
    //       }else{
    //         console.log(response.data)
    //         this.setState({journeys: response.data, journeysList: response.data})
    //         this.journeys = response.data
    //         console.log(response.data.length)
    //         if(response.data.length < 15){
    //           this.setState({lastPage: true})
    //         }else{
    //           this.setState({lastPage: false})
    //         }
    //       }
    //     }else{
    //       this.viewMessageFlash('Erreur lors de la tentative de connexion', true);
    //     }

    //   })
    //   .catch( (error) => {
    //     console.log(error);
    //     return false
    //   });

    // }

    filter(input = 'general', val = '', fromPaginationBtn = false) {

      if(val == 'next'){
        this.state.offset++
      }else if(val == 'previous'){
        if(this.state.offset > 0){
          this.state.offset--
        }
      }

        // let newJourneysList1 = []
        // let newJourneysList2 = []
        // let newJourneysList3 = []
        // let newJourneysList4 = []
        // let newJourneysList5 = []

        let keyword_gen = $("#search-bar").val().toLowerCase()
        let keyword_dep = $("#search-departure").val().toLowerCase()
        let keyword_arr = $("#search-arrival").val().toLowerCase()
        let keyword_date_dep = $("#search-date-departure").val()
        let keyword_date_arr = $("#search-date-arrival").val()
        let keyword = ''

        switch(input){
          case 'general':
            keyword = keyword_gen
            break;
          case 'departure':
            keyword = keyword_dep
            break;
          case 'arrival':
            keyword = keyword_arr
            break;
          case 'date_departure':
            keyword = keyword_date_dep
            break;
          case 'date_arrival':
            keyword = keyword_date_arr
            break;
        }

        let formData = new FormData();
        formData.append('offset', this.state.offset);
        formData.append('old', this.props.old);
        formData.append('keyword', keyword);
        formData.append('input', input);
        formData.append('from-pagination-btn', fromPaginationBtn);
        formData.append('inputs', [
          keyword_gen,
          keyword_dep,
          keyword_arr,
          keyword_date_dep,
          keyword_date_arr
        ]);
        

        axios({
          method: 'POST',
          url: '/get-journey-list-filter',
          responseType: 'json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData
        })
        .then((response) => {

          if(response.statusText == 'OK'){
            if(response.data.error == true){
            }else{
              console.log(response.data)
              let nbJourneys = response.data.nbjourneys
              let nbPages = 1
              
              if(nbJourneys > 15){
                nbPages = Math.trunc(nbJourneys / 15)
                console.log(nbPages)
                if(nbJourneys % 15 > 0){
                  nbPages++
                }
              }
              this.setState({journeys: response.data.journeys, journeysList: response.data.journeys, nbPages: nbPages})
              this.journeys = response.data.journeys
              console.log(response.data.length)
              if(response.data.journeys.length < 15){
                this.setState({lastPage: true})
              }else{
                this.setState({lastPage: false})
              }
            }
          }else{
            this.viewMessageFlash('Erreur lors de la tentative de connexion', true);
          }

        })
        .catch( (error) => {
          console.log(error);
          return false
        });

        // // Filtre général
        //     if(keyword_gen == ""){
        //       newJourneysList1 = this.state.journeys
        //     }else{
        //       for(let journey of this.state.journeys){
        //         if(journey.arrival.toLowerCase().indexOf(keyword_gen) != -1 ||
        //           journey.departure.toLowerCase().indexOf(keyword_gen) != -1 ||
        //           journey.name_company.toLowerCase().indexOf(keyword_gen) != -1){
        //           newJourneysList1.push(journey)
        //           continue
        //         }
        //         else{
        //           for(let stopover of journey.stopovers){
        //             if(stopover.city.toLowerCase().indexOf(keyword_gen) != -1){
        //               newJourneysList1.push(journey)
        //               break
        //             }                  
        //           }              
        //         }
        //       }              
        //     }

        //     // Filtre sur la ville de départ
        //     if(keyword_dep == ""){
        //       newJourneysList2 = newJourneysList1
        //     }else{
        //       for(let journey of newJourneysList1){
        //         if(journey.departure.toLowerCase().indexOf(keyword_dep) != -1){
        //           console.log('found')
        //           newJourneysList2.push(journey)
        //           continue
        //         }
        //       }
        //     }

        //     // Filtre sur la ville d'arrivée
        //     if(keyword_arr == ""){
        //       newJourneysList3 = newJourneysList2
        //     }else{
        //       for(let journey of newJourneysList2){
        //         console.log(keyword_arr)
        //         if(journey.arrival.toLowerCase().indexOf(keyword_arr) != -1){
        //           console.log('found')
        //           newJourneysList3.push(journey)
        //           continue
        //         }
        //       }
        //     }
            
        //     // Filtre sur la ville de départ
        //     if(keyword_date_dep == ""){
        //       newJourneysList4 = newJourneysList3
        //     }else{
        //       for(let journey of newJourneysList3){
        //         if( moment.unix(journey.date_departure).format("DD/MM/YYYY") == moment.unix(new Date(keyword_date_dep).getTime()/1000).format("DD/MM/YYYY")){
        //           newJourneysList4.push(journey)
        //           continue
        //         }
        //       }
        //     }

        //     // Filtre sur la ville d'arrivée
        //     if(keyword_date_arr == ""){
        //       newJourneysList5 = newJourneysList4
        //     }else{
        //       for(let journey of newJourneysList4){
        //         if( moment.unix(journey.date_arrival).format("DD/MM/YYYY") == moment.unix(new Date(keyword_date_arr).getTime()/1000).format("DD/MM/YYYY")){
        //           newJourneysList5.push(journey)
        //           continue
        //         }
        //       }
        //     }

        // this.setState({journeysList: newJourneysList5})

    }

    render() {

          let journeys = ''
          let displayBtnArrow = 'none'
          console.log(this.state.journeys)
          if(this.state.journeys.length != 0 && this.state.journeys != undefined){
            if(this.state.nbPages > 1){
              displayBtnArrow = 'flex'
            }

            journeys = this.state.journeysList.map((journey, index) => {
              
              let date_departure = moment.unix(journey.date_departure).format("DD/MM/YYYY");
              let date_arrival = moment.unix(journey.date_arrival).format("DD/MM/YYYY");
              let time_departure = moment.unix(journey.date_departure).format("hh:mm");
              let link = "/journey/edit/"+journey.id_journey

              let stopovers_str = ''
              let stopovers = null

              if(journey.stopovers.length > 0){
                
                journey.stopovers.map((stopover, index) => {
                  stopovers_str += stopover.city+', '
                })
                stopovers_str = stopovers_str.substring(0, stopovers_str.length - 2);
              
                stopovers = <div className="row">
                              <div className="col-3"></div>
                              <div className="col-9"><span className="fontwb">Escales: </span><span className="colorblue">{stopovers_str}</span></div>
                            </div>

              }

              let style = {}
              if(this.props.old == 'true'){
                style = {backgroundColor: 'rgb(216 228 229)'}
              }
              return <Link to={link} key={index}>
                    <div className="row line-journey" style={style}>
                      <div className="col-md-4">
                        <div className="height33p row">
                          <div className="col-1 logo-green-point"></div>
                          <div className="col-11"><span className="fontwb label-data-list">Départ: </span><span className="colorblue" style={{fontWeight: 'bolder'}}>{journey.departure}</span></div>
                        </div>
                        {/* {stopovers} */}
                        <div className="height33p row" style={{marginTop: '5px', marginBottom: '5px'}}>
                          <div className="col-1 logo-green-arrow"></div>
                          <div className="col-11"><span className="fontwb label-data-list">Destination: </span><span className="colorblue" style={{fontWeight: 'bolder'}}>{journey.arrival}</span></div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="height33p row">
                          <div className="col-1 logo-date"></div>
                          <div className="col-11"><span className="fontwb label-data-list">Date départ: </span><span className="colorblue" style={{fontWeight: 'bolder'}}>{date_departure}</span></div>
                        </div>
                        <div className="height33p row">
                          <div className="col-1 logo-clock"></div>
                          <div className="col-11"><span className="fontwb label-data-list">Heure départ: </span><span className="colorblue" style={{fontWeight: 'bolder'}}>{time_departure}</span></div>
                        </div>
                        <div className="height33p row">
                          <div className="col-1 logo-date"></div>
                          <div className="col-11"><span className="fontwb label-data-list">Date d'arrivée: </span><span className="colorblue" style={{fontWeight: 'bolder'}}>{date_arrival}</span></div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="height33p row">
                          <div className="col-1 logo-mini-truck"></div>
                          <div className="col-11"><span className="fontwb label-data-list">Société: </span><span className="colorblue"   style={{fontWeight: 'bolder'}}>{journey.name_company}</span></div>
                        </div>
                      </div>
                      {/* <Journey key={index} id_journey={journey.id_journey} spaces={journey.spaces} page="list-journey"/> */}
                    </div>
                    </Link>
            })

          }else{
            journeys = ''
          }

          let nextButton = ''
          if(this.state.lastPage == false){
            nextButton = <div><button className="btn-pagination"onClick={() => { this.filter('', 'next', true) }}>{'>'}</button></div>
          }

          let title = "Trajets en cours"
          if(this.props.old == 'true'){
            title = "Trajets archivées"
          }
        return (
          <div className="container-list-journey-page display-flex-center">
                <h1 className="mgtop50">{title}</h1>
                <div className="form-group has-search" style={{width: '96%'}}>
                  <span className="fa fa-search form-control-feedback"></span>
                  <input type="text" className="form-control form-control-sm" id="search-bar" style={{marginBottom: '10px'}} placeholder="Recherche" value={this.state.keywordSearch} /*onKeyPress={this.filter.bind(this)}*/ onChange={()=>{
                    this.setState({keywordSearch: $('#search-bar').val()})
                    this.filter('general')
                    }}/>
                    <div className="row">
                      <div className="col-sm-3">
                        <label htmlFor="search-departure">Ville de départ</label>
                        <input type="text" className="form-control form-control-sm" id="search-departure" value={this.state.keywordSearchDeparture} placeholder="Départ" onChange={()=>{
                    this.setState({keywordSearchDeparture: $('#search-departure').val()})
                    this.filter('departure')
                    }}/>
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="search-arrival">Ville d'arrivée</label>
                        <input type="text" className="form-control form-control-sm" id="search-arrival" value={this.state.keywordSearchArrival} placeholder="Arrivée" onChange={()=>{
                    this.setState({keywordSearchArrival: $('#search-arrival').val()})
                    this.filter('arrival')
                    }}/>
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="search-date-departure">Date de départ</label>
                        <input type="date" className="form-control form-control-sm" id="search-date-departure" value={this.state.keywordSearchDateDeparture} placeholder="Date départ" onChange={()=>{
                    this.setState({keywordSearchDateDeparture: $('#search-date-departure').val()})
                    this.filter('date_departure')
                    }}/>
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="search-date-arrival">Date d'arrivée</label>
                        <input type="date" className="form-control form-control-sm" id="search-date-arrival" value={this.state.keywordSearchDateArrival} placeholder="Date arrivée" onChange={()=>{
                    this.setState({keywordSearchDateArrival: $('#search-date-arrival').val()})
                    this.filter('date_arrival', '', false)
                    }}/>
                      </div>
                    </div>
                </div>
                <div className="display-flex-center" style={{flexDirection: 'row', display: displayBtnArrow}}>
                    <div><button className="btn-pagination" onClick={() => { this.filter('','previous', true) }}>{'<'}</button></div>
                    {nextButton}
                </div>
                <div>{this.state.offset+1}/{this.state.nbPages}</div>
                <div className="container-list-journey" style={{fontSize: '0.7rem'}}>
                  {journeys}
                </div>
          </div>
        );
      }
  
    }