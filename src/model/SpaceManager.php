<?php

namespace App\Model;
use lib\Model;

class SpaceManager extends Model {

    public function update($data){
// var_dump($data);die;
        try {

            $this->dbh->beginTransaction();

            $sql = "UPDATE `space` 
                     SET `pallet_number`= :pallet_number,
                         `customer_name`= :customer_name,
                         `goods_nature`= :goods_nature,
                         `address`= :address,
                         `zip_code`= :zip_code,
                         `city`= :city,
                         `country`= :country,
                         `updated_at`= :updated_at
                         WHERE id_space = :id_space";

            $req = $this->dbh->prepare($sql);
            $req->bindValue(':pallet_number', $data['pallet_number']);
            $req->bindValue(':customer_name', $data['customer_name']);
            $req->bindValue(':goods_nature', $data['goods_nature']);
            $req->bindValue(':address', $data['address']);
            $req->bindValue(':zip_code', $data['zip_code']);
            $req->bindValue(':city', $data['city']);
            $req->bindValue(':country', $data['country']);
            $req->bindValue(':updated_at', time());
            $req->bindValue(':id_space', $data['id_space']);
            $result = $req->execute();

            if(!$result){
                return false;
            }

            $this->dbh->commit();

            return true;
            
        } catch (PDOException $e) {
            $this->dbh->rollback();
            return false;
        }

    }

}