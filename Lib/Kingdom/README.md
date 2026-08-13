# Kingdom

The Kingdom domain represents the data structures and interactions for a multiplayer, turn-based strategy game where the Player takes on the role of a lord of a local area within the kingdom.

## Architecture

Kingdom: Represents the GameMap or an individual Kingdom. Composed of Regions.
Region: Represents a state/province inside of the Kingdom. Composed of many tiles. Can be claimed by a Player during play.
Tile: Respresents physical terrain: Prairie, Marshlands, Mountain, Water, Forest, etc. Holds its own coordinates.
RegionTemplate: An uninstantiated Region.
TileTemplate: An uninstantiated Tile.
