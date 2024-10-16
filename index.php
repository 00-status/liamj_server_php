<?php
use Lib\WeaponMaker\Service\GetWeaponService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$app->redirect("/{any}", "/");
$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->get('/api/1/test', function (Request $request, Response $response, $args) {
    $service = new GetWeaponService();

    $response->getBody()->write($service->getWeapon());
    return $response;
});

$app->run();