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

use Lib\Kingdom\Service\Region\ReadRegionsService;
use Lib\Kingdom\Service\Region\CreateRegionService;
use Lib\Kingdom\Service\Region\UpdateRegionService;
use Lib\Kingdom\Service\Region\DeleteRegionService;
use Lib\Kingdom\Service\RegionTemplate\ReadRegionTemplatesService;
use Lib\Kingdom\Service\RegionTemplate\CreateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\UpdateRegionTemplateService;
use Lib\Kingdom\Service\RegionTemplate\DeleteRegionTemplateService;

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
        $app->get('kingdom_player', self::getKingdomPlayer($container));

        $app->post('lobby/authz', self::postLobbyAuthz($container)); // Authenticates with websocket server.

        $app->get('kingdoms', self::getKingdoms($container));
        $app->get('kingdoms/{id}', self::getKingdom($container));

        $app->get('regions', self::getRegions($container));
        $app->get('region_templates', self::getRegionTemplates($container));

        // Dev only routes
        if ($is_dev_env) {
            $app->post('kingdoms/generate', self::postGenerateKingdom($container));
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
            // Call the CreateKingdomLobbyService
            //      If we are at maximum lobby capacity (2)
            //          Throw a new Forbidden error
            //      If there are expired lobbies
            //          Delete them.
            //      Create a new lobby.
            //      Return the new Lobby.
            return ResponseHelper::writeResponse($response, null, 200);
        };
    }

    private static function getLobby(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            // Get the lobby_code from the request.
            // Call the ReadLobbyService
            //      If the lobby_code matches an exisitng lobby.
            //          Return the Lobby
            //      Else
            //      throw a NotFound error.
            return ResponseHelper::writeResponse($response, null, 200);
        };
    }

    private static function postKingdomPlayer(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            // Get the lobby_code and player_name from the request.
            // Call the CreateKingdomPlayerService
            //      If the Lobby is full OR the requested patron name is already taken.
            //          Throw a Conflict 409 error.
            //      Else
            //          Create a new KingdomPlayer for that Lobby.
            //          Return the newly created KingdomPlayer
            return ResponseHelper::writeResponse($response, null, 200);
        };
    }

    private static function getKingdomPlayer(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            // Get the authorization_token from the request
            // Call the ReadKingdomPlayerService
            //      If the provided authz_token matches an existing player.
            //          return that KingdomPlayer.
            return ResponseHelper::writeResponse($response, null, 200);
        };
    }

    private static function postLobbyAuthz(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            // Pull the channel_name, socket_id, lobby_code, and authorization_token from the request.
            // Call the AuthorizeKingdomPlayerService
            //      If the authz_token matches a player belonging to that lobby.
            //          return true.
            //      else
            //          return false.
            // If result is false
            //      respond with 403 HTTP status.
            // else
            //      authorize with private lobby using the socket_id and channel_name given in the request.
            //      respond with 200 HTTP status and provide authorization token in response body.
            return ResponseHelper::writeResponse($response, null, 200);
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

            $config = new KingdomGenerationConfig(
                name: (string) ($data['name'] ?? 'New Kingdom'),
                width: (int) ($data['width'] ?? 50),
                height: (int) ($data['height'] ?? 50),
                step: (int) ($data['step'] ?? 10),
                jitter: (int) ($data['jitter'] ?? 2),
                seed: isset($data['seed']) ? (int) $data['seed'] : null,
            );

            $kingdom = $container->get(GenerateKingdomService::class)->generateKingdom($config);

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
