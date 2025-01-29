<?php

namespace Lib\Terminal\Infrastructure;

use Lib\API\ResponseHelper;
use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Domain\File;
use Lib\Terminal\Domain\Server;
use Lib\Terminal\Service\Directories\CreateDirectoryService;
use Lib\Terminal\Service\Directories\DeleteDirectoryService;
use Lib\Terminal\Service\Directories\ReadDirectoriesService;
use Lib\Terminal\Service\Directories\UpdateDirectoryService;
use Lib\Terminal\Service\Files\CreateFileService;
use Lib\Terminal\Service\Files\DeleteFileService;
use Lib\Terminal\Service\Files\ReadFilesService;
use Lib\Terminal\Service\Files\UpdateFileService;
use Lib\Terminal\Service\Server\CreateServerService;
use Lib\Terminal\Service\Server\DeleteServerService;
use Lib\Terminal\Service\Server\ReadServerService;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\Exception\HttpBadRequestException;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// TODO: Use enums for http status codes.
class TerminalRoutes
{
    public static function addRoutes(RouteCollectorProxy $app, ContainerInterface $container, bool $is_dev_env): void
    {
        $app->get('terminal_servers', self::getServers($container));
        $app->get('terminal_directories', self::getDirectories($container));
        $app->get('terminal_files', self::getFiles($container));

        if ($is_dev_env) {
            $app->post('terminal_servers', self::postServers($container));
            $app->delete('terminal_servers/{id}', self::deleteServers($container));
    
            $app->post('terminal_directories', self::postDirectories($container));
            $app->put('terminal_directories', self::putDirectories($container));
            $app->delete('terminal_directories/{id}', self::deleteDirectories($container));
    
            $app->post('terminal_files', self::postFiles($container));
            $app->put('terminal_files', self::putFiles($container));
            $app->delete('terminal_files/{id}', self::deleteFiles($container));
        }
    }

    private static function getServers(ContainerInterface $container) {
        return function (Request $request, Response $response, $args) use ($container) {
            $server_list = $container->get(ReadServerService::class)->readServers();

            return ResponseHelper::writeResponse($response, $server_list, 200);
        };
    }

    private static function getDirectories(ContainerInterface $container) {
        return function (Request $request, Response $response, $args) use ($container) {
            $server_id = $request->getQueryParams()["server_id"] ?? null;

            if (empty($server_id)) {
                throw new HttpBadRequestException($request,"Must supply a server ID!");
            }

            $directory_list = $container->get(ReadDirectoriesService::class)->readDirectories((int) $server_id);

            return ResponseHelper::writeResponse($response, $directory_list, 200);
        };
    }

    private static function getFiles(ContainerInterface $container) {
        return function (Request $request, Response $response, $args) use ($container) {
            $directory_id = $request->getQueryParams()["directory_id"] ?? null;

            if (empty($directory_id)) {
                throw new HttpBadRequestException($request,"Must supply a directory ID!");
            }

            $file_list = $container->get(ReadFilesService::class)->readFiles((int) $directory_id);

            return ResponseHelper::writeResponse($response, $file_list, 200);
        };
    }

    private static function postServers(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container): ResponseInterface {
            $server_array = json_decode($request->getBody()->getContents(), true);
            $server = Server::fromArray($server_array);

            $created_server = $container->get(CreateServerService::class)->createServer($server);

            return ResponseHelper::writeResponse($response, $created_server, 201);
        };
    }

    private static function deleteServers(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $id = $args["id"];

            if (empty($id)) {
                $response = $response->withStatus(400, "Must supply server ID!");
                return $response;
            }

            $container->get(DeleteServerService::class)->deleteServer($id);

            return ResponseHelper::writeResponse($response, null, 201);
        };
    }

    private static function postDirectories(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $directory_array = json_decode($request->getBody()->getContents(), true);
            $directory = Directory::fromArray($directory_array);

            $container->get(CreateDirectoryService::class)->createDirectory($directory);

            return ResponseHelper::writeResponse($response, null, 201);
        };
    }

    private static function putDirectories(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $directory_array = json_decode($request->getBody()->getContents(), true);
            $directory = Directory::fromArray($directory_array);

            $success = $container->get(UpdateDirectoryService::class)->updateDirectory($directory);

            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }

    private static function deleteDirectories(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $id = $args["id"];

            if (empty($id)) {
                $response = $response->withStatus(400, "Must supply directory ID!");
                return $response;
            }

            $container->get(DeleteDirectoryService::class)->deleteDirectory($id);

            return ResponseHelper::writeResponse($response, null, 204);
        };
    }

    private static function postFiles(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $file_array = json_decode($request->getBody()->getContents(), true);
            $file = File::fromArray($file_array);
            
            $container->get(CreateFileService::class)->createFile($file);

            return ResponseHelper::writeResponse($response, null, 201);
        };
    }

    private static function putFiles(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $file_array = json_decode($request->getBody()->getContents(), true);
            $file = File::fromArray($file_array);

            $success = $container->get(UpdateFileService::class)->updateFile($file);

            return ResponseHelper::writeResponse($response, null, $success ? 204 : 500);
        };
    }

    private static function deleteFiles(ContainerInterface $container): callable
    {
        return function (Request $request, Response $response, $args) use ($container) {
            $id = $args["id"];

            if (empty($id)) {
                $response = $response->withStatus(400, "Must supply file ID!");
                return $response;
            }

            $container->get(DeleteFileService::class)->deleteFile($id);

            return ResponseHelper::writeResponse($response, null, 204);
        };
    }
}
