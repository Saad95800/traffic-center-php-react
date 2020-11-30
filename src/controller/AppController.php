<?php

namespace App\Controller;
use lib\Controller;
use App\Model\JourneyManager;

class AppController extends Controller {

    public function indexaction(){

        $display['content'] = $this->_view->render( 'app.php' , []);

        include VIEW . 'layout.php';

    }

    public function getJourneyListAjax(){

        $jm = new JourneyManager();
        $journeyList = $jm->getJourneyList();
        echo json_encode($journeyList);
        die;

    }

}