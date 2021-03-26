import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'
import Draggabilly from 'draggabilly'

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
          city: '',
          country: '',
          zip_code: '',
          id_space_block_html: '',
          id_pallet_edit: '',
          date_delivery: '',
          hour_delivery: ''
      }
      this.id_space = 1
    }

    componentDidMount(){

    }

    save(){

      let spaces = []
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

      elem.mousemove( (e) => {
        e.stopPropagation();
        let $this = $(e.target).parent()
        $($this).attr("data-top", $($this).css("top").replace("px", ""))
        $($this).attr("data-left", $($this).css("left").replace("px", ""))

        let collision = false
        $(".box-space").each(function(){
          if( $(".box-space").length > 1 ){
            // console.log($(this).attr('id') + '==' + $this.attr("id"))
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
                    console.log("Collision entre "+$(this).attr('id')+' et '+$this.attr('id'))
                    console.log($(e.target).parent().attr('id'))
                    collision = true
                  }
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
        
        collision = false

      })

      $(elem).find(".img-space-info").click( (e)=>{
        this.setState({viewSpaceForm: true});
        console.log(e.target)
        console.log($(e.target).parent().parent().parent().attr('id'))
        this.setState({id_pallet_edit: $(e.target).parent().parent().parent().attr('id')})
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
    }

    render() {

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
                          <input type="text" className="form-control form-control-sm" id="pallet_number" value={this.state.pallet_number} onChange={() => {this.setState({pallet_number: $("#pallet_number").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="customer_name">Nom du client</label>
                          <input type="text" className="form-control form-control-sm" id="customer_name" value={this.state.customer_name} onChange={() => {this.setState({customer_name: $("#customer_name").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="goods_nature">Nature de la marchandise</label>
                          <input type="text" className="form-control form-control-sm" id="goods_nature" value={this.state.goods_nature} onChange={() => {this.setState({goods_nature: $("#goods_nature").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="delivery_address">Date de livraison</label>
                          <input type="date" className="form-control form-control-sm" id="date_delivery"  onChange={() => {this.setState({delivery_address: $("#delivery_address").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="delivery_address">Heure de chargement</label>
                          <input type="time" className="form-control form-control-sm" id="hour_delivery" onChange={() => {this.setState({delivery_address: $("#delivery_address").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="delivery_address">Adresse de livraison</label>
                          <input type="text" className="form-control form-control-sm" id="delivery_address" value={this.state.delivery_address} onChange={() => {this.setState({delivery_address: $("#delivery_address").val()})}} />
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
                  <div className="block-spaces" id="block-spaces"></div>
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