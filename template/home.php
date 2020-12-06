
    <body id="page-top">
        <!-- Navigation-->
        <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
            <div class="container">
                <a class="navbar-brand js-scroll-trigger" href="#page-top">SDY</a>
                <button class="navbar-toggler navbar-toggler-right" style="color: #6475a1;border: 1px solid #6475a1;" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="#about">Contact</a></li>
                        <li class="nav-item"><a class="nav-link js-scroll-trigger" href="#projects" id="btn-connexion-navbar">Connexion</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- Masthead-->
        <header class="masthead">
            <div class="container d-flex h-100 align-items-center">
                <div class="mx-auto text-center">
                    <h1 class="mx-auto my-0 text-uppercase">Traffic center</h1>
                    <h2 class="text-white-50 mx-auto mt-2 mb-5">By SDY</h2>
                    <a class="btn btn-primary js-scroll-trigger" id="btn-connexion" style="background-color:#6475a1" href="app">Commencer</a>
                </div>
            </div>
        </header>
        <div id="black-screen" class="display-flex-center" style="display: none;"> 
            <div id="popup-connexion" class="display-flex-center" style="display: none">
            </div>
        </div>
        <!-- Footer-->
        <footer class="footer bg-black small text-center text-white-50"><div class="container">Copyright © Your Website 2020</div></footer>
        <!-- Bootstrap core JS-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Third party plugin JS-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js"></script>
        <!-- Core theme JS-->
        <script src="<?= URLROOT ?>/public/js/scripts.js"></script>
        <script>
            document.getElementById('btn-connexion').addEventListener('click', function(e){
                e.preventDefault();
                displayPopupConnexion();
            });

            document.getElementById('btn-connexion-navbar').addEventListener('click', function(e){
                e.preventDefault();
                displayPopupConnexion();
            });

            function displayPopupConnexion(){
                document.getElementById('black-screen').style.display = "flex";
                document.getElementById('popup-connexion').style.display = "flex";
            }

            document.getElementById('popup-connexion').addEventListener('click', function(e){
                e.stopPropagation();
            });

            document.getElementById('black-screen').addEventListener('click', function(e){
                hidePopupConnexion();
            });



            function hidePopupConnexion(){
                document.getElementById('black-screen').style.display = "none";
                document.getElementById('popup-connexion').style.display = "none";    
            }

            function hidePopupConnexion(){
                document.getElementById('black-screen').style.display = "none";
                document.getElementById('popup-connexion').style.display = "none";    
            }
        </script>