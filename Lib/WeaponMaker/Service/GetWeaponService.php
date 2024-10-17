<?php

namespace Lib\WeaponMaker\Service;
use PDO;

class GetWeaponService
{
    public function getWeapon(): string
    {
        $dsn = file_get_contents( __DIR__ . "/../../../secrets/db_connection_string.txt");

        try {
            // Create a new PDO instance
            $pdo = new PDO($dsn);

            // Set error mode to exception
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $query = $pdo->query("select * from weapon_effects;");

            $query->execute();

            return json_encode($query->fetchAll());
        } catch (\PDOException $e) {
            return 'Connection failed: ' . $e->getMessage();
        }
    }
}
