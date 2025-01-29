<?php

namespace Lib\API;

use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Response;

class ResponseHelper
{
    public static function writeResponse(
        Response $response,
        \JsonSerializable|null|array $data,
        int $status
    ): ResponseInterface {
        if (!empty($data)) {
            $response->getBody()->write(json_encode($data));
        }

        $response = $response->withStatus($status);

        return $response;
    }
}

