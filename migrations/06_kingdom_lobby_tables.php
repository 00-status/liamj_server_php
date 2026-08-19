<?php

$connection_string = getenv("DB_CON");

if (empty($connection_string)) {
    throw new \RuntimeException("Invalid connection string!", 500);
}

$pdo = new PDO($connection_string);

echo "Creating lobbies table \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS lobbies (
    id SERIAL PRIMARY KEY,
    lobby_code VARCHAR(5) NOT NULL,
    time_to_die TIMESTAMPTZ NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted TIMESTAMPTZ
);");

echo "Creating kingdom_players table \n";
$pdo->exec("CREATE TABLE IF NOT EXISTS kingdom_players (
    id SERIAL PRIMARY KEY,
    lobby_id INT NOT NULL REFERENCES lobbies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_leader BOOLEAN NOT NULL DEFAULT FALSE,
    authorization_token VARCHAR(255) NOT NULL UNIQUE
);");

echo "Adding lobby_id to kingdoms table \n";
$pdo->exec("ALTER TABLE kingdoms ADD COLUMN IF NOT EXISTS lobby_id INT UNIQUE REFERENCES lobbies(id) ON DELETE SET NULL;");

echo "Lobby and player migrations completed successfully! \n";
