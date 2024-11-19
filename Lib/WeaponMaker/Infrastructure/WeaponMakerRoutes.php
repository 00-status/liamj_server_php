<?php

namespace Lib\WeaponMaker\Infrastructure;

use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Lib\WeaponMaker\Service\GetWeaponService;
use Slim\Routing\RouteCollectorProxy;

class WeaponMakerRoutes
{
    public static function WeaponMakerRoutes(RouteCollectorProxy $app, bool $is_dev_env): void
    {
        $app->get('weapon_effects', function (Request $request, Response $response, $args) {
            $weapon_list = (new GetWeaponService())->getWeapons();
        
            $response->getBody()->write(json_encode($weapon_list));

            return $response;
        });
        
        if ($is_dev_env) {
            $app->post('weapon_effects', function (Request $request, Response $response, $args) {
                $body_raw = $request->getBody()->getContents();
                $weapon_effect_array = json_decode($body_raw, true);
                $weapon_effect = WeaponEffect::fromArray($weapon_effect_array);
            
                $db = new WeaponEffectDbContext();
                $service = new PostWeaponEffectService($db);
            
                $result = $service->saveWeaponEffect($weapon_effect);
                $response->getBody()->write(json_encode($result));

                return $response;
            });
            
            $app->put('weapon_effects/{id}', function (Request $request, Response $response, $args) {    
                if (empty($args["id"])) {
                    $response = $response->withStatus(400, "Must supply ID!");
                    return $response;
                }
            
                $id = (int) (!empty($args["id"]) ? $args["id"] : 0);
                
                $body_raw = $request->getBody()->getContents();
                $weapon_effect_array = json_decode($body_raw, true);
                $weapon_effect_array["id"] = $id;
            
                $weapon_effect = WeaponEffect::fromArray($weapon_effect_array);
            
                $db = new WeaponEffectDbContext();
                $service = new PutWeaponEffectService($db);
            
                $result = $service->updateWeaponEffect($weapon_effect);
                $response->getBody()->write(json_encode($result));

                return $response;
            });
        }
        
        $app->get('generate_weapon', function (Request $request, Response $response, $args) {
            $params = $request->getQueryParams();
            $rarity = $params['rarity'] ?? "Rare";
        
            // TODO: Consider a DI to handle dependencies for us.
            $db = new WeaponEffectDbContext();
            $gemini_client = new GoogleGeminiApiClient();
            $service = new GenerateWeaponService($db, $gemini_client);
        
            $result = $service->generateWeapon($rarity);
            $response->getBody()->write(json_encode($result));

            return $response;
        });
    }
}
