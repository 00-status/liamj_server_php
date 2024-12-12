<?php

namespace Lib\Terminal\Infrastructure;

use DomainException;
use Lib\PdoDbContext;
use Lib\Terminal\Domain\Server;

class TerminalServerDbContext extends PdoDbContext
{
    private const TERMINAL_SERVER = 'terminal_servers';

    public function insertServer(Server $server): int
    {
        $inserted_id = $this->save(self::TERMINAL_SERVER, $server->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert ID!", 500);
        }

        return (int) $inserted_id;
    }

    // Create, Read, Update, Delete

    // Create Directory
    //      If terminal_server exists
    //          create new directory

    // Create File
    //      If terminal_directory exists.
    //          create new file

    // Read Server
    //      select server by ID.
    //      Select all directories for that server.
    //      Gather up all directory IDs.
    //      Select all files by directory IDs.
    //      Key the files by directory ID.
    //      For each directory
    //          attach each file "bucket" to their associated directory.
    // TODO: Create a separate file context

}
