<?php

namespace Lib\WeaponMaker\Infrastructure;
use Lib\WeaponMaker\Domain\BaseWeapon;
use Lib\WeaponMaker\Domain\ExtraDamage;
use Lib\WeaponMaker\Domain\WeaponDamage;

class BaseWeaponContext
{
    public function getBaseWeapons(): array
    {
        return [
            new BaseWeapon("Battleaxe",      ["Topple", "Versatile", "Topple"],                              new WeaponDamage(1, 8, "Slashing"),      0, 0),
            new BaseWeapon("Flail",          ["Sap"],                                                        new WeaponDamage(1, 8, "Bludgeoning"),   0, 0),
            new BaseWeapon("Glaive",         ["Graze", "Reach", "TwoHanded"],                                new WeaponDamage(1, 10, "Slashing"),     0, 0),
            new BaseWeapon("Greataxe",       ["Cleave", "TwoHanded"],                                        new WeaponDamage(1, 12, "Slashing"),     0, 0),
            new BaseWeapon("Greatsword",     ["Graze", "TwoHanded"],                                         new WeaponDamage(2, 6, "Slashing"),      0, 0),
            new BaseWeapon("Halberd",        ["Cleave", "TwoHanded"],                                        new WeaponDamage(1, 10, "Slashing"),     0, 0),
            new BaseWeapon("Lance",          ["Topple", "Lance"],                                            new WeaponDamage(1, 12, "Piercing"),     0, 0),
            new BaseWeapon("Longsword",      ["Sap", "Versatile"],                                           new WeaponDamage(1, 8, "Slashing"),      0, 0),
            new BaseWeapon("Maul",           ["Topple", "TwoHanded"],                                        new WeaponDamage(2, 6, "Bludgeoning"),   0, 0),
            new BaseWeapon("Morningstar",    ["Sap", ],                                                      new WeaponDamage(1, 8, "Piercing"),      0, 0),
            new BaseWeapon("Pike",           ["Push", "Reach", "TwoHanded"],                                 new WeaponDamage(1, 10, "Piercing"),     0, 0),
            new BaseWeapon("Rapier",         ["Vex", "Finesse"],                                             new WeaponDamage(1, 8, "Piercing"),      0, 0),
            new BaseWeapon("Scimitar",       ["Nick", "Finesse", "Light"],                                   new WeaponDamage(1, 6, "Slashing"),      0, 0),
            new BaseWeapon("Shortsword",     ["Vex", "Finesse", "Light"],                                    new WeaponDamage(1, 6, "Piercing"),      0, 0),
            new BaseWeapon("Warhammer",      ["Push", "Versatile"],                                          new WeaponDamage(1, 8, "Bludgeoning"),   0, 0),
            new BaseWeapon("War Pick",       ["Sap", ],                                                      new WeaponDamage(1, 8, "Piercing"),      0, 0),
            new BaseWeapon("Whip",           ["Slow", "Finesse", "Reach"],                                   new WeaponDamage(1, 4, "Slashing"),      0, 0),
            new BaseWeapon("Blowgun",        ["Vex", "Ammunition", "Loading"],                               new WeaponDamage(1, 4, "Piercing"),      25, 100),
            new BaseWeapon("Hand Crossbow",  ["Vex", "Ammunition", "Light", "Loading"],                      new WeaponDamage(1, 6, "Piercing"),      30, 120),
            new BaseWeapon("Heavy Crossbow", ["Push", "Ammunition", "Heavy", "Loading", "TwoHanded"],        new WeaponDamage(1, 10, "Piercing"),     100, 400),
            new BaseWeapon("Light Crossbow", ["Slow", "Ammunition", "Loading", "TwoHanded"],                 new WeaponDamage(1, 8, "Piercing"),      80, 320),
            new BaseWeapon("Dart",           ["Vex", "Finesse", "Thrown"],                                   new WeaponDamage(1, 4, "Piercing"),      20, 60),
            new BaseWeapon("Longbow",        ["Slow", "Ammunition", "Heavy", "TwoHanded"],                   new WeaponDamage(1, 8, "Piercing"),      150, 600),
            new BaseWeapon("Shortbow",       ["Vex", "Ammunition", "TwoHanded"],                             new WeaponDamage(1, 6, "Piercing"),      80, 320),
            new BaseWeapon("Sling",          ["Slow", "Ammunition"],                                         new WeaponDamage(1, 4, "Bludgeoning"),   30, 120),
            new BaseWeapon("Javelin",        ["Slow", "Thrown"],                                             new WeaponDamage(1, 6, "Piercing"),      30, 120),
            new BaseWeapon("Spear",          ["Sap", "Thrown", "Versatile"],                                 new WeaponDamage(1, 6, "Piercing"),      20, 60),
            new BaseWeapon("Trident",        ["Topple", "Thrown", "Versatile"],                              new WeaponDamage(1, 6, "Piercing"),      20, 60),
            new BaseWeapon("Handaxe",        ["Vex", "Light", "Thrown"],                                     new WeaponDamage(1, 6, "Slashing"),      20, 60),
            new BaseWeapon("Dagger",         ["Nick", "Finesse", "Light", "Thrown"],                         new WeaponDamage(1, 4, "Slashing"),      20, 60),
            new BaseWeapon("Musket",         ["Slow", "Ammunition", "Loading", "TwoHanded"],                 new WeaponDamage(1, 12, "Piercing"),     40, 120),
            new BaseWeapon("Pistol",         ["Vex", "Ammunition", "Loading"],                               new WeaponDamage(1, 10, "Piercing"),     30, 90)
        ];
    }

    public function getExtraDamages(): array
    {
        return [
            new ExtraDamage(new WeaponDamage(1, 6, "Acid"),         ["Uncommon"],               ["acid", "bitter"] ),
            new ExtraDamage(new WeaponDamage(2, 6, "Acid"),         ["Uncommon", "Rare"],       ["acid", "bitter"] ),
            new ExtraDamage(new WeaponDamage(3, 6, "Acid"),         ["Very Rare", "Legendary"], ["acid", "bitter"] ),
            new ExtraDamage(new WeaponDamage(4, 6, "Acid"),         ["Legendary"],              ["acid", "bitter"] ),
            new ExtraDamage(new WeaponDamage(1, 12, "Bludgeoning"), ["Uncommon"],               ["crushing", "heavy", "blunt"] ),
            new ExtraDamage(new WeaponDamage(2, 12, "Bludgeoning"), ["Rare", "Very Rare"],      ["crushing", "heavy", "blunt"] ),
            new ExtraDamage(new WeaponDamage(3, 12, "Bludgeoning"), ["Very Rare", "Legendary"], ["crushing", "heavy", "blunt", "massive"] ),
            new ExtraDamage(new WeaponDamage(1, 8, "Cold"),         ["Uncommon"],               ["cold", "chilled"] ),
            new ExtraDamage(new WeaponDamage(2, 8, "Cold"),         ["Rare"],                   ["cold", "chilled"] ),
            new ExtraDamage(new WeaponDamage(3, 8, "Cold"),         ["Very Rare"],              ["cold", "chilled"] ),
            new ExtraDamage(new WeaponDamage(5, 8, "Cold"),         ["Legendary"],              ["cold", "chilled", "frosty"] ),
            new ExtraDamage(new WeaponDamage(1, 8, "Fire"),         ["Uncommon"],               ["fire", "hot"] ),
            new ExtraDamage(new WeaponDamage(2, 8, "Fire"),         ["Rare"],                   ["fire", "burning", "hot"] ),
            new ExtraDamage(new WeaponDamage(3, 8, "Fire"),         ["Very Rare"],              ["fire", "burning", "hot"] ),
            new ExtraDamage(new WeaponDamage(5, 8, "Fire"),         ["Legendary"],              ["fire", "burning", "inferno"] ),
            new ExtraDamage(new WeaponDamage(1, 10, "Force"),       ["Uncommon"],               ["forceful"] ),
            new ExtraDamage(new WeaponDamage(2, 10, "Force"),       ["Rare", "Very Rare"],      ["forceful"] ),
            new ExtraDamage(new WeaponDamage(4, 10, "Force"),       ["Legendary"],              ["forceful", "spectral"] ),
            new ExtraDamage(new WeaponDamage(2, 4, "Lightning"),    ["Uncommon"],               ["lightning", "electric"] ),
            new ExtraDamage(new WeaponDamage(4, 4, "Lightning"),    ["Rare"],                   ["lightning", "electric"] ),
            new ExtraDamage(new WeaponDamage(6, 4, "Lightning"),    ["Very Rare"],              ["lightning", "electric"] ),
            new ExtraDamage(new WeaponDamage(10, 4, "Lightning"),   ["Legendary"],              ["lightning", "electric"] ),
            new ExtraDamage(new WeaponDamage(1, 10, "Necrotic"),    ["Uncommon"],               ["necrotic", "death"] ),
            new ExtraDamage(new WeaponDamage(2, 10, "Necrotic"),    ["Rare"],                   ["necrotic", "death"] ),
            new ExtraDamage(new WeaponDamage(3, 10, "Necrotic"),    ["Very Rare"],              ["necrotic", "death"] ),
            new ExtraDamage(new WeaponDamage(4, 10, "Necrotic"),    ["Legendary"],              ["necrotic", "death"] ),
            new ExtraDamage(new WeaponDamage(2, 4, "Piercing"),     ["Uncommon"],               ["pointy", "jagged"] ),
            new ExtraDamage(new WeaponDamage(4, 4, "Piercing"),     ["Uncommon", "Rare"],       ["pointy", "jagged"] ),
            new ExtraDamage(new WeaponDamage(5, 4, "Piercing"),     ["Rare", "Very Rare"],      ["pointy", "jagged"] ),
            new ExtraDamage(new WeaponDamage(6, 4, "Piercing"),     ["Very Rare", "Legendary"], ["pointy", "jagged", "barbed"] ),
            new ExtraDamage(new WeaponDamage(1, 6, "Poison"),       ["Uncommon"],               ["poisonous"] ),
            new ExtraDamage(new WeaponDamage(2, 6, "Poison"),       ["Rare"],                   ["poisonous"] ),
            new ExtraDamage(new WeaponDamage(4, 6, "Poison"),       ["Very Rare"],              ["poisonous", "venomous"] ),
            new ExtraDamage(new WeaponDamage(8, 6, "Poison"),       ["Legendary"],              ["poisonous", "venomous", "deadly"] ),
            new ExtraDamage(new WeaponDamage(1, 10, "Psychic"),     ["Uncommon"],               ["psychic"] ),
            new ExtraDamage(new WeaponDamage(2, 10, "Psychic"),     ["Rare", "Very Rare"],      ["psychic"] ),
            new ExtraDamage(new WeaponDamage(4, 10, "Psychic"),     ["Legendary"],              ["psychic"] ),
            new ExtraDamage(new WeaponDamage(1, 8, "Radiant"),      ["Uncommon"],               ["radiant"] ),
            new ExtraDamage(new WeaponDamage(2, 8, "Radiant"),      ["Rare", "Very Rare"],      ["radiant"] ),
            new ExtraDamage(new WeaponDamage(4, 8, "Radiant"),      ["Legendary"],              ["radiant"] ),
            new ExtraDamage(new WeaponDamage(1, 6, "Slashing"),     ["Uncommon"],               ["sharp"] ),
            new ExtraDamage(new WeaponDamage(2, 6, "Slashing"),     ["Rare"],                   ["sharp", "cutting"] ),
            new ExtraDamage(new WeaponDamage(4, 6, "Slashing"),     ["Very Rare"],              ["sharp", "razored"] ),
            new ExtraDamage(new WeaponDamage(8, 6, "Slashing"),     ["Legendary"],              ["sharp", "razored"] ),
            new ExtraDamage(new WeaponDamage(1, 12, "Thunder"),     ["Uncommon"],               ["thunderous", "loud"] ),
            new ExtraDamage(new WeaponDamage(2, 12, "Thunder"),     ["Rare", "Very Rare"],      ["thunderous", "loud"] ),
            new ExtraDamage(new WeaponDamage(3, 12, "Thunder"),     ["Legendary"],              ["thunderous", "loud", "earth-shaking"] ),
        ];
    }
}
