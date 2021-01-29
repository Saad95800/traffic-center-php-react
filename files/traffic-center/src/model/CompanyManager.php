<?php

namespace App\Model;
use lib\Model;

class CompanyManager extends Model {

    public function saveCompany(){

        $data = null;
        foreach($_POST as $key => $val){
            $data = json_decode($key, true);
            break;
        }

        if($this->chefIfCompanyExist($data['siret'])){
            return [
                'error' => true,
                'msg' => 'Cette entreprise possède déjà un compte',
            ];
        }

        if($this->chefIfEmailExist($data['email'])){
            return [
                'error' => true,
                'msg' => 'Cet email est déjà utilisé',
            ];
        }

		$sql = "INSERT INTO `company`(`name_company`, `siret`, `email`, `password_hash`, `telephone`, `created_at`, `updated_at`) 
                VALUES (:name_company, :siret, :email, :password_hash, :telephone, :created_at, :updated_at)";				

		$req = $this->dbh->prepare($sql);
        $req->bindValue(':name_company', htmlentities($data['company_name']));
        $req->bindValue(':siret', htmlentities($data['siret']));
        $req->bindValue(':email', htmlentities($data['email']));
        $req->bindValue(':password_hash', password_hash($data['password'], PASSWORD_DEFAULT));
        $req->bindValue(':telephone', htmlentities($data['telephone']));
        $req->bindValue(':created_at', time() );
        $req->bindValue(':updated_at', time() );
        
        $result = $req->execute();

        $id_company = $this->dbh->lastInsertId();

        if ($result) {
            $_SESSION['id_company'] = $id_company;
            return [
                'result' => $result,
                'error' => false,
                'msg' => 'Compte crée avec succès',
                'id_company' => $id_company
            ];
        }
        return [
            'result' => $result,
            'error' => false,
            'msg' => 'Echec de la création du compte', 
        ];

    }

    public function chefIfCompanyExist($siret){

        $sql = "SELECT * FROM company WHERE siret = :siret";

        $req = $this->dbh->prepare($sql);
        $req->bindValue(':siret', htmlentities($siret));
        $req->execute();
        $company = $req->fetch(\PDO::FETCH_OBJ);
        if ($company) {
            return true;
        }
        return false;
    
    }

    public function getCompanyBySiret($siret){			

        $sql = "SELECT * FROM company WHERE siret = :siret";

        $req = $this->dbh->prepare($sql);
        $req->bindValue(':siret', htmlentities($siret));
        $req->execute();
        $company = $req->fetch(\PDO::FETCH_OBJ);
        if ($company) {
            return $company;
        }
        return false;
    }

    public function chefIfEmailExist($email){			

        $sql = "SELECT * FROM company WHERE email = :email";

        $req = $this->dbh->prepare($sql);
        $req->bindValue(':email', htmlentities($email));
        $req->execute();
        $company = $req->fetch(\PDO::FETCH_OBJ);
        if ($company) {
            return true;
        }
        return false;
    }

    public function getCompanyById($id_company){

        $sql = "SELECT * FROM company WHERE id_company = :id_company";

        $req = $this->dbh->prepare($sql);
        $req->bindValue(':id_company', htmlentities($id_company));
        $req->execute();
        $company = $req->fetch(\PDO::FETCH_OBJ);
        if ($company) {
            return $company;
        }
        return false;

    }

}