<?php

namespace Lib\WeaponMaker\Infrastructure;

use Lib\API\ResponseHelper;
use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use Lib\WeaponMaker\Service\GetWeaponService;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;

class WeaponMakerRoutes
{
    public static function addRoutes(RouteCollectorProxy $app, ContainerInterface $container, bool $is_dev_env): void
    {
        $app->get('weapon_effects', self::getWeaponEffects($container));

        if ($is_dev_env) {
            $app->post('weapon_effects', self::postWeaponEffect($container));
            $app->put('weapon_effects/{id}', self::putWeaponEffect($container));
        }

        $app->get('generate_weapon', self::generateWeapon($container));
    }

    private static function getWeaponEffects(ContainerInterface $container)
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $weapon_list = $container->get(GetWeaponService::class)->getWeapons();
            return ResponseHelper::writeResponse($response, $weapon_list, 200);
        };
    }

    private static function postWeaponEffect(ContainerInterface $container)
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $body_raw = $request->getBody()->getContents();
            $weapon_effect_array = json_decode($body_raw, true);
            $weapon_effect = WeaponEffect::fromArray($weapon_effect_array);
            
            $result = $container->get(PostWeaponEffectService::class)->saveWeaponEffect($weapon_effect);
            return ResponseHelper::writeResponse($response, $result, 201);
        };
    }

    private static function putWeaponEffect(ContainerInterface $container)
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $id = $args["id"];
            if (empty($id)) {
                $response = $response->withStatus(400, "Must supply ID!");
                return $response;
            }
            
            $body_raw = $request->getBody()->getContents();
            $weapon_effect_array = json_decode($body_raw, true);
            $weapon_effect_array["id"] = (int) $id;
            
            $weapon_effect = WeaponEffect::fromArray($weapon_effect_array);
            
            $result = $container->get(PutWeaponEffectService::class)->updateWeaponEffect($weapon_effect);
            return ResponseHelper::writeResponse($response, $result, 200);
        };
    }

    private static function generateWeapon(ContainerInterface $container)
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $params = $request->getQueryParams();
            $rarity = $params['rarity'] ?? "Rare";
        
            $result = $container->get(GenerateWeaponService::class)->generateWeapon($rarity);
            return ResponseHelper::writeResponse($response, $result, 200);
        };
    }
}
