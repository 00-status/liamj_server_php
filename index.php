<?php

use Lib\API\ErrorMiddlewareInjector;
use Lib\WeaponMaker\Infrastructure\WeaponMakerRoutes;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;

require __DIR__ . '/vendor/autoload.php';

$is_dev_env = $_ENV["SERVER_ENVIRONMENT"] === "dev";

$app = AppFactory::create();

ErrorMiddlewareInjector::injectErrorMiddleware($app);

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
