<?php

$connection_string = getenv("DB_CON");

if (empty($connection_string)) {
    throw new \RuntimeException("Invalid connection string!", 500);
}

$pdo = new PDO($connection_string);

echo "Creating TerminalServer \n";

$pdo->exec("CREATE TABLE IF NOT EXISTS terminal_servers ( id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL );");

echo "Creating TerminalDirectory \n";

$pdo->exec("CREATE TABLE IF NOT EXISTS terminal_directories (
    id SERIAL PRIMARY KEY,
    server_id INT REFERENCES terminal_servers(id),
    name VARCHAR(255) NOT NULL,
    date_created TIMESTAMPTZ NOT NULL,
    parent_directory INT,
    sub_directories JSONB
);
");

echo "Creating TerminalFile \n";

$pdo->exec("CREATE TABLE IF NOT EXISTS terminal_files (
    id SERIAL PRIMARY KEY,
    directory_id INT REFERENCES terminal_directories(id),
    name VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    encryption_code VARCHAR(255),
    creator_user_name VARCHAR(255) NOT NULL,
    date_created TIMESTAMPTZ NOT NULL,
    date_modified TIMESTAMPTZ NOT NULL
);
");
