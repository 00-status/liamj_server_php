<?php

namespace Lib\Terminal\Infrastructure;

use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Domain\File;
use Lib\Terminal\Domain\Server;
use Lib\Terminal\Service\Directories\CreateDirectoryService;
use Lib\Terminal\Service\Directories\DeleteDirectoryService;
use Lib\Terminal\Service\Directories\ReadDirectoriesService;
use Lib\Terminal\Service\Directories\UpdateDirectoryService;
use Lib\Terminal\Service\Server\CreateServerService;
use Lib\Terminal\Service\Server\DeleteServerService;
use Lib\Terminal\Service\Server\ReadServerService;
use Psr\Container\ContainerInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TerminalRoutes
{
    public static function addRoutes(RouteCollectorProxy $app, ContainerInterface $container, bool $is_dev_env): void
    {
        $app->get('terminal_servers', function (Request $request, Response $response, $args) use ($container) {
            $server_list = $container->get(ReadServerService::class)->readServers();
        
            $response->getBody()->write(json_encode($server_list));
            return $response;
        });

        $app->get('terminal_directories', function (Request $request, Response $response, $args) use ($container) {
            $server_id = $request->getQueryParams()["server_id"] ?? null;

            if (empty($server_id)) {
                throw new HttpBadRequestException($request,"Must supply a server ID!");
            }

            $server_list = $container->get(ReadDirectoriesService::class)->readDirectories((int) $server_id);
        
            $response->getBody()->write(json_encode($server_list));
            return $response;
        });

        if ($is_dev_env) {
            $app->post('terminal_servers', function (Request $request, Response $response, $args) use ($container) {
                $server_array = json_decode($request->getBody()->getContents(), true);
                $server = Server::fromArray($server_array);

                $created_server = $container->get(CreateServerService::class)->createServer($server);

                $response->getBody()->write(json_encode($created_server));
                $response = $response->withStatus(201);

                return $response;
            });

            $app->delete('terminal_servers/{id}', function (Request $request, Response $response, $args) use ($container) {
                $id = $args["id"];

                if (empty($id)) {
                    $response = $response->withStatus(400, "Must supply server ID!");
                    return $response;
                }

                $created_server = $container->get(DeleteServerService::class)->deleteServer($id);

                $response->getBody()->write(json_encode($created_server));
                $response = $response->withStatus(201);

                return $response;
            });

            $app->post('terminal_directories', function (Request $request, Response $response, $args) use ($container) {
                $directory_array = json_decode($request->getBody()->getContents(), true);
                $directory = Directory::fromArray($directory_array);

                $container->get(CreateDirectoryService::class)->createDirectory($directory);
            
                $response = $response->withStatus(204);
                return $response;
            });

            $app->put('terminal_directories', function (Request $request, Response $response, $args) use ($container) {
                $directory_array = json_decode($request->getBody()->getContents(), true);
                $directory = Directory::fromArray($directory_array);

                $success = $container->get(UpdateDirectoryService::class)->updateDirectory($directory);

                return $success
                    ? $response->withStatus(204)
                    : $response->withStatus(500);
            });

            $app->delete('terminal_directories/{id}', function (Request $request, Response $response, $args) use ($container) {
                $id = $args["id"];

                if (empty($id)) {
                    $response = $response->withStatus(400, "Must supply directory ID!");
                    return $response;
                }

                $created_server = $container->get(DeleteDirectoryService::class)->deleteDirectory($id);

                $response->getBody()->write(json_encode($created_server));
                $response = $response->withStatus(201);

                return $response;
            });

            $app->post('terminal_files', function (Request $request, Response $response, $args) use ($container) {
                $file_array = json_decode($request->getBody()->getContents(), true);
                $file = File::fromArray($file_array);
                
                $container->get(CreateServerService::class)->createServer($file);
            
                $response = $response->withStatus(204);
                return $response;
            });
        }
    }
}
