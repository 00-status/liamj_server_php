<?php
use Lib\WeaponMaker\Domain\BaseWeapon;
use Lib\WeaponMaker\Domain\ExtraDamage;
use Lib\WeaponMaker\Domain\Weapon;
use Lib\WeaponMaker\Domain\WeaponBuilder;
use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Infrastructure\BaseWeaponContext;
use Lib\WeaponMaker\Infrastructure\GoogleGeminiApiClient;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;

class GenerateWeaponService
{
    private BaseWeaponContext $base_weapon_context;
    private WeaponEffectDbContext $weapon_effect_db_context;
    private GoogleGeminiApiClient $google_gemini_api_client;

    public function __construct(
        WeaponEffectDBContext $weapon_effect_db_context,
        GoogleGeminiApiClient $google_gemini_api_client
    ) {
        $this->base_weapon_context = new BaseWeaponContext();
        $this->weapon_effect_db_context = $weapon_effect_db_context;
        $this->google_gemini_api_client = $google_gemini_api_client;
    }

    public function generateWeapon(string $rarity): Weapon
    {
        $random_mundane_weapon = $this->pickMundaneWeapon();
        $extra_damage = $this->pickExtraDamage($rarity);
        $random_weapon_effect = $this->pickWeaponEffect($rarity);

        $tag_list = array_merge($extra_damage->getTags(), $random_weapon_effect->getTags());
        $refined_list = [];

        for ($i = 0; $i < 2; $i++) {
            $random_index = rand(0, count($tag_list));
            $refined_list[] = $tag_list[$random_index];
        }

        $weapon_name = $this->google_gemini_api_client->generateWeaponName(
            $random_mundane_weapon->getName(),
            $refined_list
        );

        $builder = (new WeaponBuilder())
            ->setRarity($rarity)
            ->setBaseWeaponProperties($random_mundane_weapon)
            ->setExtraDamage($extra_damage->getWeaponDamage())
            ->setWeaponEffect($random_weapon_effect);

        if ($weapon_name !== null) {
            $builder->setName($weapon_name);
        }

        return $builder->build();
    }

    private function pickMundaneWeapon(): BaseWeapon
    {
        $random_index = rand(0, count($this->base_weapon_context->getBaseWeapons()) - 1);
        return $this->base_weapon_context->getBaseWeapons()[$random_index];
    }

    private function pickExtraDamage(string $rarity): ExtraDamage
    {
        $filtered_extra_damages = array_filter(
            $this->base_weapon_context->getExtraDamages(),
            fn($extra_damage) => in_array($rarity, $extra_damage->getRarityLevels())
        );

        $random_index = rand(0, count($filtered_extra_damages) - 1);
        return $filtered_extra_damages[$random_index];
    }

    private function pickWeaponEffect(string $rarity): WeaponEffect
    {
        $weapon_effects = $this->weapon_effect_db_context->fetchWeaponEffects();
        $filtered_weapon_effects = array_filter(
            $weapon_effects,
            fn($weapon_effect) => in_array($rarity, $weapon_effect->getRarities())
        );

        $random_index = rand(0, count($filtered_weapon_effects) - 1);
        return $filtered_weapon_effects[$random_index];
    }
}
