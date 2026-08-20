<?php

$connection_string = getenv("DB_CON");

if (empty($connection_string)) {
    throw new \RuntimeException("Invalid connection string!", 500);
}

$pdo = new PDO($connection_string);

echo "Adding grid_width and grid_height to kingdoms table \n";
$pdo->exec("ALTER TABLE kingdoms ADD COLUMN IF NOT EXISTS grid_width INT NOT NULL DEFAULT 50;");
$pdo->exec("ALTER TABLE kingdoms ADD COLUMN IF NOT EXISTS grid_height INT NOT NULL DEFAULT 50;");

echo "Kingdom dimensions migration completed successfully! \n";
