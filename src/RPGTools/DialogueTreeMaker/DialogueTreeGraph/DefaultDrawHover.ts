import { PlainObject } from 'sigma/types';

export const defaultCircleDrawHover = function (
    context: CanvasRenderingContext2D,
    data: PlainObject,
) {
    const { x, y, size: nodeSize, color } = data;

    const hoverSize = nodeSize * 1.1;

    context.beginPath();
    context.arc(x, y, hoverSize, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
};
