import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './region-templates.css';
import { Page } from '../../SharedComponents/Page/Page';
import { Card } from '../../SharedComponents/Card/Card';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';

import { useRegionTemplates } from './hooks/useRegionTemplates';

export const RegionTemplatesPage = () => {
    const navigate = useNavigate();
    const { isLoading, templates, fetchTemplates, deleteTemplate } = useRegionTemplates();

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const handleCreateNew = () => {
        navigate('/unlisted/region_template_editor');
    };

    const handleEdit = (id: number) => {
        navigate(`/unlisted/region_template_editor?id=${id}`);
    };

    return (
        <Page title="Region Templates" routes={[]}>
            <div className="region-templates">
                <div className="region-templates__header">
                    <h1>Directory</h1>
                    <Button buttonTheme={ButtonTheme.Default} hasSheen onClick={handleCreateNew}>
                        Create New Template
                    </Button>
                </div>

                {isLoading && templates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading templates...</div>
                ) : (
                    <div className="region-templates__grid">
                        {templates.length === 0 ? (
                            <div className="region-templates__empty">
                                <h3>No region templates found.</h3>
                                <p>Click "Create New Template" to paint your first region.</p>
                            </div>
                        ) : (
                            templates.map((template) => (
                                <Card
                                    key={template.id}
                                    title={template.name || `Template #${template.id}`}
                                >
                                    <div className="region-templates__card-details">
                                        <div className="region-templates__card-stat">
                                            <strong>ID:</strong> {template.id}
                                        </div>
                                        <div className="region-templates__card-stat">
                                            <strong>Painted Tiles:</strong>{' '}
                                            {template.tile_templates.length}
                                        </div>
                                    </div>
                                    <div className="region-templates__card-actions">
                                        <Button
                                            buttonTheme={ButtonTheme.Subtle}
                                            onClick={() => handleEdit(template.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            buttonTheme={ButtonTheme.Delete}
                                            onClick={() => deleteTemplate(template.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Page>
    );
};

export default RegionTemplatesPage;
