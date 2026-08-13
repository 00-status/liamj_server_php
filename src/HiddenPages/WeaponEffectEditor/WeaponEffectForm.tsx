import { useEffect, useRef, useState } from 'react';

import './weapon-effect-form.css';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Button } from '../../SharedComponents/Button/Button';
import { Dropdown } from '../../SharedComponents/Dropdown/Dropdown';
import { Card } from '../../SharedComponents/Card/Card';

import { WeaponEffectTag } from './WeaponEffectTag';
import { useSaveWeaponEffect } from './useSaveWeaponEffect';
import { useUpdateWeaponEffect } from './useUpdateWeaponEffect';

export type WeaponEffect = {
    id?: number;
    name: string;
    description: string;
    rarities: Array<string>;
    tags: Array<string>;
};

type Props = {
    weaponEffect?: WeaponEffect;
    fetchWeaponEffects: () => void;
};

export const WeaponEffectForm = (props: Props) => {
    const { weaponEffect, fetchWeaponEffects } = props;

    const { saveWeaponEffect } = useSaveWeaponEffect();
    const { updateWeaponEffect } = useUpdateWeaponEffect();

    const inputReference = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [currentTag, setCurrentTag] = useState('');
    const [tagList, setTagList] = useState<Array<string>>([]);

    const [rarityList, setRarityList] = useState<Array<string>>([]);

    useEffect(() => {
        setName(weaponEffect?.name ?? 'Weapon effect');
        setDescription(weaponEffect?.description ?? '');
        setTagList(weaponEffect?.tags ?? []);
        setRarityList(weaponEffect?.rarities ?? []);
    }, [weaponEffect, setName, setDescription, setTagList, setRarityList]);

    const rarityOptions = [
        { value: '', label: '' },
        { value: 'Uncommon', label: 'Uncommon' },
        { value: 'Rare', label: 'Rare' },
        { value: 'Very Rare', label: 'Very Rare' },
        { value: 'Legendary', label: 'Legendary' },
    ];

    const onDeleteRarity = (tag: string) => {
        const rarityListCopy = [...rarityList];

        const rarityToDeleteIndex = rarityListCopy.indexOf(tag);
        rarityListCopy.splice(rarityToDeleteIndex, 1);

        setRarityList(rarityListCopy);
    };

    const onDeleteTag = (tag: string) => {
        const tagListCopy = [...tagList];

        const tagToDeleteIndex = tagListCopy.indexOf(tag);
        tagListCopy.splice(tagToDeleteIndex, 1);

        setTagList(tagListCopy);
    };

    const onSubmitWeaponEffect = () => {
        const weaponEffectToSubmit = {
            name: name,
            description: description,
            rarities: rarityList,
            tags: tagList,
        };

        if (!!weaponEffect && weaponEffect.id) {
            updateWeaponEffect(weaponEffectToSubmit, weaponEffect.id);
        } else {
            saveWeaponEffect(weaponEffectToSubmit);
        }

        fetchWeaponEffects();
        setName('Weapon effect');
        setDescription('');
        setRarityList([]);
        setTagList([]);
    };

    return (
        <div className="weapon-effect-form">
            <Card
                title={name}
                button={<Button onClick={onSubmitWeaponEffect}>Submit effect</Button>}
            >
                <div>
                    <TextInput
                        id="weapon-effect-name"
                        value={name}
                        label="Name"
                        onChange={(newValue) => {
                            setName(newValue ?? '');
                        }}
                    />
                    <div className="weapon-effect-form__description">
                        <label htmlFor="weapon-effect-description">Description</label>
                        <textarea
                            className="weapon-effect-form__text-area"
                            id="weapon-effect-description"
                            value={description}
                            onChange={(event) => {
                                setDescription(event.target.value ?? '');
                            }}
                        />
                    </div>
                </div>
                <div>
                    <div className="weapon-effect-form__dropdown">
                        <Dropdown
                            defaultValue=""
                            options={rarityOptions}
                            onOptionSelect={(optionValue) => {
                                if (optionValue && !rarityList.includes(optionValue)) {
                                    setRarityList((state) => [...state, optionValue]);
                                }
                            }}
                        />
                    </div>
                    <div className="weapon-effect-form__tag-list">
                        {rarityList.map((rarity) => (
                            <WeaponEffectTag
                                key={rarity}
                                tag={rarity}
                                onDeleteTag={onDeleteRarity}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <div className="weapon-effect-form__tag-form">
                        <TextInput
                            ref={inputReference}
                            placeholder="Tag name"
                            value={currentTag}
                            onChange={(newValue) => {
                                setCurrentTag(newValue ?? '');
                            }}
                        />
                        <Button
                            onClick={() => {
                                if (!currentTag || tagList.includes(currentTag)) {
                                    return;
                                }

                                setTagList((state) => [...state, currentTag]);
                                setCurrentTag('');

                                if (inputReference.current) {
                                    inputReference.current.focus();
                                }
                            }}
                        >
                            Add tag
                        </Button>
                    </div>
                    <div className="weapon-effect-form__tag-list">
                        {tagList.map((tag) => (
                            <WeaponEffectTag key={tag} tag={tag} onDeleteTag={onDeleteTag} />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};
