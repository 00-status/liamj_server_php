<?php

namespace Lib\Terminal\Infrastructure;

use DI\ContainerBuilder;
use Lib\Terminal\Service\CreateServerService;
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
        ]);
    }
}
