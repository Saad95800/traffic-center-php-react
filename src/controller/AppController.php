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

        $auth = new AuthenticationController();

        if(!$auth->is_connected()){
            echo json_encode([
                'error' => true,
                'error_code' => 1,
                'msg' => 'L\'utilisateur n\'est pas connecté'
            ]);
            die;
        }

        $jm = new JourneyManager();
        $journeyList = $jm->getJourneyList();
        echo json_encode($journeyList);
        die;

    }

    public function getCompanyAjax(){

        $auth = new AuthenticationController();

        if(!$auth->is_connected()){
            echo json_encode([
                'error' => true,
                'error_code' => 1,
                'msg' => 'L\'utilisateur n\'est pas connecté'
            ]);
            die;
        }

        $id_company = $_POST['id_company'];

        $cm = new CompanyManager();
        $journeyList = $cm->getCompanyById($id_company);
        echo json_encode($journeyList);
        die;

    }

    public function saveCompanyAjax(){

        $cm = new CompanyManager();
        echo json_encode($cm->saveCompany());
        die;

    }

    public function saveJourneyAjax(){

        if(empty($_POST)){
            echo \json_encode([
                'error' => true,
                'msg' => 'Erreur lors du traitement'
            ]);
            die;
        }

        if($_POST['delivery_company'] == '' || 
           $_POST['departure'] == '' || 
           $_POST['arrival'] == '' || 
           $_POST['date_departure'] == '' || 
           $_POST['time_departure'] == ''){
            echo \json_encode([
                'error' => true,
                'msg' => 'Veuillez-remplir tout les champs'
            ]);
            die;
        }

        $_POST['spaces'] = json_decode($_POST['spaces'], true);

        $jm = new JourneyManager();
        $result = $jm->save($_POST);

        if(!$result){
            echo \json_encode([
                'error' => true,
                'msg' => 'Echec de l\'enregistrement'
            ]);
            die;
        }

        echo \json_encode([
            'error' => false,
            'msg' => 'Enregistrement effectué avec succès'
        ]);
        die;

    }

}