<?php

use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Infrastructure\GoogleGeminiApiClient;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\GetWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$is_dev_env = $_ENV["SERVER_ENVIRONMENT"] === "dev";

$app = AppFactory::create();

$customErrorHandler = function (
    Request $request,
    Throwable $exception,
    bool $display_error_details,
    bool $log_errors,
    bool $log_error_details
) use ($app) {
        $response = $app
            ->getResponseFactory()
            ->createResponse();

        $response
            ->getBody()
            ->write(json_encode(['error' => $exception->getMessage()]));
        
        return $response->withStatus($exception->getCode());
};

$error_middleware = $app->addErrorMiddleware($is_dev_env, false, false);
$error_middleware->setDefaultErrorHandler($customErrorHandler);

// API Routes
$app->get('/api/1/weapon_effects', function (Request $request, Response $response, $args) {
    $weapon_list = (new GetWeaponService())->getWeapons();

    $response->getBody()->write(json_encode($weapon_list));

    $response = $response->withHeader("Content-Type", "application/json");
    return $response;
});

$app->post('/api/1/weapon_effects', function (Request $request, Response $response, $args) {
    $body_raw = $request->getBody()->getContents();
    $weapon_effect_array = json_decode($body_raw, true);
    $weapon_effect = WeaponEffect::fromArray($weapon_effect_array);

    $db = new WeaponEffectDbContext();
    $service = new PostWeaponEffectService($db);

    $result = $service->saveWeaponEffect($weapon_effect);
    $response->getBody()->write(json_encode($result));

    $response = $response->withHeader("Content-Type", "application/json");
    return $response;
});

$app->put('/api/1/weapon_effects/{id}', function (Request $request, Response $response, $args) {    
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

    $response = $response->withHeader("Content-Type", "application/json");
    return $response;
});

$app->get('/api/1/generate_weapon', function (Request $request, Response $response, $args) {
    $params = $request->getQueryParams();
    $rarity = $params['rarity'] ?? "Rare";

    // TODO: Consider a DI to handle dependencies for us.
    $db = new WeaponEffectDbContext();
    $gemini_client = new GoogleGeminiApiClient();
    $service = new GenerateWeaponService($db, $gemini_client);

    $result = $service->generateWeapon($rarity);
    $response->getBody()->write(json_encode($result));

    $response = $response->withHeader("Content-Type", "application/json");
    return $response;
});

// Site Routes
$app->get('/{routes:.+}', function ($request, $response, $args) {
    $index_page = __DIR__ . '/public/index.html';
    $response->getBody()->write(file_get_contents($index_page));

    return $response;
});

$app->get('/', function (Request $request, Response $response, $args) {
    $index_page = __DIR__ . '/public/index.html';
    $response->getBody()->write(file_get_contents($index_page));

    return $response;
});

$app->run();
