<?php

namespace App\Controller;
use lib\Controller;
use App\Model\JourneyManager;
use App\Model\SpaceManager;
use App\Model\CompanyManager;
use App\Controller\AuthenticationController;

class AppController extends Controller {

    public function indexaction(){

        $auth = new AuthenticationController();
        // if(!$auth->is_connected()){
        //     header('location: /');
        // }
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


        $offset = 0;
        if(isset($_POST['offset'])){
            $offset = $_POST['offset'];
        }

        $old = 'false';
        if(isset($_POST['old'])){
            $old = $_POST['old'];
        }

        // var_dump($_POST);
        // die;

        $jm = new JourneyManager();
        $journeyList = $jm->getJourneyList($offset, $old);
        echo json_encode($journeyList);
        die;

    }

    public function getOldJourneyListAjax(){

        $auth = new AuthenticationController();

        if(!$auth->is_connected()){
            echo json_encode([
                'error' => true,
                'error_code' => 1,
                'msg' => 'L\'utilisateur n\'est pas connecté'
            ]);
            die;
        }


        $offset = 0;
        if(isset($_POST['offset'])){
            $offset = $_POST['offset'];
        }

        // var_dump($_POST);
        // die;

        $jm = new JourneyManager();
        $journeyList = $jm->getJourneyList($offset, true);
        echo json_encode($journeyList);
        die;

    }

    public function getJourneyAjax(){

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
        $journey = $jm->getJourney($_GET['id_journey']);
        echo json_encode($journey);
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

        // echo '<pre>'.print_r($_POST, true).'/<pre>';
        // die;
        if(empty($_POST)){
            echo \json_encode([
                'error' => true,
                'msg' => 'Erreur lors de l\'enregistrement'
            ]);
            die;
        }

        if($_POST['delivery_company'] == '' || 
           $_POST['departure'] == '' || 
           $_POST['arrival'] == '' || 
           $_POST['date_departure'] == '' || 
           $_POST['date_arrival'] == '' || 
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

    public function updateJourneyAjax(){

        // echo '<pre>'.print_r(json_decode($_POST['spaces'], true), true).'/<pre>';
        // die;
        if(empty($_POST)){
            echo \json_encode([
                'error' => true,
                'msg' => 'Erreur lors de l\'enregistrement'
            ]);
            die;
        }

        if($_POST['delivery_company'] == '' || 
           $_POST['departure'] == '' || 
           $_POST['arrival'] == '' || 
           $_POST['date_departure'] == '' || 
           $_POST['date_arrival'] == '' || 
           $_POST['time_departure'] == ''){
            echo \json_encode([
                'error' => true,
                'msg' => 'Veuillez-remplir tout les champs'
            ]);
            die;
        }

        $_POST['spaces'] = json_decode($_POST['spaces'], true);

        $jm = new JourneyManager();
        $result = $jm->update($_POST);

        // var_dump($result);die;
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

    public function updateSpaceAjax(){

        if(empty($_POST)){
            echo \json_encode([
                'error' => true,
                'msg' => 'Erreur lors de l\'enregistrement'
            ]);
            die;
        }

        $data = $_POST;

        $sm = new SpaceManager();
        $result = $sm->update($data);

        if(!$result){
            echo \json_encode([
                'error' => true,
                'msg' => 'Echec de l\'enregistrement'
            ]);
            die;
        }

        echo \json_encode([
            'error' => false,
            'msg' => 'Enregistrement effectué avec succès',
        ]);
        die;

    }
}