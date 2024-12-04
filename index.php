<?php

use DI\ContainerBuilder;
use Lib\API\ErrorMiddlewareInjector;
use Lib\API\JsonMiddleware;
use Lib\WeaponMaker\Infrastructure\BaseWeaponContext;
use Lib\WeaponMaker\Infrastructure\GoogleGeminiApiClient;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use Lib\WeaponMaker\Infrastructure\WeaponMakerRoutes;
use Lib\WeaponMaker\Service\GenerateWeaponService;
use Lib\WeaponMaker\Service\GetWeaponService;
use Lib\WeaponMaker\Service\PostWeaponEffectService;
use Lib\WeaponMaker\Service\PutWeaponEffectService;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use function DI\autowire;

require __DIR__ . '/vendor/autoload.php';

$is_dev_env = $_ENV["SERVER_ENVIRONMENT"] === "dev";

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

$container = $container_builder->build();

AppFactory::setContainer($container);
$app = AppFactory::create();

ErrorMiddlewareInjector::injectErrorMiddleware($app);

$app->group("/api/1/", function (RouteCollectorProxy $group) use ($is_dev_env) {
    WeaponMakerRoutes::WeaponMakerRoutes($group, $this->get(ContainerInterface::class), $is_dev_env);
})->add(new JsonMiddleware());

$app->any("/api/1/{routes:.+}", function ($request, $response, $args) {
    $response
        ->getBody()
        ->write(json_encode(['error' => 'Route not found!']));

    $response = $response->withHeader("Content-Type", "application/json");
    return $response->withStatus(404);
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
