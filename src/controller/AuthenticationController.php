<?php

namespace App\Controller;
use lib\Controller;

class AuthenticationController extends Controller {

    public function is_connected(){
        if(session_status() === PHP_SESSION_NONE){
            session_start();
        }
        return !empty($_SESSION['connected']);

    }

    public function connect_user(){
        
    }

}