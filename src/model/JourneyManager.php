<?php

namespace App\Model;
use lib\Model;

class JourneyManager extends Model {

    public function getJourneyList(){

		$sql = "select *
				from journey";				
				
		$req = $this->dbh->prepare($sql);
        $req->execute();
        $result = $req->fetchAll(\PDO::FETCH_OBJ);

        if ($result) {
            return $result;
        }
        return false;

    }

}