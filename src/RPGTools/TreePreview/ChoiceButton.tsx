import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { ConditionOutcome } from '../DialogueTreeMaker/domain/types';

import { Condition, PreviewChoice } from './domain/types';

type Props = {
    choice: PreviewChoice;
    currentConditions: Array<{ id: string; name: string }>;
    onClick: (
        nextNodeID: number,
        description: string,
        addToHistory: boolean,
        conditionOutcomes: Array<ConditionOutcome>,
    ) => void;
};

export const ChoiceButton = (props: Props) => {
    const { choice, currentConditions, onClick } = props;

    const meetingAllPrerequisites = arePrerequisitesMet(currentConditions, choice.prerequisiteIDs);

    return (
        <Button
            onClick={() =>
                onClick(
                    choice.nextNodeID,
                    '> ' + choice.name,
                    choice.addToHistory,
                    choice.conditionOutcomes,
                )
            }
            buttonTheme={ButtonTheme.Default}
            disabled={!meetingAllPrerequisites}
        >
            {choice.name}
        </Button>
    );
};

const arePrerequisitesMet = (
    conditions: Array<Condition>,
    prerequisiteIDs: Array<string>,
): boolean => {
    if (prerequisiteIDs.length === 0) {
        return true;
    }

    return prerequisiteIDs.every((id) => {
        return !!conditions.find((condition) => condition.id === id);
    });
};
