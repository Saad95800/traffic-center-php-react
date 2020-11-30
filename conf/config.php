<?php

namespace config;

class config{
  public $settings =[];
  private static $_Instance;


  public function __construct(){
    $this->settings = require 'configuration.php';
  }
  public static function getConfigInstance(){
    if(is_null(self::$_Instance)){
      self::$_Instance = new config();
    }
    return self::$_Instance;
  }
  public function get($key){
    if (is_null($key)) {
      return false;
    }
    return $this->settings[$key];
  }
}
