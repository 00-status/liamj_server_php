<?php

namespace Lib\Kingdom\Infrastructure;

use DI\ContainerBuilder;
use Lib\Kingdom\Infrastructure\Contexts\KingdomDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\PusherContext;

use Lib\Kingdom\Domain\KingdomGenerator;
use Lib\Kingdom\Domain\RandomRegionTemplateSelector;
use Lib\Kingdom\Domain\RegionTemplateSelectorInterface;
use Lib\Kingdom\Service\Kingdom\ReadKingdomService;
use Lib\Kingdom\Service\Kingdom\ReadKingdomsService;
use Lib\Kingdom\Service\Kingdom\GenerateKingdomService;
use Lib\Kingdom\Service\Kingdom\DeleteKingdomService;

use Lib\Kingdom\Service\Region\ReadRegionsService;
use Lib\Kingdom\Service\Region\CreateRegionService;
use Lib\Kingdom\Service\Region\UpdateRegionService;
use Lib\Kingdom\Service\Region\DeleteRegionService;

use Lib\Kingdom\Service\RegionTemplate\ReadRegionTemplatesService;
use Lib\Kingdom\Service\RegionTemplate\CreateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\UpdateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\DeleteRegionTemplateService;

use Lib\Kingdom\Service\Lobby\CreateLobbyService;
use Lib\Kingdom\Service\Lobby\ReadLobbyService;
use Lib\Kingdom\Service\Lobby\CreateKingdomPlayerService;
use Lib\Kingdom\Service\Lobby\ReadKingdomPlayerService;
use Lib\Kingdom\Service\Lobby\AuthorizeKingdomPlayerService;

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
            LobbyDbContext::class => autowire(),
            KingdomPlayerDbContext::class => autowire(),
            PusherContext::class => autowire(),

            // Pusher SDK Client
            \Pusher\Pusher::class => function () {
                $app_id = getenv("WEBSOCKET_APP_ID");
                $key = getenv("WEBSOCKET_KEY");
                $secret = getenv("WEBSOCKET_SECRET");
                $cluster = "us3";

                if (empty($app_id) || empty($key) || empty($secret)) {
                    // Return a Pusher instance with dummy credentials so dependencies
                    // instantiate cleanly and tests/local-dev do not crash on boot.
                    return new \Pusher\Pusher(
                        "dummy_key",
                        "dummy_secret",
                        "dummy_app_id",
                        ['cluster' => $cluster]
                    );
                }

                return new \Pusher\Pusher($key, $secret, $app_id, ['cluster' => $cluster]);
            },

            // Lobby Services
            CreateLobbyService::class => autowire(),
            ReadLobbyService::class => autowire(),
            CreateKingdomPlayerService::class => autowire(),
            ReadKingdomPlayerService::class => autowire(),
            AuthorizeKingdomPlayerService::class => autowire(),

            // Kingdom Generator Domain & Strategy
            RegionTemplateSelectorInterface::class => autowire(RandomRegionTemplateSelector::class),
            RandomRegionTemplateSelector::class => autowire(),
            KingdomGenerator::class => autowire(),

            // Kingdom Services
            ReadKingdomsService::class => autowire(),
            ReadKingdomService::class => autowire(),
            GenerateKingdomService::class => autowire(),
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
