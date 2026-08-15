# Kingdom

Kingdom is a multiplayer, turn-based strategy game where each player assumes control of a noble house and competes against one another to become the ruling house of the Kingdom. This document outlines the design vision for the game, not necessarily the implementation details.

## Regions

The Kingdom is composed of many different Regions, which themselves are made up of little Tiles that correspond to a terrain type (grassland, woodland, prairie, mountain, water, etc). A player can take control of a Region by moving a Unit onto it and constructing a Fortification Project. Once under a player's control, that player can use the Region to construct Projects, draft new Units, or garrison existing Units.

A Region has the following associated with it:

- A base Supply.
- Projects (completed and ongoing).
- Traits
- Type (Whatever the most dominant Tile type is, is also the Region's Type.)

### Region Traits

Region Traits can modify a Project's Resource output, confer Unit Traits to Units drafted within that Region, or provide penalties/bonuses to Units based on certain criteria (a "Fetid Marshland" Region Trait may give -1 Power to Units attacking that Region, for example).

## Units

When diplomacy fails and a player wants to take more direct action against another player, in comes their Army! If a player has sufficient Resources, then they can draft a new Unit. Each Unit has Power, Speed, and Supply properties:

- Power represents a Unit's prowess on the battlefield.
- Speed represents how many Regions a Unit can move in one turn.
- Supply represents how costly a Unit is to maintain. A player cannot draft more units than their Supply would allow. However, if a player's Supply drops for whatever reason, they may keep their existing units.

More advanced, more costly Units generally have higher Power, Speed, and Supply.

Some Units have Traits, similar to Regions. So, for example, the "Ignoble Tactics" Trait might grant +1 Power to Units attacking from Mountain or Woodland Regions.

Units have 3 Actions: Attack, Assist, or Move.

### Attack Action

Attacking allows every Unit that a player controls within a Region to attack an adjacent Region. If the total Power of the attacking Units is greater than the total Power of the Units garrisoned within the target Region, then:

- One of the Defender's Units is destroyed.
- The Defender's remaining units must flee to an adjacent controlled Region.
- The Attacker must move at least one Unit into the target Region.

If the total Power of the Units within the defending Region is higher than that of the attacking Region, then nothing happens. If the target Region's Power is 0, then it is undefended and the the attacker wins by default.

### Assist Action

Taking the Assist Action allows a Unit to grant its Power to the total Power of a neighbouring Region. Notably the target Region does NOT need to be controlled by the player taking the Assist Action. This means that a player can be friendly and assist another player's Region—or they can _claim_ to take the Assist Action while _actually_ taking the Attack Action!

### Move Action

The Move Action allows a Unit to traverse a number of Regions equal to its Speed. If a Unit enter a Marshland or Mountain Region, then their movement halts, no matter how much Speed it has left.

## Supply

Supply represents a player's total military capacity. In order for a player to drafts a new Unit, they must pay the Resource cost and have enough Supply to sustain the Unit. For example, if the player has a maximum Supply of 14, and their current Supply is 13, then they cannot construct a Unit that costs 2 Supply.

## Resources

Resources are building blocks used to construct Projects, draft new Units, trade with other players, or sell on the Market. The resources are as follows: Food, Lumber, Stone, Iron, Wealth, Glass, Paper, Mithril, Mana.

### Market

The Market is available to every player and allows players to sell Resources in exchange for Wealth (Wealth is also a Resource). Wealth can be spent on the Market to purchase Resources, though it is generally less expensive to gain said Resources through a Project.

## Projects

Projects are always associated with a Region and represent the institutions or special works that a player has invested in within that Region. Projects are the best way to produce Resources. Most Projects have multiple Tiers. So, a "Tier 1 Quarry" will produce _significantly_ less Stone than a "Tier 4 Quarry".

Completed Projects may also allow the player to construct unique Units, confer special Traits to existing Units, or raise the player's total Supply.

Constructing a Project requires a base investment of certain Resources and a time investment of Turns. So constructing a "Noble Estates" projects may require 100 Wealth, 50 Lumber, and 50 Stone up front; and it may require 3 turns to complete. Upon Completion, it might produce Wealth and allow the player to draft the Knight Unit.
