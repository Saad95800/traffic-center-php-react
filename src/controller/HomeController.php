<?php

namespace App\controller;
use lib\Controller;

class HomeController extends Controller {

    public function indexaction(){

        $journeyManager = null;
        
        $display['content'] = $this->_view->render( 'home.php' , []);

        include VIEW . 'layout.php';

    }

    public function templatemapaction(){
        
        // $display['content'] = $this->_view->render( 'templatemap.php' , []);

        include VIEW . 'templatemap.php';

    }

}