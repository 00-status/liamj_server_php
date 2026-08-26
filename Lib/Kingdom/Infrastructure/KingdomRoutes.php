<?php

namespace Lib\Kingdom\Infrastructure;

use Lib\API\ResponseHelper;
use Lib\Kingdom\Domain\Entity\Region;
use Lib\Kingdom\Domain\Entity\RegionTemplate;
use Lib\Kingdom\Domain\Entity\TileTemplate;
use Lib\Kingdom\Domain\Entity\KingdomGenerationConfig;
use Lib\Kingdom\Service\Kingdom\ReadKingdomService;
use Lib\Kingdom\Service\Kingdom\ReadKingdomsService;
use Lib\Kingdom\Service\Kingdom\GenerateKingdomService;
use Lib\Kingdom\Service\Kingdom\DeleteKingdomService;

use Lib\Kingdom\Service\Lobby\DeleteLobbyService;
use Lib\Kingdom\Service\Lobby\ReadKingdomPlayersService;
use Lib\Kingdom\Service\Region\ReadRegionsService;
use Lib\Kingdom\Service\Region\CreateRegionService;
use Lib\Kingdom\Service\Region\UpdateRegionService;
use Lib\Kingdom\Service\Region\DeleteRegionService;
use Lib\Kingdom\Service\RegionTemplate\ReadRegionTemplatesService;
use Lib\Kingdom\Service\RegionTemplate\CreateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\UpdateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\DeleteRegionTemplateService;

use Lib\Kingdom\Service\Lobby\CreateLobbyService;
use Lib\Kingdom\Service\Lobby\ReadLobbyService;
use Lib\Kingdom\Service\Lobby\CreateKingdomPlayerService;
use Lib\Kingdom\Service\Lobby\AuthorizeKingdomPlayerService;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class KingdomRoutes
{
    public static function addRoutes(RouteCollectorProxy $app, ContainerInterface $container, bool $is_dev_env): void
    {
        $app->post('lobby', self::postLobby($container));
        $app->get('lobby', self::getLobby($container));

        $app->post('kingdom_player', self::postKingdomPlayer($container));
        $app->get('kingdom_players', self::getKingdomPlayers($container));

        $app->post('lobby/authz', self::postLobbyAuthz($container));

        $app->get('kingdoms', self::getKingdoms($container));
        $app->get('kingdoms/{id}', self::getKingdom($container));
        $app->post('kingdoms/generate', self::postGenerateKingdom($container));

        $app->get('regions', self::getRegions($container));
        $app->get('region_templates', self::getRegionTemplates($container));

        // Dev only routes
        if ($is_dev_env) {
            $app->delete('lobby/{lobby_code}', self::deleteLobby($container));

            $app->delete('kingdoms/{id}', self::deleteKingdom($container));

            $app->post('regions', self::postRegion($container));
            $app->put('regions/{id}', self::putRegion($container));
            $app->delete('regions/{id}', self::deleteRegion($container));

            $app->post('region_templates', self::postRegionTemplate($container));
            $app->put('region_templates/{id}', self::putRegionTemplate($container));
            $app->delete('region_templates/{id}', self::deleteRegionTemplate($container));
        }
    }

    private static function postLobby(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $lobby = $container->get(CreateLobbyService::class)->createLobby();
            return ResponseHelper::writeResponse($response, $lobby, 201);
        };
    }

    private static function getLobby(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $lobby_code = $request->getQueryParams()['lobby_code'] ?? null;
            if (empty($lobby_code)) {
                throw new HttpBadRequestException($request, "Must supply a lobby_code!");
            }

            $lobby = $container->get(ReadLobbyService::class)->readLobbyByCode((string) $lobby_code);
            return ResponseHelper::writeResponse($response, $lobby, 200);
        };
    }

    private static function deleteLobby(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $lobby_code = $args["lobby_code"] ?? null;
            if (empty($lobby_code)) {
                throw new HttpBadRequestException($request, "Must supply a lobby_code!");
            }

            $container->get(DeleteLobbyService::class)->deleteLobby((string) $lobby_code);
            return ResponseHelper::writeResponse($response, [], 204);
        };
    }

    private static function postKingdomPlayer(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $params = $request->getQueryParams();
            $body_raw = $request->getBody()->getContents();
            $body = json_decode($body_raw, true) ?? [];

            $lobby_code = $params['lobby_code'] ?? $body['lobby_code'] ?? null;
            $player_name = $params['player_name'] ?? $body['player_name'] ?? null;

            if (empty($lobby_code)) {
                throw new HttpBadRequestException($request, "Must supply a lobby_code!");
            }

            $player = $container->get(CreateKingdomPlayerService::class)->createPlayer(
                (string) $lobby_code,
                (string) $player_name
            );
            return ResponseHelper::writeResponse($response, $player, 201);
        };
    }

    private static function getKingdomPlayers(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $lobby_code = $request->getQueryParams()['lobby_code'] ?? null;
            if (empty($lobby_code)) {
                throw new HttpBadRequestException($request, "Must supply a lobby_code!");
            }

            $player = $container->get(ReadKingdomPlayersService::class)->readPlayers($lobby_code);
            return ResponseHelper::writeResponse($response, $player, 200);
        };
    }

    private static function postLobbyAuthz(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $body = $request->getParsedBody() ?? [];

            $authz_token = $body['authz_token'] ?? null;
            $channel_name = $body['channel_name'] ?? null;
            $socket_id = $body['socket_id'] ?? null;
            $lobby_code = $body['lobby_code'] ?? null;

            if (empty($authz_token) || empty($channel_name) || empty($socket_id) || empty($lobby_code)) {
                throw new HttpBadRequestException($request, "Must supply authz_token, channel_name, socket_id, and lobby_code!");
            }

            $auth_response = $container->get(AuthorizeKingdomPlayerService::class)->authorizePlayer(
                (string) $authz_token,
                (string) $lobby_code,
                (string) $channel_name,
                (string) $socket_id
            );

            return ResponseHelper::writeResponse($response, $auth_response, 200);
        };
    }

    private static function getKingdoms(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $kingdoms = $container->get(ReadKingdomsService::class)->readKingdoms();
            return ResponseHelper::writeResponse($response, $kingdoms, 200);
        };
    }


    private static function getKingdom(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $id = $args["id"] ?? null;

            $kingdom = $container->get(ReadKingdomService::class)->readKingdom($id);

            return ResponseHelper::writeResponse($response, $kingdom, 200);
        };
    }

    private static function postGenerateKingdom(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $body_raw = $request->getBody()->getContents();
            $data = json_decode($body_raw, true) ?? [];

            $lobby_code = isset($data['lobby_code']) ? (string) $data['lobby_code'] : null;
            $authz_token = isset($data['authz_token']) ? (string) $data['authz_token'] : null;

            $config = new KingdomGenerationConfig(
                name: (string) ($data['name'] ?? 'New Kingdom'),
                width: (int) ($data['width'] ?? 50),
                height: (int) ($data['height'] ?? 50),
                step: (int) ($data['step'] ?? 10),
                jitter: (int) ($data['jitter'] ?? 2),
                seed: isset($data['seed']) ? (int) $data['seed'] : null,
            );

            $kingdom = $container->get(GenerateKingdomService::class)->generateKingdom($config, $lobby_code, $authz_token);

            return ResponseHelper::writeResponse($response, $kingdom, 201);
        };
    }

    private static function deleteKingdom(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $id = $args["id"] ?? null;
            if (empty($id)) {
                throw new HttpBadRequestException($request, "Must supply Kingdom ID!");
            }

            $success = $container->get(DeleteKingdomService::class)->deleteKingdom((int) $id);
            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }

    private static function getRegions(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $kingdom_id = $request->getQueryParams()["kingdom_id"] ?? null;
            if (empty($kingdom_id)) {
                throw new HttpBadRequestException($request, "Must supply a Kingdom ID!");
            }

            $regions = $container->get(ReadRegionsService::class)->readRegions((int) $kingdom_id);
            return ResponseHelper::writeResponse($response, $regions, 200);
        };
    }

    private static function postRegion(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $body_raw = $request->getBody()->getContents();
            $data = json_decode($body_raw, true);

            $region = Region::fromArray($data);
            $created_region = $container->get(CreateRegionService::class)->createRegion($region);

            return ResponseHelper::writeResponse($response, $created_region, 201);
        };
    }

    private static function putRegion(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $id = $args["id"] ?? null;
            if (empty($id)) {
                throw new HttpBadRequestException($request, "Must supply Region ID!");
            }

            $body_raw = $request->getBody()->getContents();
            $data = json_decode($body_raw, true);
            $data["id"] = (int) $id;

            $region = Region::fromArray($data);
            $success = $container->get(UpdateRegionService::class)->updateRegion($region);

            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }

    private static function deleteRegion(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $id = $args["id"] ?? null;
            if (empty($id)) {
                throw new HttpBadRequestException($request, "Must supply Region ID!");
            }

            $success = $container->get(DeleteRegionService::class)->deleteRegion((int) $id);
            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }

    private static function getRegionTemplates(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $templates = $container->get(ReadRegionTemplatesService::class)->readRegionTemplates();
            return ResponseHelper::writeResponse($response, $templates, 200);
        };
    }

    private static function postRegionTemplate(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $body_raw = $request->getBody()->getContents();
            $data = json_decode($body_raw, true);

            $tile_templates_data = $data['tile_templates'] ?? [];
            $tile_templates = array_map(function (array $tile_data) {
                return TileTemplate::fromArray($tile_data);
            }, $tile_templates_data);

            $template = RegionTemplate::fromArray($data, $tile_templates);
            $created_template = $container->get(CreateRegionTemplateService::class)->createRegionTemplate($template);

            return ResponseHelper::writeResponse($response, $created_template, 201);
        };
    }

    private static function putRegionTemplate(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $id = $args["id"] ?? null;
            if (empty($id)) {
                throw new HttpBadRequestException($request, "Must supply Region Template ID!");
            }

            $body_raw = $request->getBody()->getContents();
            $data = json_decode($body_raw, true);
            $data["id"] = (int) $id;

            $tile_templates_data = $data['tile_templates'] ?? [];
            $tile_templates = array_map(function (array $tile_data) use ($id) {
                $tile_data['region_template_id'] = (int) $id;
                return TileTemplate::fromArray($tile_data);
            }, $tile_templates_data);

            $template = RegionTemplate::fromArray($data, $tile_templates);
            $success = $container->get(UpdateRegionTemplateService::class)->updateRegionTemplate($template);

            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }

    private static function deleteRegionTemplate(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $id = $args["id"] ?? null;
            if (empty($id)) {
                throw new HttpBadRequestException($request, "Must supply Region Template ID!");
            }

            $success = $container->get(DeleteRegionTemplateService::class)->deleteRegionTemplate((int) $id);
            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }
}
