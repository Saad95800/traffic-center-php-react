import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'
import Draggabilly from 'draggabilly'
import moment from 'moment'

export default class Journey extends Component {

    constructor(props){
      super(props);
      this.state = {
          spaces: this.props.spaces,
          dropSpaceZone: null,
          viewSpaceForm: false,
          id_space: '',
          pallet_number: '',
          customer_name: '',
          goods_nature: '',
          delivery_address: '',
          date_delivery: '',
          hour_delivery: '',
          id_space_block_html: '',
          id_pallet_edit: '',
          collision: false
      }
      this.id_space = 1

    }

    componentDidMount(){

      if(this.props.page == "edit-journey"){

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
                this.displayJourneyData({
                  journey: response.data,
                  departure: response.data.departure.charAt(0).toUpperCase() + response.data.departure.slice(1),
                  arrival: response.data.arrival.charAt(0).toUpperCase() + response.data.arrival.slice(1),
                  date_departure: moment.unix(parseInt(response.data.date_departure)).format("YYYY-MM-DD"),
                  time_departure: moment.unix(parseInt(response.data.date_departure)).format("HH:mm"),
                  date_arrival: moment.unix(parseInt(response.data.date_arrival)).format("YYYY-MM-DD"),
                  spaces: response.data.spaces,
                  stopovers: response.data.stopovers
                })

                ///////////////////////////////////////////

                  // block-spaces
                  
                  console.log(this.state.spaces)
                  for(let space of response.data.spaces){
                    console.log("space")
                    let position = ''
                    let size_css = ''
                    switch(space.size){
                      case '80-120':
                        position = 'width:45px;height:70px;'
                        if(space.position == 'horizontal'){
                          position = 'width:70px;height:45px;'
                        }
                        size_css = position+'background-color:rgb(100, 117, 161);'
                        break;
                      case '100-120':
                        position = 'width:60px;height:70px;'
                        if(space.position == 'horizontal'){
                          position = 'width:70px;height:60px;'
                        }
                        size_css = position+'background-color:rgb(100 156 161);'          
                        break;
                      default:
                        break;
                    }
                    
                    let date_delivery = moment.unix(parseInt(space.date_delivery)).format("YYYY-MM-DD")
                    let elem = ''
                    elem = $('<div draggable="true" class="draggable-space box-space" id="space-'+this.id_space+'" data-id_space="'+space.id_space+'" data-pallet_number="'+space.pallet_number+'" data-customer_name="'+space.customer_name+'" data-goods_nature="'+space.goods_nature+'" data-size="'+space.size+'" data-position="'+space.position+'" data-address="'+space.address+'" data-date_delivery="'+date_delivery+'" data-hour_delivery="'+space.hour_delivery+'" data-top="'+space._top+'" data-left="'+space._left+'" style="'+size_css+'top:'+space._top+'px;left:'+space._left+'px"><div style="width:100%;height:100%;display:flex;flex-direction: column;justify-content: space-between;"><div style="width:100%;height:20px;"><div class="img-space-info"></div></div><div class="space-number">'+space.pallet_number+'</div><div class="width100" style="height:20px;"><div class="img-space-rotate"></div><div class="img-space-trash"></div></div></div></div>')
                    console.log('appended')
                    $('#block-spaces').append(elem[0])
    
                    var draggie = new Draggabilly( elem[0], {
                      containment: true,
                      grid: [ 5, 5 ]
                    });
    
                    $(elem).find(".img-space-info").click( (e)=>{
                      let element = $(e.target).parent().parent().parent()
                      this.setState({
                        viewSpaceForm: true,
                        id_pallet_edit: element.attr('id'),
                        pallet_number: element.attr('data-pallet_number'),
                        customer_name: element.attr('data-customer_name'),
                        goods_nature: element.attr('data-goods_nature'),
                        delivery_address: element.attr('data-address'),
                        date_delivery: element.attr('data-date_delivery'),
                        hour_delivery: element.attr('data-hour_delivery')
                      });
                    })
                  
                    $(elem).find(".img-space-trash").click( function(){
                      $(this).parent().parent().parent().remove()
                    })
    
                    $(elem).find(".img-space-rotate").click( function(){
                      console.log('rotate')
                      let width = $(this).parent().parent().parent().css("width")
                      let height = $(this).parent().parent().parent().css("height")
                      console.log(width)
                      console.log(height)
                      $(this).parent().parent().parent().css("width", height) 
                      $(this).parent().parent().parent().css("height", width)
                      let pos = $(this).parent().parent().parent().attr("data-position")
                      if(pos == 'vertical'){
                        $(this).parent().parent().parent().attr("data-position", 'horizontal')
                      }else{
                        $(this).parent().parent().parent().attr("data-position", 'vertical')
                      }
                    })
    
                    // elem = ''
                    this.id_space = this.id_space + 1
                }

                ///////////////////////////////////////////
                let self = this
                response.data.stopovers.map((stopover, index) => {
                  $("#container-stop-over").append('<div class="block-stop-over" id="block-stop-over-'+stopover.nb_stopover+'"><label for="stop-over-'+stopover.nb_stopover+'">Escale '+(parseInt(stopover.nb_stopover)+1)+'</label><button type="button" class="close btn-delete-stop-over" aria-label="Close" style="display: inline-block;position:inherit;right:0px;"><span aria-hidden="true">×</span></button><input type="text" value="'+stopover.city+'" class="form-control form-control-sm stop-over-input" id="stop-over-'+stopover.nb_stopover+'" placeholder="Ex : Marseille" /></div>')
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

      }

      let self = this
      document.addEventListener('click', function(){
        let collision = false;
        $(".box-space").each(function(){
          if(self.setEventCollision($(this))){
            collision = true
          }
        })
        self.setState({collision: collision})
        self.setCollision(collision)
      })
    }

    setCollision(collision){
      this.props.setCollision(collision)
    }

    displayJourneyData(data){
      this.props.displayJourneyData(data)
    }

    fillTruckBox(){
      console.log("filled")
    }

    createBox(b){
      console.log('createBox')
      let size_css = 'width:80px;height:50px;'
      let size = ''
      let position = ''
      switch(b){
        case 'b1':
          size_css = 'width:70px;height:45px;background-color:rgb(100, 117, 161);'
          size = '80-120'
          position = 'horizontal'
          break;
        case 'b2':
          size_css = 'width:70px;height:60px;background-color:rgb(100 156 161);'          
          size = '100-120'
          position = 'horizontal'
          break;
        case 'b3':
          size_css = 'width:45px;height:70px;background-color:rgb(100, 117, 161);'          
          size = '80-120'
          position = 'vertical'
          break;
        case 'b4':
          size_css = 'width:60px;height:70px;background-color:rgb(100 156 161);'          
          size = '100-120'
          position = 'vertical'
          break;
        default:
          break;
      }

      let elem = $('<div draggable="true" class="draggable-space box-space" id="space-'+this.id_space+'" data-pallet_number="'+this.id_space+'" data-customer_name="" data-goods_nature="" data-size="'+size+'" data-position="'+position+'" data-address="" data-date_delivery="" data-hour_delivery="" style="'+size_css+'"><div style="width:100%;height:100%;display:flex;flex-direction: column;justify-content: space-between;"><div style="width:100%;height:20px;"><div class="img-space-info"></div></div><div class="space-number">'+this.id_space+'</div><div class="width100" style="height:20px;"><div class="img-space-rotate"></div><div class="img-space-trash"></div></div></div></div>')
      
      $('#block-spaces').append(elem[0])

      var draggie = new Draggabilly( elem[0], {
        containment: true,
        grid: [ 5, 5 ]
      });

      $(elem).find(".img-space-info").click( (e)=>{
        let element = $(e.target).parent().parent().parent()
        this.setState({
          viewSpaceForm: true,
          id_pallet_edit: element.attr('id'),
          pallet_number: element.attr('data-pallet_number'),
          customer_name: element.attr('data-customer_name'),
          goods_nature: element.attr('data-goods_nature'),
          delivery_address: element.attr('data-address'),
          date_delivery: element.attr('data-date_delivery'),
          hour_delivery: element.attr('data-hour_delivery')
        });
      })
      
      $(elem).find(".img-space-trash").click( function(){
        $(this).parent().parent().parent().remove()
      })

      $(elem).find(".img-space-rotate").click( function(){
        console.log('rotate')
        let width = $(this).parent().parent().parent().css("width")
        let height = $(this).parent().parent().parent().css("height")
        console.log(width)
        console.log(height)
        $(this).parent().parent().parent().css("width", height) 
        $(this).parent().parent().parent().css("height", width)
        let pos = $(this).parent().parent().parent().attr("data-position")
        if(pos == 'vertical'){
          $(this).parent().parent().parent().attr("data-position", 'horizontal')
        }else{
          $(this).parent().parent().parent().attr("data-position", 'vertical')
        }
      })

      this.id_space = this.id_space + 1

    }

    setEventCollision(elem){
      console.log(elem)
      
      let $this = elem
      if(elem !== ''){
        $this = elem
      }
      $($this).attr("data-top", $($this).css("top").replace("px", ""))
      $($this).attr("data-left", $($this).css("left").replace("px", ""))

      let collision = false

      if( $(".box-space").length > 1 ){

          $(".box-space").each(function(){

          if($(this).attr('id') != $this.attr("id")){
            let boxMoveLeft = parseInt($($this).css('left').replace("px", ""))
            let boxMoveTop = parseInt($($this).css('top').replace("px", ""))
            let boxMoveWidth = parseInt($($this).css('width').replace("px", ""))
            let boxMoveHeight = parseInt($($this).css('height').replace("px", ""))
            let boxFixLeft = parseInt($(this).css('left').replace("px", ""))
            let boxFixTop = parseInt($(this).css('top').replace("px", ""))
            let boxFixWidth = parseInt($(this).css('width').replace("px", ""))
            let boxFixHeight = parseInt($(this).css('height').replace("px", ""))

            if( $($this).css('left').replace("px", "") != 'auto'){
              if (boxMoveLeft < boxFixLeft + boxFixWidth  && boxMoveLeft + boxMoveWidth  > boxFixLeft &&
                  boxMoveTop < boxFixTop + boxFixHeight && boxMoveTop + boxMoveHeight > boxFixTop){
                    // $('#'+$this.attr('id')).css("background-color", 'red')
                    // $('#'+$(this).attr('id')).css("background-color", 'red')
                  collision = true
              }else{
                // $('#'+$this.attr('id')).css("background-color", 'green')
                // $('#'+$(this).attr('id')).css("background-color", 'green')
              }
            }              
          }

        })

        if(collision){
          $('#'+$this.attr('id')).css("background-color", 'red')
        }else{
          if($('#'+$this.attr('id')).attr("data-size") == '80-120'){
            $('#'+$this.attr('id')).css("background-color", 'rgb(100, 117, 161)')
          }else{
            $('#'+$this.attr('id')).css("background-color", 'rgb(100 156 161)')
          }
        }
        // collision = false
      }
      
      return collision
    }

    hideSpaceForm(e){
      e.preventDefault()
      this.setState({viewSpaceForm: false})
    }

    updateSpaceData(e){
      e.preventDefault()

      let space = $("#"+this.state.id_pallet_edit)
      space.attr('data-pallet_number', this.state.pallet_number)
      space.attr('data-customer_name', this.state.customer_name)
      space.attr('data-goods_nature', this.state.goods_nature)
      space.attr('data-date_delivery', this.state.date_delivery)
      space.attr('data-hour_delivery', this.state.hour_delivery)
      space.attr('data-address', this.state.delivery_address)
      this.setState({viewSpaceForm: false})

      space.find(".space-number").text(this.state.pallet_number)
    }

    render() {

      let spaces = ''
      if(this.props.page == "edit-journey" && this.iteration == 0 && this.props.spaces.length > 0){

      }

      let spaceForm = ''
      if(this.state.viewSpaceForm){
        spaceForm = <div className="container-space-form" onClick={(e) => {this.hideSpaceForm(e)} }>
                      <form method="POST" className="space-form" id="space-form" onClick={(e)=>{e.stopPropagation()}}>
                        <div className="">
                          <input type="hidden" className="form-control form-control-sm" id="id_space" value={this.state.id_space} name="id_space" />
                        </div>
                        <div className="">
                          <label htmlFor="pallet_number">Numéro de palette</label>
                          <input type="text" className="form-control form-control-sm" id="pallet_number" value={this.state.pallet_number} onChange={() => { this.setState({pallet_number: $("#pallet_number").val()}) }} />
                        </div>
                        <div className="">
                          <label htmlFor="customer_name">Nom du client</label>
                          <input type="text" className="form-control form-control-sm" id="customer_name" value={this.state.customer_name} onChange={() => { this.setState({customer_name: $("#customer_name").val()}) }} />
                        </div>
                        <div className="">
                          <label htmlFor="goods_nature">Nature de la marchandise</label>
                          <input type="text" className="form-control form-control-sm" id="goods_nature" value={this.state.goods_nature} onChange={() => { this.setState({goods_nature: $("#goods_nature").val()}) }} />
                        </div>
                        <div className="">
                          <label htmlFor="delivery_address">Date de livraison</label>
                          <input type="date" className="form-control form-control-sm" id="date_delivery"  value={this.state.date_delivery} onChange={() => { this.setState({date_delivery: $("#date_delivery").val()}) }} />
                        </div>
                        <div className="">
                          <label htmlFor="delivery_address">Heure de chargement</label>
                          <input type="time" className="form-control form-control-sm" id="hour_delivery" value={this.state.hour_delivery} onChange={() => { this.setState({hour_delivery: $("#hour_delivery").val()}); console.log($("#hour_delivery").val()); }} />
                        </div>
                        <div className="">
                          <label htmlFor="delivery_address">Adresse de livraison</label>
                          <input type="text" className="form-control form-control-sm" id="delivery_address" value={this.state.delivery_address} onChange={() => { this.setState({delivery_address: $("#delivery_address").val()}) }} />
                        </div>
                        <div className="display-flex-center">
                          <button type="submit" onClick={(e)=>{this.updateSpaceData(e)} } className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Enregistrer</button>
                        </div>
                      </form>
                    </div>
      }

        return (
            <div className="col-12">
              <div className="row" style={{border: "3px solid black", minHeight: "130px"}}>
                <div className="col-6" style={{border: "3px solid black"}}>
                  <div className="text-center">Palettes 80/120</div>
                  <div className="row" style={{height: "100%"}}>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div 
                          className="space-draggable space-draggable-horizontal-80-120" 
                          id="space-draggable-horizontal-80-120" 
                          data-id_space=""
                          data-size="80-120" 
                          data-position="horizontal"
                          data-number=""
                          data-customer_name=""
                          data-goods_nature=""
                          data-address=""
                          data-city=""
                          data-zip_code=""
                          data-country=""
                          draggable="true"
                          onClick={()=>{this.createBox('b1')}}>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div 
                          className="space-draggable space-draggable-vertical-80-120" 
                          id="space-draggable-vertical-80-120" 
                         data-id_space=""
                          data-size="80-120" 
                          data-position="vertical"
                          data-number=""
                          data-customer_name=""
                          data-goods_nature=""
                          data-address=""
                          data-city=""
                          data-zip_code="" 
                          data-country=""
                          draggable="true"
                          onClick={()=>{this.createBox('b3')}}>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6" style={{border: "3px solid black", padding: "10px"}}>
                  <div className="text-center">Palettes 100/120</div>
                  <div className="row" style={{height: "100%"}}>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div 
                          className="space-draggable space-draggable-horizontal-100-120" 
                          id="space-draggable-horizontal-100-120" 
                          data-id_space=""
                          data-size="100-120" 
                          data-position="horizontal"
                          data-number=""
                          data-customer_name=""
                          data-goods_nature=""
                          data-address=""
                          data-city=""
                          data-zip_code=""
                          data-country=""
                          draggable="true"
                          onClick={()=>{this.createBox('b2')}}>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="display-flex-center" style={{width: '100%', height: '100%'}}>
                        <div 
                          className="space-draggable space-draggable-vertical-100-120" 
                          id="space-draggable-vertical-100-120" 
                          data-id_space=""
                          data-size="100-120" 
                          data-position="vertical"
                          data-number=""
                          data-customer_name=""
                          data-goods_nature=""
                          data-address=""
                          data-city=""
                          data-zip_code=""
                          data-country=""
                          draggable="true"
                          onClick={()=>{this.createBox('b4')}}>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="display-flex-center height100">
                <div className="width100 display-flex-center" style={{minHeight: '100px', flexDirection: 'row'}}>
                  <div className="d-none d-sm-block" style={{margin: '50px 10px 50px 50px'}}>
                    <img src="http://traffic-center.local/public/img/front-truck.png" style={{transform: "rotate(180deg)"}}/>
                  </div>
                  <div className="block-spaces" id="block-spaces">{spaces}</div>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn btn-light form-control-sm display-flex-center" 
                id="btn-view-spaces-list"
                style={{margin: '20px 0px'}}
                onClick={(e)=> {this.toggleSpaceList(e)}}>Voir la liste des palettes</button>
              <div className="table-responsive" id="spaces-lines-table" style={{display: 'none'}}>
                <table className="table">
                  <thead>
                    <tr>
                      <th  scope="col">N° de palette</th>
                      <th  scope="col">Client</th>
                      <th  scope="col">Nature marchandise</th>
                      <th  scope="col">Date livraison</th>
                      <th  scope="col">Heure chargement</th>
                      <th  scope="col">Adresse livraison</th>
                    </tr>
                  </thead>
                  <tbody id="spaces-lines"></tbody>
                </table>
              </div>
              
              {spaceForm}

            </div>
        );
      }
  
    }