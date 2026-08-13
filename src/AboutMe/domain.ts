import { SkillLevel } from './SkillCard';

export type Skill = {
    name: string;
    type: string;
    skillLevel: SkillLevel;
};

export const skills: Array<Skill> = [
    { type: 'Front-end', name: 'React', skillLevel: SkillLevel.expert },
    { type: 'Front-end', name: 'TypeScript', skillLevel: SkillLevel.expert },
    { type: 'Back-end', name: 'PHP', skillLevel: SkillLevel.working },
    { type: 'Front-end', name: 'Webpack', skillLevel: SkillLevel.working },
    { type: 'Database', name: 'PostgreSQL', skillLevel: SkillLevel.working },
    { type: 'Tool', name: 'Jira', skillLevel: SkillLevel.working },
    { type: 'Process', name: 'Test-driven Development', skillLevel: SkillLevel.working },
    { type: 'Tool', name: 'Git', skillLevel: SkillLevel.working },
    { type: 'Back-end', name: 'SlimPHP', skillLevel: SkillLevel.working },
    { type: 'Process', name: 'Command/Handler', skillLevel: SkillLevel.working },
    { type: 'Process', name: 'Onion Architecture', skillLevel: SkillLevel.working },
    { type: 'Back-end', name: 'GraphQL', skillLevel: SkillLevel.working },
    { type: 'Back-end', name: 'ASP.NET Core', skillLevel: SkillLevel.working },
    { type: 'Front-end', name: 'Flow', skillLevel: SkillLevel.working },
    { type: 'Database', name: 'MySQL', skillLevel: SkillLevel.working },
    { type: 'Back-end', name: 'Google Analytics', skillLevel: SkillLevel.working },
    { type: 'Tool', name: 'Slack', skillLevel: SkillLevel.working },
    { type: 'Front-end', name: 'Vue', skillLevel: SkillLevel.working },
    { type: 'Process', name: 'Builder', skillLevel: SkillLevel.working },
];
