<?php
use Lib\WeaponMaker\Service\GetWeaponService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

// API Routes
$app->get('/api/1/weapon_effects', function (Request $request, Response $response, $args) {
    $weapon_list = (new GetWeaponService())->getWeapons();

    $response->getBody()->write(json_encode($weapon_list));
    $new_response = $response->withHeader("Content-type", "application/json");

    return $new_response;
});

$app->get('/api/1/generate_weapon', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Generate weapon");

    $new_response = $response->withHeader("Content-type", "application/json");

    return $new_response;
});

$app->get('/api/1/test', function (Request $request, Response $response, $args) {
    $response->getBody()->write(phpinfo());

    // $new_response = $response->withHeader("Content-type", "application/json");

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
