<?php 

namespace Lib\API;

use Psr\Container\ContainerInterface;
use DI\ContainerBuilder;
use Lib\WeaponMaker\Infrastructure\BaseWeaponContext;
use Lib\WeaponMaker\Infrastructure\GoogleGeminiApiClient;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\GetWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use function DI\autowire;

class ContainerBuilderWrapper
{
    public static function getContainer(): ContainerInterface
    {
        $container_builder = new ContainerBuilder();
        $container_builder->addDefinitions([
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
