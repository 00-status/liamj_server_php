<?php

namespace Lib\WeaponMaker\Infrastructure;

use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Lib\WeaponMaker\Service\GetWeaponService;
use Slim\Routing\RouteCollectorProxy;

class WeaponMakerRoutes
{
    public static function WeaponMakerRoutes(
        RouteCollectorProxy $app,
        ContainerInterface $container,
        bool $is_dev_env
    ): void {
        $app->get('weapon_effects', function (Request $request, Response $response, $args) use ($container) {
            $weapon_list = $container->get(GetWeaponService::class)->getWeapons();
        
            $response->getBody()->write(json_encode($weapon_list));

            return $response;
        });
        
        if ($is_dev_env) {
            $app->post('weapon_effects', function (Request $request, Response $response, $args) use ($container) {
                $body_raw = $request->getBody()->getContents();
                $weapon_effect_array = json_decode($body_raw, true);
                $weapon_effect = WeaponEffect::fromArray($weapon_effect_array);
            
                $result = $container->get(PostWeaponEffectService::class)->saveWeaponEffect($weapon_effect);
                $response->getBody()->write(json_encode($result));

                return $response;
            });
            
            $app->put('weapon_effects/{id}', function (Request $request, Response $response, $args) use ($container) {    
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
                $response->getBody()->write(json_encode($result));

                return $response;
            });
        }
        
        $app->get('generate_weapon', function (Request $request, Response $response, $args) use ($container) {
            $params = $request->getQueryParams();
            $rarity = $params['rarity'] ?? "Rare";
        
            $result = $container->get(GenerateWeaponService::class)->generateWeapon($rarity);
            $response->getBody()->write(json_encode($result));

            return $response;
        });
    }
}
