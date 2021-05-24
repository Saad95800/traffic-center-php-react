import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'
import Draggabilly from 'draggabilly'
import moment from 'moment'
import uniqid from 'uniqid'
import html2pdf from 'html2pdf.js'

export default class Journey extends Component {

    constructor(props){
      super(props);
      this.state = {
          spaces: this.props.spaces,
          dropSpaceZone: null,
          viewSpaceForm: false,
          viewTrashForm: false,
          id_space: '',
          pallet_number: '',
          customer_name: '',
          goods_nature: '',
          address: '',
          delivery_city:'',
          delivery_country: '',
          loading_address: '',
          loading_city: '',
          loading_country: '',
          date_delivery: '',
          hour_delivery: '',
          id_space_block_html: '',
          id_pallet_edit: '',
          collision: false,
          id_space_trash: ''
      }
      this.id_space_html = 1
      this.iteration = 0

    }

    componentDidMount(){

      let self = this

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
                let spaces = []
                response.data.spaces.map((space, index)=>{
                  space.id_space_html = uniqid('space-')
                  space.date_delivery = moment.unix(parseInt(space.date_delivery)).format("YYYY-MM-DD")
                  spaces.push(space)
                })
                this.setState({spaces: spaces})

                response.data.stopovers.map((stopover, index) => {
                  $("#container-stop-over").append('<div class="block-stop-over" id="block-stop-over-'+stopover.nb_stopover+'"><label for="stop-over-'+stopover.nb_stopover+'">Escale '+(parseInt(stopover.nb_stopover)+1)+'</label><button type="button" class="close btn-delete-stop-over" aria-label="Close" style="display: inline-block;position:inherit;right:0px;"><span aria-hidden="true">×</span></button><input type="text" value="'+stopover.city+'" class="form-control form-control-sm stop-over-input" id="stop-over-'+stopover.nb_stopover+'" placeholder="Ex : Marseille" /></div>')
                  self.setState({nbStopOver: this.state.nbStopOver +1})
                })
  
                $(".btn-delete-stop-over").each(function(){
                  if($(this).parent().attr('id') != "block-stop-over-"+(self.state.nbStopOver-1) ){
                    $(this).css('display', 'none')
                  }
                })
              
                // $(".img-space-info").each(function(){
                //   $(this).click( (e)=>{
                //     let element = $(e.target).parent().parent().parent()
                //     self.setState({
                //       viewSpaceForm: true,
                //       id_pallet_edit: element.attr('id'),
                //       id_space_html: element.attr('id'),
                //       pallet_number: element.attr('data-pallet_number'),
                //       customer_name: element.attr('data-customer_name'),
                //       goods_nature: element.attr('data-goods_nature'),
                //       address: element.attr('data-address'),
                //       date_delivery: element.attr('data-date_delivery'),
                //       hour_delivery: element.attr('data-hour_delivery'),
                //       id_space: element.attr("data-id_space")
                //     });
                //   })        
                // })

                // $(".img-space-trash").each(function(){
                //   $(document).on('click', $(this), function(){
                //     self.setState({
                //       id_space_trash: $(this).parent().parent().parent().attr("id"), 
                //       viewTrashForm: true
                //     })
                //   })
                // })

                // $(".img-space-rotate").each(function(){
                //   console.log('rotate')
                //   $(this).click( function(){
                //     let width = $(this).parent().parent().parent().css("width")
                //     let height = $(this).parent().parent().parent().css("height")
                //     $(this).parent().parent().parent().css("width", height) 
                //     $(this).parent().parent().parent().css("height", width)
                //     let pos = $(this).parent().parent().parent().attr("data-position")
                //     if(pos == 'vertical'){
                //       $(this).parent().parent().parent().attr("data-position", 'horizontal')
                //     }else{
                //       $(this).parent().parent().parent().attr("data-position", 'vertical')
                //     }
                //   })                  
                // })

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
            }else{
              this.viewMessageFlash('Erreur lors de la récupération des données', true);
            }
  
          })
          .catch( (error) => {
            console.log(error);
          });

      }

      document.addEventListener('click', function(){
        let collision = false;
        let newSpaces = []
        $(".box-space").each(function(){
          if(self.setEventCollision($(this))){
            collision = true
          }
          let th = this
          self.state.spaces.map((space, index) => {
            if(space.id_space_html == $(th).attr('id')){
              space._top = $(th).css('top').replace("px", "")
              space._left = $(th).css('left').replace("px", "")
              newSpaces.push(space)
            }
          })
        })
        self.setState({collision: collision/*, spaces: newSpaces*/})
        self.setCollision(collision)
      })

    }

    componentDidUpdate(){
      $(".box-space").each(function(){
        var draggie = new Draggabilly( $(this)[0], {
          containment: true,
          grid: [ 20, 20 ]
        });                  
      })
      let self = this
      
      $(".img-space-info").each(function(){
        if( $._data($(this).get(0), "events") == undefined ){
          $(this).click( (e)=>{
            let element = $(e.target).parent().parent().parent()
            self.setState({
              viewSpaceForm: true,
              id_pallet_edit: element.attr('id'),
              pallet_number: element.attr('data-pallet_number'),
              customer_name: element.attr('data-customer_name'),
              goods_nature: element.attr('data-goods_nature'),
              address: element.attr('data-address'),
              delivery_city: element.attr('data-delivery_city'),
              delivery_country: element.attr('data-delivery_country'),
              loading_address: element.attr('data-loading_address'),
              loading_city: element.attr('data-loading_city'),
              loading_country: element.attr('data-loading_country'),
              date_delivery: element.attr('data-date_delivery'),
              hour_delivery: element.attr('data-hour_delivery'),
              id_space: element.attr("data-id_space")
            });
          })            
        }
      
      })

      $(".img-space-trash").each(function(){
        if( $._data($(this).get(0), "events") == undefined ){
          $(this).click( function(){
            // $(this).parent().parent().parent().remove()
            self.setState({
              id_space_trash: $(this).parent().parent().parent().attr("id"), 
              viewTrashForm: true})
          })
        }
      })

      $(".img-space-rotate").each(function(){
        if( $._data($(this).get(0), "events") == undefined ){
          $(this).click( function(){
            let width = $(this).parent().parent().parent().css("width")
            let height = $(this).parent().parent().parent().css("height")
            $(this).parent().parent().parent().css("width", height) 
            $(this).parent().parent().parent().css("height", width)
            let pos = $(this).parent().parent().parent().attr("data-position")
            if(pos == 'vertical'){
              $(this).parent().parent().parent().attr("data-position", 'horizontal')
            }else{
              $(this).parent().parent().parent().attr("data-position", 'vertical')
            }
          })   
        }               
      })
      
    }
    

    setCollision(collision){
      this.props.setCollision(collision)
    }

    displayJourneyData(data){
      this.props.displayJourneyData(data)
    }

    createBox(b){

      console.log("create box")
      let size = ''
      let position = ''
      switch(b){
        case 'b1':
          size = '80-120'
          position = 'horizontal'
          break;
        case 'b2':        
          size = '100-120'
          position = 'horizontal'
          break;
        case 'b3':        
          size = '80-120'
          position = 'vertical'
          break;
        case 'b4':         
          size = '100-120'
          position = 'vertical'
          break;
        default:
          break;
      }

      let newSpaces = this.state.spaces
      let newSpace = {
        _left: 0,
        _top: 1220,
        address: "",
        created_at: "",
        customer_name: "",
        date_delivery: "",
        fk_id_company: "",
        fk_id_journey: "",
        goods_nature: "",
        hour_delivery: "",
        id_space: "",
        id_space_html: uniqid('space-') /*"space-"+this.id_space_html*/,
        pallet_number: this.state.spaces.length+1,
        position: position,
        size: size
      }

      newSpaces.push(newSpace)
      this.setState({
        spaces: newSpaces
      })

      this.id_space_html = this.id_space_html + 1
      console.log("incremented")

    }

    setEventCollision($this){

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
                  collision = true
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
      }
      
      return collision
    }

    hideSpaceForm(e){
      e.preventDefault()
      this.setState({
        id_space: '',
        id_space_html: '',
        pallet_number: '',
        customer_name: '',
        goods_nature: '',
        date_delivery: '',
        hour_delivery: '',
        address: '',
        viewSpaceForm: false
      })
    }

    hideTrashForm(){

      this.setState({
        id_space: '',
        id_space_html: '',
        pallet_number: '',
        customer_name: '',
        goods_nature: '',
        date_delivery: '',
        hour_delivery: '',
        address: '',
        viewTrashForm: false,
        id_space_trash: ''
      })
    }

    updateSpaceData(e){
      e.preventDefault()

      let space = $("#"+this.state.id_pallet_edit)
      space.attr('data-pallet_number', this.state.pallet_number)
      space.attr('data-customer_name', this.state.customer_name)
      space.attr('data-goods_nature', this.state.goods_nature)
      space.attr('data-date_delivery', this.state.date_delivery)
      space.attr('data-hour_delivery', this.state.hour_delivery)
      space.attr('data-address', this.state.address)
      space.attr('data-delivery_city', this.state.delivery_city)
      space.attr('data-delivery_country', this.state.delivery_country)
      space.attr('data-loading_address', this.state.loading_address)
      space.attr('data-loading_city', this.state.loading_city)
      space.attr('data-loading_country', this.state.loading_country)

      space.find(".space-number").text(this.state.pallet_number)

      let newSpaces = []
      this.state.spaces.map((sp)=>{

        console.log(space.attr("id"))
        console.log(sp.id_space_html)
        if(space.attr("id") == sp.id_space_html){
          sp.pallet_number = this.state.pallet_number
          sp.customer_name = this.state.customer_name
          sp.goods_nature = this.state.goods_nature
          sp.date_delivery = this.state.date_delivery
          sp.hour_delivery = this.state.hour_delivery
          sp.address = this.state.address          
        }

        newSpaces.push(sp)
      })

      console.log(newSpaces)
      this.setState({
        id_space: '',
        spaces: newSpaces,
        pallet_number: '',
        customer_name: '',
        goods_nature: '',
        date_delivery: '',
        hour_delivery: '',
        address: '',
        viewSpaceForm: false
      })
    }

    toggleSpaceList(e){
      e.preventDefault()
      if($("#spaces-lines-table").css("display") == 'none'){
        $("#spaces-lines-table").slideDown()
        $("#btn-view-spaces-list").text('Masquer la liste des palettes')
      }else{
      $("#spaces-lines-table").slideUp()
      $("#btn-view-spaces-list").text('Voir la liste des palettes')
      }
    }

    deleteSpace(e){
      e.preventDefault()
      this.hideTrashForm()
      let newSpaces = []
      this.state.spaces.map((space, index)=>{

        if(space.id_space_html != this.state.id_space_trash){
          console.log(space)
          newSpaces.push(space)
        }

      })

      this.setState({spaces: newSpaces})

    }

    getPDF(e){
      e.preventDefault()
      var element = document.getElementById('app_root')
      let my_pdf = html2pdf(element)
      console.log(my_pdf)
    }
    render() {

      let spacesLines = ''
      let spacesBox = ''
      // if(this.props.page == "edit-journey" && this.props.spaces.length > 0){
        
        let i = 0

        spacesLines = this.state.spaces.map( (space, index) => {

              let date_delivery = space.date_delivery == null || space.date_delivery == undefined || space.date_delivery == '' || space.date_delivery == 'Invalid date' ? '-' : moment(space.date_delivery).format("DD/MM/YYYY")
              let hour_delivery = space.hour_delivery == null || space.hour_delivery == '' ? '-' : space.hour_delivery
              let customer_name = space.customer_name == null || space.customer_name == '' ? '-' : space.customer_name
              let goods_nature = space.goods_nature == null || space.goods_nature == '' ? '-' : space.goods_nature
              let address = space.address == null || space.address == '' ? '-' : space.address

              return <tr key={index}><td>{space.pallet_number}</td><td>{customer_name}</td><td>{goods_nature}</td><td>{date_delivery}</td><td>{hour_delivery}</td><td>{address}</td></tr>
              i++
          } )

        spacesBox = this.state.spaces.map((space, index)=>{

          let style = {}
          let width = ''
          let height = ''
          switch(space.size){
            case '80-120':
              width = '80px'
              height = '120px'
              if(space.position == 'horizontal'){
                width = '120px'
                height = '80px'
              }
              style = {width: width, height: height, backgroundColor: 'rgb(100, 117, 161)', top: space._top+'px', left: space._left+'px'}
              break;
            case '100-120':
              width = '100px'
              height = '120px'
              if(space.position == 'horizontal'){
                width = '120px'
                height = '100px'
              }
              style = {width: width, height: height, backgroundColor: 'rgb(100 156 161)', top: space._top+'px', left: space._left+'px'}     
              break;
            default:
              break;
          }
          
          // let date_delivery = moment.unix(parseInt(space.date_delivery)).format("YYYY-MM-DD")
          let date_delivery = space.date_delivery == null || space.date_delivery == '' || space.date_delivery == 'Invalid date' ? '-' : moment(space.date_delivery).format("YYYY-MM-DD")
          let id = space.id_space_html

          return <div draggable="true"
                      key={index}
                      className="draggable-space box-space"
                      id={id}
                      data-id_space={space.id_space} 
                      data-pallet_number={space.pallet_number} 
                      data-customer_name={space.customer_name} 
                      data-goods_nature={space.goods_nature} 
                      data-size={space.size} 
                      data-position={space.position} 
                      data-address={space.address} 
                      data-delivery_city={space.delivery_city} 
                      data-delivery_country={space.delivery_country} 
                      data-loading_address={space.loading_address} 
                      data-loading_city={space.loading_city} 
                      data-loading_country={space.loading_country}
                      data-date_delivery={space.date_delivery == null ? 0 : date_delivery}
                      data-hour_delivery={space.hour_delivery == null ? 0 : space.hour_delivery}
                      data-top={space._top} 
                      data-left={space._left} 
                      style={style}>
                  <div style={{width:'100%', height:'100%', display:'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <div style={{width:'100%', height:'20px'}}>
                      <div className="img-space-info"></div>
                    </div>
                    <div className="space-number">{space.pallet_number}</div>
                    <div className="width100" style={{height: '20px'}}>
                      <div className="img-space-rotate"></div>
                      <div className="img-space-trash"></div>
                    </div>
                  </div>
                </div>

        })

      // }


      let spaceForm = ''
      if(this.state.viewSpaceForm){
        spaceForm = <div className="container-space-form" onClick={(e) => {this.hideSpaceForm(e)} }>
                      <form method="POST" className="space-form" id="space-form" onClick={(e)=>{e.stopPropagation()}}>
                        <div>
                          <input type="hidden" className="form-control form-control-sm" id="id_space" value={this.state.id_space} name="id_space" />
                        </div>
                        <div>
                          <label htmlFor="pallet_number">Numéro de palette</label>
                          <input type="text" className="form-control form-control-sm" id="pallet_number" value={this.state.pallet_number} onChange={() => { this.setState({pallet_number: $("#pallet_number").val()}) }} />
                        </div>
                        <div>
                          <label htmlFor="customer_name">Nom du client</label>
                          <input type="text" className="form-control form-control-sm" id="customer_name" value={this.state.customer_name} onChange={() => { this.setState({customer_name: $("#customer_name").val()}) }} />
                        </div>
                        <div>
                          <label htmlFor="goods_nature">Nature de la marchandise</label>
                          <input type="text" className="form-control form-control-sm" id="goods_nature" value={this.state.goods_nature} onChange={() => { this.setState({goods_nature: $("#goods_nature").val()}) }} />
                        </div>
                        <div>
                          <label htmlFor="date_delivery">Date de livraison</label>
                          <input type="date" className="form-control form-control-sm" id="date_delivery"  value={moment(this.state.date_delivery).format("YYYY-MM-DD")} onChange={() => { this.setState({date_delivery: $("#date_delivery").val()}) }} />
                        </div>
                        <div>
                          <label htmlFor="hour_delivery">Heure de chargement</label>
                          <input type="time" className="form-control form-control-sm" id="hour_delivery" value={this.state.hour_delivery} onChange={() => { this.setState({hour_delivery: $("#hour_delivery").val()}); }} />
                        </div>
                        <div>
                          <label htmlFor="loading_address">Adresse de chargement</label>
                          <div style={{display: 'flex', flexDirection: 'row'}}>
                            <input type="text" className="form-control form-control-sm" id="loading_address" placeholder="adresse"  onChange={() => { this.setState({loading_address: $("#loading_address").val()}) }}  value={this.state.loading_address} style={{flex: 2,  borderRight: 'none', borderRadius: '0px'}}/>
                            <input type="text" className="form-control form-control-sm" id="loading_city" placeholder="Ville"  onChange={() => { this.setState({loading_city: $("#loading_city").val()}) }}  value={this.state.loading_city} style={{flex: 1,  borderLeft: 'none', borderRight: 'none', borderRadius: '0px'}}/>
                            <input type="text" className="form-control form-control-sm" id="loading_country" placeholder="Pays"  onChange={() => { this.setState({loading_country: $("#loading_country").val()}) }}  value={this.state.loading_country} style={{flex: 1,  borderLeft: 'none', borderRadius: '0px'}}/>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="delivery_address">Adresse de livraison</label>
                          <div style={{display: 'flex', flexDirection: 'row'}}>
                            <input type="text" className="form-control form-control-sm" id="delivery_address" placeholder="adresse"  onChange={() => { this.setState({address: $("#delivery_address").val()}) }}  value={this.state.address} style={{flex: 2,  borderRight: 'none', borderRadius: '0px'}}/>
                            <input type="text" className="form-control form-control-sm" id="delivery_city" placeholder="Ville"  onChange={() => { this.setState({delivery_city: $("#delivery_city").val()}) }}  value={this.state.delivery_city} style={{flex: 1,  borderLeft: 'none', borderRight: 'none', borderRadius: '0px'}}/>
                            <input type="text" className="form-control form-control-sm" id="delivery_country" placeholder="Pays"  onChange={() => { this.setState({delivery_country: $("#delivery_country").val()}) }}  value={this.state.delivery_country} style={{flex: 1,  borderLeft: 'none', borderRadius: '0px'}}/>
                          </div>
                        </div>
                        <div className="map-journey">

                        <iframe 
                        id="iframe-map"
                          src="http://traffic-center.local/templatemap" 
                          data-start={this.state.loading_address +' '+this.state.loading_city}
                          data-end={this.state.address +' '+this.state.delivery_city}
                          style={{width: '100%', height: '400px'}}
                          ></iframe>

                        </div>
                        <div className="display-flex-center">
                          <button type="submit" onClick={(e)=>{this.updateSpaceData(e)} } className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Enregistrer</button>
                        </div>
                      </form>
                    </div>
      }

      let trashForm = ''
      if(this.state.viewTrashForm){
        trashForm = <div className="container-trash-form" onClick={(e) => {this.hideTrashForm(e)} }>
                      <form method="POST" className="trash-form" id="trash-form" onClick={(e)=>{e.stopPropagation()}}>
                        <div>
                          <label>Etes-vous sûr de vouloir supprimer cette palette ?</label>
                        </div>
                        <div className="display-flex-center">
                          <button type="submit" onClick={(e)=>{this.deleteSpace(e)} } className="btn btn-danger" style={{backgroundColor: 'red'}}>Supprimer</button>
                        </div>
                      </form>
                    </div>
      }

        return (
            <div className="col-12" id="journey-component-container">
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
                          data-delivery_city=""
                          data-delivery_country=""
                          data-loading_address=""
                          data-loading_city=""
                          data-loading_country=""
                          // data-city=""
                          // data-zip_code=""
                          // data-country=""
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
                          data-delivery_city=""
                          data-delivery_country=""
                          data-loading_address=""
                          data-loading_city=""
                          data-loading_country=""
                          // data-city=""
                          // data-zip_code="" 
                          // data-country=""
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
                          data-delivery_city=""
                          data-delivery_country=""
                          data-loading_address=""
                          data-loading_city=""
                          data-loading_country=""
                          // data-city=""
                          // data-zip_code=""
                          // data-country=""
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
                          data-delivery_city=""
                          data-delivery_country=""
                          data-loading_address=""
                          data-loading_city=""
                          data-loading_country=""
                          // data-city=""
                          // data-zip_code=""
                          // data-country=""
                          draggable="true"
                          onClick={()=>{this.createBox('b4')}}>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="display-flex-center height100">
                <div className="width100 display-flex-center" style={{minHeight: '100px', flexDirection: 'column'}}>
                  <div className="d-sm-block" style={{marginTop: '20px'}}>
                    <img src="http://traffic-center.local/public/img/front-truck.png" style={{transform: "rotate(270deg)"}}/>
                  </div>
                  <div className="block-spaces" id="block-spaces">
                    {spacesBox}
                  </div>
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
                  <tbody id="spaces-lines">{spacesLines}</tbody>
                </table>
              </div>
              
              {spaceForm}
              {trashForm}

            <button onClick={this.getPDF.bind(this)}>GET PDF</button>
            </div>
        );
      }
  
    }