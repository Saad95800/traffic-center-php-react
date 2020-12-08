<?php

namespace App\Controller;
use lib\Controller;
use App\Model\CompanyManager;

class AuthenticationController extends Controller {

    public function is_connected(){

        return !empty($_SESSION['id_company']);

    }

    public function connectUserAjax(){

        $data = null;
        foreach($_POST as $key => $val){
            $_POST = json_decode($key, true);
            break;
        }

        if(empty($_POST)){
            echo json_encode([
                'error' => true,
                'msg' => 'Erreur de traitement'
            ]);
        }

        $cm = new CompanyManager();
        $company = $cm->getCompanyBySiret($_POST['siret']);
        
        if($company == false){
            echo json_encode([
                'error' => true,
                'msg' => 'Cette entreprise n\'éxiste pas'
            ]);
            die;
            
        }elseif( !password_verify($_POST['password'], $company->password_hash) ){
            echo json_encode([
                'error' => true,
                'msg' => 'Le mot de passe est incorrect'
            ]);
            die;
        }

        $_SESSION['id_company'] = $company->id_company;
        echo json_encode([
            'error' => false,
            'msg' => 'Connexion effectuée avec succès',
            'id_company' => $company->id_company
        ]);
        die;

    }

    public function logoutAjax(){

        unset($_SESSION['id_company']);

        return true;
        die;

    }

}