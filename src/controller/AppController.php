<?php

namespace App\Controller;
use lib\Controller;
use App\Model\JourneyManager;
use App\Model\CompanyManager;
use App\Controller\AuthenticationController;

class AppController extends Controller {

    public function indexaction(){

        $auth = new AuthenticationController();
        if(!$auth->is_connected()){
            header('location: /');
        }
        $display['content'] = $this->_view->render( 'app.php' , []);

        include VIEW . 'layout.php';

    }

    public function getJourneyListAjax(){

        $jm = new JourneyManager();
        $journeyList = $jm->getJourneyList();
        echo json_encode($journeyList);
        die;

    }

    public function saveCompanyAjax(){

        $cm = new CompanyManager();
        echo json_encode($cm->saveCompany());
        die;

    }

}