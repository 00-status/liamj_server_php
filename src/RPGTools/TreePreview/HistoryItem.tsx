import './history-item.css';
import { DialogueHistory } from './domain/types';

type Props = {
    history: DialogueHistory;
};

export const HistoryItem = (props: Props) => {
    const { description, character, isChoice: isCentered } = props.history;

    const styles = character ? { color: character.nameColor } : undefined;

    const classes = 'history-item' + (isCentered ? ' history-item--centered' : '');

    return (
        <div className={classes}>
            {character ? (
                <div className="history-item__character" style={styles}>
                    {`[${character?.name}]`}
                </div>
            ) : null}
            <div className="history-item__text">{description}</div>
        </div>
    );
};
