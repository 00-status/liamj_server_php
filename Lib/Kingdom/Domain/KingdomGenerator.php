<?php

namespace Lib\Kingdom\Domain;

use Lib\Kingdom\Domain\Entity\Kingdom;
use Lib\Kingdom\Domain\Entity\KingdomGenerationConfig;
use Lib\Kingdom\Domain\Entity\Region;
use Lib\Kingdom\Domain\Entity\RegionTemplate;
use Lib\Kingdom\Domain\Entity\Tile;

class KingdomGenerator
{
    public function __construct(
        private RegionTemplateSelectorInterface $template_selector
    ) {}

    /**
     * @param KingdomGenerationConfig $config
     * @param RegionTemplate[] $templates
     * @return Kingdom Unpersisted domain entity containing Regions and Tiles
     */
    public function generate(KingdomGenerationConfig $config, array $templates): Kingdom
    {
        if (empty($templates)) {
            throw new \DomainException("Cannot generate Kingdom without RegionTemplates.", 400);
        }

        if ($config->seed !== null) {
            mt_srand($config->seed);
        }

        $grid_width = $config->width;
        $grid_height = $config->height;
        $step = $config->step;
        $jitter = $config->jitter;

        // In-memory grid: [y][x] => ['region_index' => int, 'type' => TileType]
        $grid = array_fill(0, $grid_height, array_fill(0, $grid_width, null));

        $stamped_regions = []; // region_index => ['name' => string, 'template' => RegionTemplate, 'origin_x' => int, 'origin_y' => int]
        $region_counter = 1;

        // Phase 1: Jittered Stamping
        for ($y = (int) ($step / 2); $y < $grid_height; $y += $step) {
            for ($x = (int) ($step / 2); $x < $grid_width; $x += $step) {
                $origin_x = max(0, min($grid_width - 1, $x + random_int(-$jitter, $jitter)));
                $origin_y = max(0, min($grid_height - 1, $y + random_int(-$jitter, $jitter)));

                $template = $this->template_selector->selectTemplate($templates, $origin_x, $origin_y);
                $region_index = $region_counter++;

                $stamped_regions[$region_index] = [
                    'name' => $template->name . " " . $region_index,
                    'template' => $template,
                    'origin_x' => $origin_x,
                    'origin_y' => $origin_y,
                ];

                foreach ($template->tile_templates as $tile_template) {
                    $target_x = $origin_x + $tile_template->x;
                    $target_y = $origin_y + $tile_template->y;

                    if ($target_x >= 0 && $target_x < $grid_width && $target_y >= 0 && $target_y < $grid_height) {
                        if ($grid[$target_y][$target_x] === null) {
                            $grid[$target_y][$target_x] = [
                                'region_index' => $region_index,
                                'type' => $tile_template->type,
                            ];
                        }
                    }
                }
            }
        }

        // Phase 2: Multi-Source BFS Remnant Growth
        $queue = new \SplQueue();
        for ($y = 0; $y < $grid_height; $y++) {
            for ($x = 0; $x < $grid_width; $x++) {
                if ($grid[$y][$x] !== null) {
                    $queue->enqueue([$x, $y]);
                }
            }
        }

        $cardinal_directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        while (!$queue->isEmpty()) {
            [$current_x, $current_y] = $queue->dequeue();
            $current_cell = $grid[$current_y][$current_x];

            foreach ($cardinal_directions as [$delta_x, $delta_y]) {
                $neighbor_x = $current_x + $delta_x;
                $neighbor_y = $current_y + $delta_y;

                if ($neighbor_x >= 0 && $neighbor_x < $grid_width && $neighbor_y >= 0 && $neighbor_y < $grid_height) {
                    if ($grid[$neighbor_y][$neighbor_x] === null) {
                        // Expand parent region & terrain type
                        $grid[$neighbor_y][$neighbor_x] = [
                            'region_index' => $current_cell['region_index'],
                            'type' => $current_cell['type'],
                        ];
                        $queue->enqueue([$neighbor_x, $neighbor_y]);
                    }
                }
            }
        }

        // Assemble Domain Entities
        $region_tiles_map = []; // region_index => Tile[]
        for ($y = 0; $y < $grid_height; $y++) {
            for ($x = 0; $x < $grid_width; $x++) {
                $cell = $grid[$y][$x];
                if ($cell !== null) {
                    $region_index = $cell['region_index'];
                    $region_tiles_map[$region_index][] = Tile::fromArray([
                        'region_id' => 0,
                        'x' => $x,
                        'y' => $y,
                        'type' => $cell['type'],
                    ]);
                }
            }
        }

        $domain_regions = [];
        foreach ($stamped_regions as $region_index => $region_data) {
            $tiles = $region_tiles_map[$region_index] ?? [];
            $domain_regions[] = Region::fromArray([
                'id' => 0,
                'kingdom_id' => 0,
                'region_template_id' => $region_data['template']->id,
                'name' => $region_data['name'],
                'origin_x' => $region_data['origin_x'],
                'origin_y' => $region_data['origin_y'],
            ], $region_data['template'], $tiles);
        }

        return Kingdom::fromArray([
            'id' => 0,
            'name' => $config->name,
        ], $domain_regions);
    }
}
