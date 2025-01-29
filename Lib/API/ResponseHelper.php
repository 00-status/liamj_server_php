<?php

namespace Lib\API;

use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;

class ResponseHelper
{
    public static function writeResponse(Response $response, \JsonSerializable|null $data, int $status): ResponseInterface
    {
        if (!empty($data)) {
            $response->getBody()->write(json_encode($data));
        }

        $response = $response->withStatus($status);

        return $response;
    }
}

