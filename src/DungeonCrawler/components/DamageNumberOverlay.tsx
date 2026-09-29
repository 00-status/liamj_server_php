import './damage-number-overlay.css';

type Props = {
    text: string;
    damageTypeTheme: string;
};

export const DamageNumberOverlay = ({ text, damageTypeTheme }: Props) => (
    <div className="damage-number-overlay" data-theme={damageTypeTheme}>
        {text}
    </div>
);
