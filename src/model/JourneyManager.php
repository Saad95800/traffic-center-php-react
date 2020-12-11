<?php

namespace App\Model;
use lib\Model;

class JourneyManager extends Model {

    public function getJourneyList(){

		$sql = "SELECT *
                FROM journey as a
                INNER JOIN company as b
                ON b.id_company = a.fk_id_company
                ORDER BY a.created_at DESC";				
				
		$req = $this->dbh->prepare($sql);
        $req->execute();
        $result = $req->fetchAll(\PDO::FETCH_OBJ);

        $sql2 = "SELECT *
                 FROM space 
                 WHERE fk_id_journey = :id_journey";

        foreach($result as $res){
            $req = $this->dbh->prepare($sql2);
            $req->bindValue(':id_journey', $res->id_journey);
            $req->execute();
            $spaces = $req->fetchAll(\PDO::FETCH_OBJ);
            $res->spaces = $spaces;
        }

        if ($result) {
            return $result;
        }
        return false;

    }

    public function save($data){

        try {

            $this->dbh->beginTransaction();

            $sql = "INSERT INTO `journey`(`departure`, `arrival`, `date_departure`, `created_at`, `updated_at`, `fk_id_company`) 
                    VALUES (:departure, :arrival, :date_departure, :created_at, :updated_at, :fk_id_company)";

            $req = $this->dbh->prepare($sql);
            $req->bindValue(':departure', $data['departure']);
            $req->bindValue(':arrival', $data['arrival']);
            $req->bindValue(':date_departure', strtotime($_POST['date_departure'].''. $_POST['time_departure'].':00'));
            $req->bindValue(':created_at', time());
            $req->bindValue(':updated_at', time());
            $req->bindValue(':fk_id_company', $data['delivery_company']);
            $result = $req->execute();

            if(!$result){
                return false;
            }

            $id_journey = $this->dbh->lastInsertId();

            $sql = "insert into `space`(`row`, `position`, `is_empty`, `created_at`, `updated_at`, `fk_id_journey`, `fk_id_company`) 
                    VALUES (:row, :position, :is_empty, :created_at, :updated_at, :fk_id_journey, :fk_id_company)";

            foreach($data['spaces'] as $key => $space){

                $req = $this->dbh->prepare($sql);
                $req->bindValue(':row', htmlentities($space['row']));
                $req->bindValue(':position', htmlentities($space['position']));
                $req->bindValue(':is_empty', htmlentities($space['is_empty']));
                $req->bindValue(':created_at', time());
                $req->bindValue(':updated_at', time());
                $req->bindValue(':fk_id_journey', $id_journey);
                $req->bindValue(':fk_id_company', $_SESSION['id_company']);
                if(!$req->execute()){
                    return false;
                }
                
            }

            $this->dbh->commit();

            return true;
            
        } catch (PDOException $e) {
            $this->dbh->rollback();
            return false;
        }

    }

}