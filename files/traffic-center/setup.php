<?php


//chemin absolu *** ROOT => racine du dossier ***
define('ROOT', realpath(__DIR__).DIRECTORY_SEPARATOR);

//chemin absolu *** ROOTM => racine du dossier métier ***
define('ROOT_TEMPLATE', realpath(__DIR__).'/template'.DIRECTORY_SEPARATOR);

//répertoire de tous les scripts
//define('MAILER', ROOT."PHPMailer".DIRECTORY_SEPARATOR);
define('ENTITY', ROOT."src".DIRECTORY_SEPARATOR."entity".DIRECTORY_SEPARATOR);
define('CONTROLLER',ROOT."src".DIRECTORY_SEPARATOR."controller".DIRECTORY_SEPARATOR);
define('VIEW',ROOT."template".DIRECTORY_SEPARATOR);
define('TEST',ROOT."test".DIRECTORY_SEPARATOR);
define('CONF',ROOT."conf".DIRECTORY_SEPARATOR);
define('CRON',ROOT."cron".DIRECTORY_SEPARATOR);
define('PIVOT',ROOT."pivot".DIRECTORY_SEPARATOR);
define('VUES',ROOT."view".DIRECTORY_SEPARATOR);
define('URLROOT','http://traffic-center.local');

// inclure l'autoload de composer
require_once 'vendor/autoload.php';
//retourne un tableau de clé et valeur

$config = config\config::getConfigInstance();

//constantes pour la base de données
define('DB_NAME',$config->get('db_name'));
define('DB_HOST',$config->get('db_host'));
define('DB_USER',$config->get('db_user'));
define('DB_PASSWORD',$config->get('db_pswd'));
define('DB_PORT',$config->get('db_port'));