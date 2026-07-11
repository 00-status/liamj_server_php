<?php

namespace Lib\Kingdom\Infrastructure;

use DI\ContainerBuilder;
use Lib\Kingdom\Infrastructure\Contexts\KingdomDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

use Lib\Kingdom\Service\Kingdom\ReadKingdomsService;
use Lib\Kingdom\Service\Kingdom\DeleteKingdomService;

use Lib\Kingdom\Service\Region\ReadRegionsService;
use Lib\Kingdom\Service\Region\CreateRegionService;
use Lib\Kingdom\Service\Region\UpdateRegionService;
use Lib\Kingdom\Service\Region\DeleteRegionService;

use Lib\Kingdom\Service\RegionTemplate\ReadRegionTemplatesService;
use Lib\Kingdom\Service\RegionTemplate\CreateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\UpdateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\DeleteRegionTemplateService;

use function DI\autowire;

class KingdomContainerBuilder
{
    public static function addDependencies(ContainerBuilder $container_builder): void
    {
        $container_builder->addDefinitions([
            // DbContexts
            KingdomDbContext::class => autowire(),
            RegionDbContext::class => autowire(),
            TileDbContext::class => autowire(),
            RegionTemplateDbContext::class => autowire(),
            TileTemplateDbContext::class => autowire(),

            // Kingdom Services
            ReadKingdomsService::class => autowire(),
            DeleteKingdomService::class => autowire(),

            // Region Services
            ReadRegionsService::class => autowire(),
            CreateRegionService::class => autowire(),
            UpdateRegionService::class => autowire(),
            DeleteRegionService::class => autowire(),

            // RegionTemplate Services
            ReadRegionTemplatesService::class => autowire(),
            CreateRegionTemplateService::class => autowire(),
            UpdateRegionTemplateService::class => autowire(),
            DeleteRegionTemplateService::class => autowire(),
        ]);
    }
}
