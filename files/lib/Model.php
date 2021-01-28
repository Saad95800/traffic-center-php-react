<?php

namespace lib;

use \PDO;

class Model {

    /**
     * Objet PDO
     * @var PDO
     */
    protected $dbh;

    public function __construct()
    {
        // 1 - Connexion à la BDD
        try {
            $this->dbh = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT, DB_USER, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"));
        } catch (PDOException $e) {
            echo 'Échec de la connexion : ' . $e->getMessage();
        }

        // 2 - Date français - format Mois et annèe.
        // Mise en forme de la date de la version de l'application (ex : Janvier 2016)
        date_default_timezone_set('Europe/Paris');
        // Français
        setlocale(LC_TIME, 'fr_FR', 'fra');
    }

    /**
     * Fonction de recherche
     * @param array|null $req
     * @return array
     */
    public function find( $req = [])
    {
        $pre = $this->dbh->prepare($this->sqlBuild($req));
        $pre->execute();
        return $pre->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retourne le dernier id inserré
     * @return string
     */
    public function getLastInsertId(){
        return $this->dbh->lastInsertId();
    }

    public function getAllData($nameTable)
    {

        $req = $this->dbh->prepare("SELECT * FROM $nameTable");
        $req->execute();
        $result = $req->fetch();
        if (!$result) {
            return false;
        }
        return $result;
    }

    public function getEntityById($table, $id, $format = null) {

        if ($this->tableExiste($table) && $id !== null) {

            //Si l'id n'est pas à null, on récupère les données pour le formulaire
            $primary = $this->getClePrimaireTable($table);

            $sql = "SELECT *
					FROM $table
                    WHERE $primary = '" . $id . "'";

            $req = $this->dbh->prepare($sql);
            $req->execute();
            $datas = $req->fetchAll(PDO::FETCH_ASSOC);

            switch ($format) {

                case 'date':
                    foreach ($datas as $keyData => $champs) {

                        foreach ($champs as $keyChamp => $champ)
                            if (preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/", $champ)) { // si il s'agit d'une date au format sql
                                $date = date_create($champ); //create a datetime object
                                $datas[$keyData][$keyChamp] = date_format($date, "d/m/Y"); //convertir en format JJ/MM/AAAA
                            } elseif ($champ == '0000-00-00') {
                                $datas[$keyData][$keyChamp] = '00/00/0000';
                            }
                    }
                    break;

                default:
                    break;
            }



            if (count($datas) > 0) {
                return $datas[0];
            } else {
                return array();
            }
        }

        return false;
    }    
    
    /**
     * Fonction permettant de tester si une table existe
     * @param string $table
     * @return boolean
     */
    public function tableExiste($table) {

        $sql = "SELECT TABLE_NAME 
                FROM information_schema.tables 
                WHERE table_schema = '" . DB_NAME . "'
                AND table_name = '$table' 
                LIMIT 1";

        $req = $this->dbh->prepare($sql);
        $req->execute();
        $donnees = $req->fetchAll(PDO::FETCH_ASSOC);

        if (count($donnees) > 0) {
            return true;
        }
        return false;
    }    
    
    /**
     * Fonction permettant de récupérer la colonne clé primaire de la table
     * @param string $table
     */
    public function getClePrimaireTable($table) {
        $sql = "SELECT column_name as 'primary'
                FROM information_schema.columns
                WHERE table_schema = '" . DB_NAME . "' AND table_name = '" . $table . "'
                AND (COLUMN_KEY ='PRI' OR EXTRA = 'auto_increment')";
        $req = $this->dbh->prepare($sql);
        $req->execute();
        $donnees = $req->fetchAll(PDO::FETCH_ASSOC);
        if (count($donnees) > 0) {
            return $donnees[0]['primary'];
        } else {
            return false;
        }
    }    
    
    public function getDateNow() {
        $sql = "SELECT DATE_FORMAT(NOW(), '%d/%m/%Y') as now";
        $req = $this->dbh->prepare($sql);
        $req->execute();
        $now = $req->fetch(PDO::FETCH_ASSOC);
        
        return $now['now'];
    }   
    
}
