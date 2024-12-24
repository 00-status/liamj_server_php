<?php

namespace Lib\Terminal\Infrastructure\Contexts;

use DomainException;
use Lib\PdoDbContext;
use Lib\Terminal\Domain\Server;

class TerminalServerDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'terminal_servers';

    public function insertServer(Server $server): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $server->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert ID!", 500);
        }

        return (int) $inserted_id;
    }

    /**
     * @return Server[]
     */
    public function fetchServers(): array
    {
        $server_array = $this->fetchAll(self::TABLE_NAME);

        return array_map([Server::class, "fromArray"], $server_array);
    }

    public function fetchServer(int $server_id): ?Server
    {
        return $this->fetchById(self::TABLE_NAME, $server_id);
    }

    public function updateServer(Server $server): bool
    {
        $result = $this->update(self::TABLE_NAME, $server->toDb(), $server->getId());
        return (bool) $result;
    }

    public function deleteServer(int $id): bool
    {
        return $this->delete(self::TABLE_NAME, $id);
    }
}
