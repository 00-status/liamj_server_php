<?php

$connection_string = $_ENV["DB_CON"];

if (empty($connection_string)) {
    throw new \RuntimeException("Invalid connection string!", 500);
}

$pdo = new PDO($connection_string);

echo "Dropping Column \n";

$pdo->exec("ALTER TABLE terminal_directories DROP COLUMN sub_directories;");

echo "Dropped Column! \n";
