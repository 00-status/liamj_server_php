<?php

$connection_string = getenv("DB_CON");

if (empty($connection_string)) {
    throw new \RuntimeException("Invalid connection string!", 500);
}

$pdo = new PDO($connection_string);

echo "Fetching Kingdoms \n";
var_dump($pdo->query("SELECT * FROM kingdoms;")->fetchAll());