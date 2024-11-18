<?php

use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Infrastructure\GoogleGeminiApiClient;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use Lib\WeaponMaker\Infrastructure\WeaponMakerRoutes;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\GetWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;

require __DIR__ . '/vendor/autoload.php';

$is_dev_env = $_ENV["SERVER_ENVIRONMENT"] === "dev";

$app = AppFactory::create();

$custom_error_handler = function (
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
$error_middleware->setDefaultErrorHandler($custom_error_handler);

$app->group("/api/1/", function (RouteCollectorProxy $group) {
    WeaponMakerRoutes::WeaponMakerRoutes($group);
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
