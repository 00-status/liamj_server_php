<?php

namespace Lib\Kingdom\Domain\Entity;

enum TileType: string {
    case prairie = "Prairie";
    case woodland = "Woodland";
    case mountain = "Mountain";
    case hills = "Hills";
    case wetland = "Wetland";
    case water = "Water";
}
