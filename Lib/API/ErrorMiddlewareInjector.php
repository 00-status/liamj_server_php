<?php

namespace Lib\API;

use Slim\App;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ErrorMiddlewareInjector
{
    public static function injectErrorMiddleware (App $app)
    {
        $custom_error_handler = function (
            Request $request,
            \Throwable $exception,
            bool $display_error_details,
            bool $log_errors,
            bool $log_error_details
        ) use ($app): Response {
            $response = $app
                ->getResponseFactory()
                ->createResponse();

            $response
                ->getBody()
                ->write(json_encode(['error' => $exception->getMessage()]));
            
            return $response->withStatus($exception->getCode() === 0 ? 500 : $exception->getCode());
        };
        
        $error_middleware = $app->addErrorMiddleware(true, false, false);
        $error_middleware->setDefaultErrorHandler($custom_error_handler);
    }
}