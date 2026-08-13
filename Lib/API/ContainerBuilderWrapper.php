<?php 

namespace Lib\API;

use Lib\PdoDbContext;
use Lib\Terminal\Infrastructure\TerminalContainerBuilder;
use Lib\Kingdom\Infrastructure\KingdomContainerBuilder;
use Psr\Container\ContainerInterface;
use DI\ContainerBuilder;
use Lib\WeaponMaker\Infrastructure\BaseWeaponContext;
use Lib\WeaponMaker\Infrastructure\GoogleGeminiApiClient;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\GetWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use PDO;
use function DI\autowire;

class ContainerBuilderWrapper
{
    public static function getContainer(): ContainerInterface
    {
        $container_builder = new ContainerBuilder();

        TerminalContainerBuilder::addDependencies($container_builder);
        KingdomContainerBuilder::addDependencies($container_builder);

        $container_builder->addDefinitions([
            PDO::class => function () {
                $connection_string = getenv("DB_CON");

                if (empty($connection_string)) {
                    throw new \RuntimeException("Invalid connection string!", 500);
                }

                $pdo = new PDO($connection_string);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $pdo;
            },

            PdoDbContext::class => autowire(),
            
            WeaponEffectDbContext::class => autowire(),
            BaseWeaponContext::class => autowire(),
            GoogleGeminiApiClient::class => autowire(),
        
            GenerateWeaponService::class => autowire(),
            GetWeaponService::class => autowire(),
            PostWeaponEffectService::class => autowire(),
            PutWeaponEffectService::class => autowire(),
        ]);
        
        return $container_builder->build();
    }
}
