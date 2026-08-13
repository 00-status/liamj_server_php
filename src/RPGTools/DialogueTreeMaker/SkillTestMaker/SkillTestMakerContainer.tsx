import { SkillTest } from '../domain/types';

import { SkillTestMaker } from './SkillTestMaker';

type Props = {
    skillTests: Array<SkillTest>;
    currentSkillTest: SkillTest | null;
    setSkillTests: (skillTest: Array<SkillTest>) => void;
    setCurrentSkillTest: (skillTest: SkillTest | null) => void;
};

export const SkillTestMakerContainer = (props: Props) => {
    const { skillTests, currentSkillTest, setSkillTests, setCurrentSkillTest } = props;

    // TODO: These are super similar to the methods in dialogue maker. Consider creating a shared method.
    const onSave = (updatedSkillTest: SkillTest) => {
        const skillTestsCopy = [...skillTests];

        const currentSkillTestIndex = skillTests.findIndex(
            (skillTest) => skillTest.id === updatedSkillTest.id,
        );

        if (currentSkillTestIndex === -1) {
            return;
        }

        skillTestsCopy[currentSkillTestIndex] = updatedSkillTest;

        setCurrentSkillTest(updatedSkillTest);
        setSkillTests(skillTestsCopy);
    };

    const onDelete = () => {
        if (skillTests.length === 1 || !currentSkillTest) {
            return;
        }

        const currentSkillTestIndex = skillTests.findIndex(
            (dialogue) => dialogue.id === currentSkillTest.id,
        );
        if (currentSkillTestIndex === -1) {
            return;
        }

        const dialoguesCopy = [...skillTests];
        dialoguesCopy.splice(currentSkillTestIndex, 1);

        setCurrentSkillTest(null);
        setSkillTests(dialoguesCopy);
    };

    return currentSkillTest ? (
        <SkillTestMaker currentSkillTest={currentSkillTest} onSave={onSave} onDelete={onDelete} />
    ) : null;
};
