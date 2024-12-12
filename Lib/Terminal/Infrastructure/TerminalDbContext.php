<?php

namespace Lib\Terminal\Infrastructure;

use Lib\PdoDbContext;

class TerminalDbContext extends PdoDbContext
{
    private const TERMINAL_SERVER = 'terminal_servers';
    private const TERMINAL_DIRECTORIES = 'terminal_directories';
    private const TERMINAL_FILES = 'terminal_files';

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
