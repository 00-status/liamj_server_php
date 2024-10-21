<?php

namespace Lib\WeaponMaker\Infrastructure;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use RuntimeException;

class GoogleGeminiApiClient
{
    private string $uri = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private string $body = '{ "contents": [{"parts": [{"text": "Generate a single, evocative fantasy name for a {{weapon-type}}-type weapon. It should be 1-5 words. Do not include newlines in your response. Use some of the following tags: {{weapon-tags}}. Do not generate a preamble or explanation - just generate the name itself. Thanks!"}]}] }';
    private string|bool $gak;

    public function __construct()
    {
        $file_path = __DIR__ . "/../../../secrets/GAK.txt";

        if (!file_exists($file_path)) {
            throw new RuntimeException("Cannot find GAK!");
        }

        $this->gak = file_get_contents($file_path);
    }

    public function generateWeaponName(string $weapon_type, array $weapon_tags): ?string
    {
        if (!$this->gak) {
            throw new \DomainException("Cannot send Google API request!");
        }

        $client = new Client();
        try {
            $response = $client->post($this->uri . $this->gak, [
                'json' => $this->createRequestBody($weapon_type, $weapon_tags),
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]);

            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $body = $response->getBody()->getContents();
            $parsed_json_response = json_decode($body, true);
            return $this->extractWeaponName($parsed_json_response);

        } catch (GuzzleException $e) {
            return null;
        }
    }

    private function createRequestBody(string $weapon_type, array $weapon_tags): array
    {
        $body_with_weapon_name = str_replace('{{weapon-type}}', $weapon_type, $this->body);
        $body_with_tags = str_replace(
            '{{weapon-tags}}',
            implode(', ', $weapon_tags),
            $body_with_weapon_name
        );

        return json_decode($body_with_tags, true);
    }

    private function extractWeaponName(?array $response): ?string
    {
        if (is_null($response) || empty($response['candidates'])) {
            return null;
        }

        $candidate = $response['candidates'][0];
        if (is_null($candidate) || empty($candidate['content']['parts'])) {
            return null;
        }

        return $candidate['content']['parts'][0]['text'] ?? null;
    }
}
