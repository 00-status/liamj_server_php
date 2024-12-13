<?php

namespace Lib;

use PDO;
use PDOException;

abstract class PdoDbContext
{
    protected PDO $pdo;

    public function __construct()
    {
        $connection_string = $_ENV["DB_CON"];

        if (empty($connection_string)) {
            throw new \RuntimeException("Invalid connection string!", 500);
        }

        try {
            $this->pdo = new PDO($connection_string);
        } catch (PDOException $exception) {
            throw new \RuntimeException($exception->getMessage(), 500);
        }

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    protected function fetchAll(string $table): array
    {
        $stmt = $this->pdo->query("SELECT * FROM $table ORDER BY id ASC");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'convertArrays'], $results);
    }

    /**
     * @param string $table
     * @param string $column_name
     * @param int[]|string[] $ids
     * @return array
     */
    protected function fetchAllByIds(string $table, string $column_name, array $ids): array
    {
        $ids_string = implode(",", $ids);
        $statement = $this->pdo->query("SELECT * FROM $table WHERE $column_name in ($ids_string)");
        
        $results = $statement->fetchAll(PDO::FETCH_ASSOC);

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

    private function delete(string $table, int $id): bool
    {
        $sql = "DELETE FROM $table WHERE id = $id";
        $statement = $this->pdo->prepare($sql);
        
        return $statement->execute();
    }

    private function parsePostgresArray(string $postgres_array): array
    {
        $trimmed = trim($postgres_array, '{}');

        if (empty($trimmed)) {
            return [];
        }

        // TODO: Use snake_case values in the DB instead of Normal Case values.
        // The Normal Case values come with quotes that we have to trim out.
        $words = explode(',', $trimmed);
        return array_map(function ($word) {
            return trim($word, '""');
        }, $words);
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
