<html>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css" />
        <link href="<?= URLROOT ?>/public/css/map.css" rel="stylesheet" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    </head>
    <body style='border:0; margin: 0'>
        
        <!-- <div class="formBlock">
            <form id="form">
                <input type="text" name="start" class="input" id="start" placeholder="Choose starting point" />
                <input type="text" name="end" class="input" id="destination" placeholder="Choose starting point" />
                <button style="display: none;" type="submit">Get Directions</button>
            </form>
        </div> -->
        <div id='map'></div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"></script>
        <script src="https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=5pvztNnJuSsDdmCnRywYOWKDPKmx4hll"></script>
        <script src="https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-routing.js?key=5pvztNnJuSsDdmCnRywYOWKDPKmx4hll"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
        <script>
// https://www.mapquestapi.com/geocoding/v1/address?key=KEY&inFormat=json&outFormat=json&json={"location":{"street":"9 rue louis de bonnefoy perpignan"},"options":{"thumbMaps":true}}
            // default map layer
            let map = L.map('map', {
                layers: MQ.mapLayer(),
                center: [35.791188, -78.636755],
                zoom: 12
            });
    

            function runDirection(start, end) {
                
                // recreating new map layer after removal
                map = L.map('map', {
                    layers: MQ.mapLayer(),
                    center: [35.791188, -78.636755],
                    zoom: 12
                });
                
                var dir = MQ.routing.directions();

                dir.route({
                    locations: [
                        start,
                        end
                    ]
                });
            

                CustomRouteLayer = MQ.Routing.RouteLayer.extend({
                    createStartMarker: (location) => {
                        var custom_icon;
                        var marker;

                        custom_icon = L.icon({
                            iconUrl: 'http://traffic-center.local/public/img/red.png',
                            iconSize: [20, 29],
                            iconAnchor: [10, 29],
                            popupAnchor: [0, -29]
                        });

                        marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                        return marker;
                    },

                    createEndMarker: (location) => {
                        var custom_icon;
                        var marker;

                        custom_icon = L.icon({
                            iconUrl: 'http://traffic-center.local/public/img/blue.png',
                            iconSize: [20, 29],
                            iconAnchor: [10, 29],
                            popupAnchor: [0, -29]
                        });

                        marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                        return marker;
                    }
                });
                
                map.addLayer(new CustomRouteLayer({
                    directions: dir,
                    fitBounds: true
                })); 
            }


            // function that runs when form submitted
            // function submitForm(event) {
            //     event.preventDefault();

            //     // delete current map layer
            //     map.remove();

            //     // getting form data
            //     start = document.getElementById("start").value;
            //     end = document.getElementById("destination").value;

            //     // run directions function
            //     runDirection(start, end);

            //     // reset form
            //     document.getElementById("form").reset();
            // }

            // asign the form to form variable
            const form = document.getElementById('form');

            // call the submitForm() function when submitting the form
            // form.addEventListener('submit', submitForm);

/////////////////////////// Initialisation des villes de départ et d'arrivée
            map.remove();

            // getting form data
            start = $(window.parent.document).find('#iframe-map').data('start');
            end = $(window.parent.document).find('#iframe-map').data('end');

            if(start == '' || start == undefined || end == '' || end == undefined){
                $("#map").html('<div style="text-align:center;margin-top: 30px;font-size: 39px;">Veuillez renseigner une ville de départ et d\'arrivée</div>')
            }else{
                // run directions function
                runDirection(start, end);
            }

            // reset form
            // document.getElementById("form").reset();

        </script>
    </body>
</html>