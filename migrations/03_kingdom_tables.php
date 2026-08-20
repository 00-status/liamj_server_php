<?php

$connection_string = getenv("DB_CON");

if (empty($connection_string)) {
    throw new \RuntimeException("Invalid connection string!", 500);
}

$pdo = new PDO($connection_string);

echo "Creating kingdoms \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS kingdoms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);");

echo "Creating region_templates \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS region_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);");

echo "Creating tile_templates \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS tile_templates (
    id SERIAL PRIMARY KEY,
    region_template_id INT NOT NULL REFERENCES region_templates(id) ON DELETE CASCADE,
    x INT NOT NULL,
    y INT NOT NULL,
    type VARCHAR(50) NOT NULL
);");

echo "Creating regions \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    kingdom_id INT NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
    region_template_id INT REFERENCES region_templates(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    origin_x INT NOT NULL,
    origin_y INT NOT NULL
);");

echo "Creating tiles \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS tiles (
    id SERIAL PRIMARY KEY,
    region_id INT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    x INT NOT NULL,
    y INT NOT NULL,
    type VARCHAR(50) NOT NULL
);");

echo "Kingdom migrations completed successfully! \n";
