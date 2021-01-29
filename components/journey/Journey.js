import React, { Component } from 'react'
import $ from 'jQuery'
import axios from 'axios'

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
          id_space_block_html: ''
      }
      this.draggedElement = null;
      this.spacesWidth = 0
      this.iteration = 0
    }

    componentDidMount(){
      $(document).on('click', '.btn-delete-line', function(){
        $(this).parent().remove()
        $("#drop-spaces-zone").css('display', 'flex')
        let k = 0
        $(".space-dropped").each(function(){
          $(this).attr("id", "space-dropped-"+k)
          k++
        })
        let l = 0
        $(".drop-spaces-zone").each(function(){
          if($(this).attr('id') != 'drop-spaces-zone'){
            $(this).attr('data-col', l)
            l++
          }
        })
      })
      let element1 = document.getElementById("space-draggable-horizontal-80-120")
      let element2 = document.getElementById("space-draggable-vertical-80-120")
      let element3 = document.getElementById("space-draggable-horizontal-100-120")
      let element4 = document.getElementById("space-draggable-vertical-100-120")
      this.initDraggable(element1)
      this.initDraggable(element2)
      this.initDraggable(element2)
      this.initDraggable(element3)
      this.initDraggable(element4)
      let element5 = document.getElementById("drop-spaces-zone")
      this.initDropZone(element5)

      $(document).on('mouseenter', ".drop-spaces-zone", function(){
        if($(this).attr('id') != 'drop-spaces-zone'){
          $(".btn-delete-line").each(function(){
            $(this).css("display", 'none')
          })
          $(this).find(".btn-delete-line").css('display', 'inline-block')
          setTimeout(() => {
            $(this).find(".btn-delete-line").css('display', 'none')
          }, 3000)
        }
      })

      // if(this.props.page == "edit-journey"){

        let self = this
        $(document).on('click', ".space-draggable", function(){
          if($(this).parent().attr("class") == "drop-spaces-zone" && !$(this).hasClass("new_element")){
            console.log($(this).attr('data-number'))
            self.setState({
              viewSpaceForm: true,
              pallet_number: ($(this).attr('data-number') == 'null' ? '' : $(this).attr('data-number')),
              customer_name: $(this).attr('data-customer_name'),
              goods_nature: $(this).attr('data-goods_nature'),
              delivery_address: $(this).attr('data-address'),
              city: $(this).attr('data-city'),
              country: $(this).attr('data-country'),
              zip_code: $(this).attr('data-zip_code'),
              id_space_block_html: $(this).attr('id')
            })
          }

        })
        
      // }

    }

    initDraggable(draggable) {
      draggable.addEventListener("dragstart", (e) => {this.draggedElement = e.target});
      draggable.addEventListener("drag", () => {})
      draggable.addEventListener("dragend", () => {})
      draggable.setAttribute("draggable", "true")
  }

    initDropZone(dropZone) {
      dropZone.addEventListener("dragenter", this.dragenter.bind(this))
      dropZone.addEventListener("dragover", this.dragover.bind(this))
      dropZone.addEventListener("dragleave", this.dragleave.bind(this))
      dropZone.addEventListener("drop", (ev) => {
        this.dropElement(ev)
      });
    }

    dragenter(e){
      console.log('dragenter')
      e.preventDefault()
    }

    dragover(e){
      console.log('dragover')
      e.preventDefault()
      $("#drop-spaces-zone").css('background-color', 'yellow')
    }

    dragleave(e){
      console.log('dragleave')
      e.preventDefault()
      $("#drop-spaces-zone").css('background-color', 'transparent')
    }

    createNemElement(ev, ){
      let newElem = this.draggedElement.cloneNode(true)
        $(".space-draggable").each(function(){
          $(this).html("")
        })
      newElem.classList.add('space-dropped');
      newElem.classList.add('new_element');
      // $(newElem).attr("data-col", "toto")
      ev.target.appendChild(newElem)
      let i = 0
      $(".space-dropped").each(function(){
        $(this).attr("id", "space-dropped-"+i)
        i++
      })
    }

    dropElement(ev){

        let withSpaces = this.calculSpacesWidth()

        if($(ev.target).attr("class").indexOf('space-draggable') == -1){
          withSpaces = this.calculSpacesWidth()
          if(withSpaces <= 12.5){
          let spacesDraggable = $("#drop-spaces-zone").find('.space-draggable')
          let nbrSpaceDraggable = $("#drop-spaces-zone").find('.space-draggable').length
          // console.log(nbrSpaceDraggable)
          let validLine = false
            ev.preventDefault();
            if(nbrSpaceDraggable < 3){
              if(nbrSpaceDraggable == 0){ // Si la dropzone est vide on autorise le drop
                if(withSpaces <= 12.1){ // Si la largeur restante est inférieure ou égale à 12,1m
                  this.createNemElement(ev)
                }else{ // On refuse le drop si la largeur des palettes est supérieure à 12,1m et si la pallette à déposr est horizontale (parce qu'il n'y aura plus assez de place pour la poser)
                  if($(this.draggedElement).data('position') == 'vertical'){
                    console.log('vertical')
                    if(withSpaces <= 12.3){
                      this.createNemElement(ev)
                    }else{
                      if(withSpaces <= 12.5){
                        if($(this.draggedElement).data('size') == '80-120'){
                          this.createNemElement(ev)
                        }else{
                          this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette 100/120', true)
                          validLine = false
                        }
                      }else{
                        this.props.viewMessageFlash('Il n\'y a plus assez de place pour mettre de palette', true)
                        validLine = false
                      }
                    }
                  }else{
                    this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette horizontale', true)
                  }
                }
              }else if(nbrSpaceDraggable == 1){ // Si il n'y a qu'un seul élément dans la dropzone, on autorise le drop
                if($(spacesDraggable[0]).data('position') == 'vertical' || $(spacesDraggable[0]).data('size') == '100-120'){ // Si on a que un élément qui est vertical on valide la ligne
                  validLine = true
                }
                if($(this.draggedElement).data('size') == '100-120'){
                  validLine = true
                }
                if(withSpaces <= 12.1){
                  this.createNemElement(ev)
                }else{
                  if( $(this.draggedElement).data('position') == 'vertical' ){
                    if(withSpaces <= 12.3){
                      this.createNemElement(ev)
                    }else{
                      if(withSpaces <= 12.5){
                        if($(this.draggedElement).data('size') == '80-120'){
                          this.createNemElement(ev)
                        }else{
                          this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette 100/120', true)
                          validLine = false
                        }
                      }else{
                        this.props.viewMessageFlash('Il n\'y a plus assez de place pour mettre de palette', true)
                        validLine = false
                      }
                    }
                  }else{
                    validLine = false
                    this.props.viewMessageFlash('Il n\'y a plus assez de place pour une palette horizontale', true)
                  }
                }
              }else if(nbrSpaceDraggable == 2){ // Si il y a 2 éléments dans la dropzone
                let two80120Horizontal = true
                spacesDraggable.each(function(){
                  if($(this).data('size') != '80-120' && $(this).data('position') != 'horizontal'){
                    two80120Horizontal = false
                  }
                })
                if(two80120Horizontal){ // Si on a 2 éléments horizontaux validLine = true
                  console.log('On a 2 élément précédent')
                    validLine = true
                }
                  let hundred = false
                  let positionOk = true
                  spacesDraggable.each(function(){
                    if($(this).data('size') == '100-120'){ // Si un des 2 élément est 100/120 on interdit le drop
                      hundred = true
                    }
                    if($(this).data('position') == 'vertical'){ // Si un des éléments est vertical on interdit le drop
                      positionOk = false
                    }
                  })
                  if(hundred == false && positionOk == true && this.draggedElement.getAttribute('data-size') == '80-120'){ // Si les 2 éléments sont horizontaux et 80/120 et que l'élément à placer est 80/120 on autorise le drop
                    this.createNemElement(ev)
                  }
              }
            }
            // Si ce drop est le dernier possible, on valide la ligne de drop
            if(validLine){
              this.validLine(ev)
            }
            $("#drop-spaces-zone").css('background-color', 'transparent')
          }else{
            this.props.viewMessageFlash('Il n\'y a plus assez de place pour mettre de palettes', true)
          }        
        }else{
          console.log("Pas de drop pour cet élément")
        }
  }

    cleanLine(e){
      e.preventDefault()
      $("#drop-spaces-zone").find('.space-draggable').each(function(){
        $(this).remove()
      })
    }

    validLine(e){
      e.preventDefault()
      this.iteration = 100
      if($('#drop-spaces-zone').find('.space-draggable').length > 0){
        $("#drop-spaces-zone").find('.new_element').each(function(){
          $(this).removeClass('new_element')
        })
      let j = 0
      $(".space-dropped").each(function(){
        $(this).attr("id", "space-dropped-"+j)
        j++
      })

        let newElement = document.querySelector("#drop-spaces-zone").cloneNode(true)
        let html = ''
        let i = 0
        $(".drop-spaces-zone").each(function(){
          html += '<div class="drop-spaces-zone" id="drop-spaces-zone-'+i+'" data-col="'+i+'" style="border: 3px solid grey;"></span>'+$(this).html()+'</div>'
          i++
        })
        $("#block-spaces").html(html)
        newElement.innerHTML = ''
        this.initDropZone(newElement)

        this.setState({spacesWidth: this.calculSpacesWidth()})
        document.querySelector("#block-spaces").appendChild(newElement)
        newElement.setAttribute('id', 'drop-spaces-zone')
        $("#drop-spaces-zone").css('width', '63px')
        $('.btn-delete-line').each(function(){
          $(this).css('width', $(this).parent().css('width'))
          $(this).css('display', 'inline-block')
        })
        $("#drop-spaces-zone").append('<span class="btn-delete-line" style="display:none;"></span>')
        if(this.calculSpacesWidth() > 12.5){
          $("#drop-spaces-zone").css('display', 'none')
        }

      }

      this.updateSpaces()
    }

    calculSpacesWidth(){
      let withSpaces = 0
      $(".drop-spaces-zone").each(function(){
        if($(this).attr("id") != "drop-spaces-zone"){
          console.log(Math.round($(this).css('width').replace("px", "")))
          switch(Math.round($(this).css('width').replace("px", ""))){
            case 51:
              withSpaces += 1
              break;
            case 63:
              withSpaces += 1.2
              break;
            case 44:
              withSpaces += 0.8
              break;
            default:
              break;
          }          
        }

      })
      return withSpaces
    }

    updateSpaces(){
      let spaces = []
      let lineSpace = []
      $(".drop-spaces-zone").each(function(){
        if($(this).attr("id") != "drop-spaces-zone"){
          lineSpace = []
          let id_col = $(this).attr("id").replace("drop-spaces-zone-", "")
          $(this).find(".space-draggable").each(function(){
            let space = {}
            space.col = id_col
            space.size = $(this).data('size')
            space.position = $(this).data('position')
            spaces.push(space)
          })
          
        }

      })
      this.props.updateSpaces(spaces)
    }

    updateSpaceData(e){

      e.preventDefault()

      // if(this.state.id_space != ""){

        // let formData = new FormData();
        // formData.append('pallet_number', this.state.pallet_number);
        // formData.append('customer_name', this.state.customer_name);
        // formData.append('goods_nature', this.state.goods_nature);
        // formData.append('address', this.state.delivery_address);
        // formData.append('zip_code', this.state.zip_code);
        // formData.append('city', this.state.city);
        // formData.append('country', this.state.country);
        // formData.append('id_space', this.state.id_space);

        // axios({
        //   method: 'POST',
        //   url: '/update-space-ajax',
        //   responseType: 'json',
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   data: formData
        // })
        // .then((response) => {
        //   console.log(response);
        //   if(response.statusText == 'OK'){
        //     this.props.viewMessageFlash(response.data.msg, response.data.error);
        //     let space = $("#block-spaces").find('[data-id_space='+this.state.id_space+']')
        //     space.attr('data-number', this.state.pallet_number)
        //     space.attr('data-customer_name', this.state.customer_name)
        //     space.attr('data-goods_nature', this.state.goods_nature)
        //     space.attr('data-address', this.state.delivery_address)
        //     space.attr('data-zip_code', this.state.zip_code)
        //     space.attr('data-city', this.state.city)
        //     space.attr('data-country', this.state.country)
        //   }else{
        //     this.props.viewMessageFlash('Erreur lors de l\'enregistrement', true);
        //   }
        // })
        // .catch( (error) => {
        //   console.log(error);
        //   this.props.viewMessageFlash('Erreur lors de l\'enregistrement', true);
        // });

      // }else{

        let space = $("#"+this.state.id_space_block_html)
        space.attr('data-number', this.state.pallet_number)
        space.attr('data-customer_name', this.state.customer_name)
        space.attr('data-goods_nature', this.state.goods_nature)
        space.attr('data-address', this.state.delivery_address)
        space.attr('data-zip_code', this.state.zip_code)
        space.attr('data-city', this.state.city)
        space.attr('data-country', this.state.country)

        this.hideSpaceForm()
      // }

    }

    hideSpaceForm(){

      this.setState({
        viewSpaceForm: false,
        id_space: '',
        pallet_number: '',
        customer_name: '',
        goods_nature: '',
        delivery_address: '',
        city: '',
        country: '',
        zip_code: '',
        id_space_block_html: ''
      })

    }
    render() {

      if(this.props.page == "edit-journey" && this.iteration == 0 && this.props.spaces.length > 0){
        
        let spaces = ''
        let colMoins1 = null
        let i = 0
        // console.log(this.props.spaces.length)

          this.props.spaces.map( (space, index) => {
            console.log('map '+i)
              if(colMoins1 != space.col){
                if(i > 0){
                  spaces += '</div>'
                }
                spaces += '<div class="drop-spaces-zone" id="drop-spaces-zone-'+space.col+'" data-col="'+space.col+'" style="border: 3px solid grey;">'
                spaces += '<span class="btn-delete-line" style="display: none;"></span>'
              }

              spaces += '<div class="space-draggable space-dropped space-draggable-'+space.position+'-'+space.size+'" id="space-dropped-'+i+'" data-id_space="'+space.id_space+'" data-number="'+space.pallet_number+'" data-customer_name="'+space.customer_name+'" data-goods_nature="'+space.goods_nature+'" data-address="'+space.address+'" data-city="'+space.city+'" data-country="'+space.country+'" data-zip_code="'+space.zip_code+'" data-size="'+space.size+'" data-position="'+space.position+'" data-col="'+space.col+'" draggable="true"></div>'
              colMoins1 = space.col;
              i++
          } )
          spaces += '</div>'
          $("#drop-spaces-zone").before(spaces)
          this.spacesWidth = this.calculSpacesWidth()
        
        $('.btn-delete-line').each(function(){
          $(this).css('width', $(this).parent().css('width'))
        })
        this.iteration = 100
      }

      let spaceForm = ''
      if(this.state.viewSpaceForm){
        spaceForm = <div className="container-space-form" onClick={this.hideSpaceForm.bind(this)}>
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
                          <label htmlFor="delivery_address">Adresse de livraison</label>
                          <input type="text" className="form-control form-control-sm" id="delivery_address" value={this.state.delivery_address} onChange={() => {this.setState({delivery_address: $("#delivery_address").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="city">Ville</label>
                          <input type="text" className="form-control form-control-sm" id="city" value={this.state.city} onChange={() => {this.setState({city: $("#city").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="country">Pays</label>
                          <input type="text" className="form-control form-control-sm" id="country" value={this.state.country} onChange={() => {this.setState({country: $("#country").val()})}} />
                        </div>
                        <div className="">
                          <label htmlFor="zip_code">Code Postal</label>
                          <input type="text" className="form-control form-control-sm" id="zip_code" value={this.state.zip_code} onChange={() => {this.setState({zip_code: $("#zip_code").val()})}} />
                        </div>
                        <div className="display-flex-center">
                          <button type="submit" onClick={this.updateSpaceData.bind(this)} className="btn btn-primary" style={{backgroundColor: '#6475a1'}}>Enregistrer</button>
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
                          draggable="true">
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
                          draggable="true">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6" style={{border: "3px solid black"}}>
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
                          draggable="true">
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
                          draggable="true">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="" onClick={(e) => {this.cleanLine(e)}} style={{display: 'inline-block', marginTop: '15px'}}>Vider la ligne</a>
              <a href="" onClick={(e) => {this.validLine(e)}} style={{display: 'inline-block', marginTop: '15px', marginLeft: '15px'}}>Valider la ligne</a>
              <div style={{display: 'inline-block', marginTop: '15px', marginLeft: '15px'}}>Largeur totale des palettes : <span style={{fontWeight: '800', fontSize: '1.2em', color: 'rgb(100 156 161)'}}>{this.calculSpacesWidth().toFixed(2)} m</span> (Max 13,310 m) - Place restante : <span style={{fontWeight: '800', fontSize: '1.2em', color: 'rgb(100 156 161)'}}>{(13.310 - this.calculSpacesWidth()).toFixed(2)} m</span></div>
              <div className="display-flex-center height100">
                <div className="flex-row width100" style={{minHeight: '100px'}}>
                  <div className="block-spaces" id="block-spaces" style={{marginRight: '-16px', height: '130px'}}>
                    <div className="drop-spaces-zone" id="drop-spaces-zone">
                      <span className="btn-delete-line"></span>
                    </div>
                  </div>
                  <div className="col-3 d-none d-sm-block" style={{flex: 2}}>
                    <img src="http://traffic-center.local/public/img/front-truck.png" />
                  </div>
                </div>
              </div>
              
              {spaceForm}

            </div>
        );
      }
  
    }