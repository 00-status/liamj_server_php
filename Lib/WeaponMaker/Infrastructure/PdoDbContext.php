<?php

namespace Lib\WeaponMaker\Infrastructure;

use Exception;
use PDO;
use PDOException;

abstract class PdoDbContext
{
    private PDO $pdo;

    public function __construct()
    {
        $connection_string = __DIR__ . "/../../../secrets/db_connection_string.txt";

        if (!file_exists($connection_string)) {
            throw new Exception("Invalid connection string!");
        }

        $dsn = file_get_contents( $connection_string);

        try {
            $this->pdo = new PDO($dsn);
        } catch (PDOException $exception) {
            die($exception->getMessage());
        }

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    protected function fetchAll(string $table): array
    {
        $stmt = $this->pdo->query("SELECT * FROM $table");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'convertArrays'], $results);
    }

    protected function fetchById(string $table, int $id): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM $table WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            return null;
        }

        return $this->convertArrays($result);
    }

    protected function save($table, array $data): bool | string
    {
        $columns = implode(', ', array_keys($data));
        $values = ':' . implode(', :', array_keys($data));
        $sql = "INSERT INTO $table ($columns) VALUES ($values)";

        $stmt = $this->pdo->prepare($sql);
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        $stmt->execute();
        return $this->pdo->lastInsertId();
    }

    protected function update($table, array $data, int $id): bool
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
        }

        $fields = implode(', ', $fields);
        $sql = "UPDATE $table SET $fields WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    private function parsePostgresArray(string $postgresArray): array
    {
        $trimmed = trim($postgresArray, '{}');
        if (empty($trimmed)) {
            return [];
        }

        return explode(',', $trimmed);
    }

    private function convertArrays($data)
    {
        foreach ($data as $key => $value) {
            if (is_string($value) && preg_match('/^{.*}$/', $value)) {
                $data[$key] = $this->parsePostgresArray($value);
            }
        }
        return $data;
    }
}
