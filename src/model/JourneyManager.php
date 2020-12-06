<?php

namespace App\Model;
use lib\Model;

class JourneyManager extends Model {

    public function getJourneyList(){

		$sql = "SELECT *
				FROM journey";				
				
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

}