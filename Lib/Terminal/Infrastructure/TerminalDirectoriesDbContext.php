<?php

namespace Lib\Terminal\Infrastructure;

use Lib\PdoDbContext;

class TerminalDirectoriesDbContext extends PdoDbContext
{
    private const TERMINAL_DIRECTORIES = 'terminal_directories';
}
