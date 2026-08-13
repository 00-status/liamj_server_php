import { useCallback, useState } from 'react';

export type TileTemplate = {
    id?: number;
    regionTemplateId?: number;
    x: number;
    y: number;
    type: string;
};

export type RegionTemplate = {
    id: number;
    name: string;
    tile_templates: Array<TileTemplate>;
};

type UseRegionTemplates = {
    isLoading: boolean;
    templates: Array<RegionTemplate>;
    fetchTemplates: () => void;
    createTemplate: (
        name: string,
        tileTemplates: Array<TileTemplate>,
        callback?: () => void,
    ) => void;
    updateTemplate: (
        id: number,
        name: string,
        tileTemplates: Array<TileTemplate>,
        callback?: () => void,
    ) => void;
    deleteTemplate: (id: number) => void;
};

export const useRegionTemplates = (): UseRegionTemplates => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [templates, setTemplates] = useState<Array<RegionTemplate>>([]);

    const fetchTemplates = useCallback(() => {
        setIsLoading(true);
        fetch('/api/1/region_templates')
            .then((response) => response.json())
            .then((json) => {
                if (Array.isArray(json)) {
                    setTemplates(json);
                } else {
                    setTemplates([]);
                }
            })
            .catch(() => setTemplates([]))
            .finally(() => setIsLoading(false));
    }, []);

    const createTemplate = useCallback(
        (name: string, tileTemplates: Array<TileTemplate>, callback?: () => void) => {
            setIsLoading(true);
            const payload = {
                name,
                tile_templates: tileTemplates.map((t) => ({
                    x: t.x,
                    y: t.y,
                    type: t.type,
                })),
            };

            fetch('/api/1/region_templates', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((res) => {
                    if (res.ok) {
                        fetchTemplates();
                        if (callback) callback();
                    }
                })
                .finally(() => setIsLoading(false));
        },
        [fetchTemplates],
    );

    const updateTemplate = useCallback(
        (id: number, name: string, tileTemplates: Array<TileTemplate>, callback?: () => void) => {
            setIsLoading(true);
            const payload = {
                id,
                name,
                tile_templates: tileTemplates.map((t) => ({
                    x: t.x,
                    y: t.y,
                    type: t.type,
                })),
            };

            fetch(`/api/1/region_templates/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((res) => {
                    if (res.ok) {
                        fetchTemplates();
                        if (callback) callback();
                    }
                })
                .finally(() => setIsLoading(false));
        },
        [fetchTemplates],
    );

    const deleteTemplate = useCallback(
        (id: number) => {
            setIsLoading(true);
            fetch(`/api/1/region_templates/${id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (res.ok) {
                        fetchTemplates();
                    }
                })
                .finally(() => setIsLoading(false));
        },
        [fetchTemplates],
    );

    return {
        isLoading,
        templates,
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
    };
};
