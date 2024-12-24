<?php

namespace Lib\Terminal\Infrastructure;

use DI\ContainerBuilder;
use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;
use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;
use Lib\Terminal\Infrastructure\Contexts\TerminalServerDbContext;
use Lib\Terminal\Service\Directories\CreateDirectoryService;
use Lib\Terminal\Service\Directories\DeleteDirectoryService;
use Lib\Terminal\Service\Directories\ReadDirectoriesService;
use Lib\Terminal\Service\Directories\UpdateDirectoryService;
use Lib\Terminal\Service\Files\CreateFileService;
use Lib\Terminal\Service\Files\DeleteFileService;
use Lib\Terminal\Service\Files\ReadFilesService;
use Lib\Terminal\Service\Files\UpdateFileService;
use Lib\Terminal\Service\Server\CreateServerService;
use Lib\Terminal\Service\Server\DeleteServerService;
use Lib\Terminal\Service\Server\ReadServerService;
use Lib\Terminal\Service\Server\UpdateServerService;
use function DI\autowire;

class TerminalContainerBuilder
{
    public static function addDependencies(ContainerBuilder $container_builder): void
    {
        $container_builder->addDefinitions([
            TerminalServerDbContext::class => autowire(),
            TerminalDirectoriesDbContext::class => autowire(),
            TerminalFilesDbContext::class => autowire(),

            CreateServerService::class => autowire(),
            ReadServerService::class => autowire(),
            UpdateServerService::class => autowire(),
            DeleteServerService::class => autowire(),

            CreateDirectoryService::class => autowire(),
            ReadDirectoriesService::class => autowire(),
            UpdateDirectoryService::class => autowire(),
            DeleteDirectoryService::class => autowire(),

            CreateFileService::class => autowire(),
            ReadFilesService::class => autowire(),
            UpdateFileService::class => autowire(),
            DeleteFileService::class => autowire(),
        ]);
    }
}
