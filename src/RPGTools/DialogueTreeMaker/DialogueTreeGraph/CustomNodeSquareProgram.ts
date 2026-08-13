import { NodeSquareProgram } from '@sigma/node-square';
import { PlainObject } from 'sigma/types';

const squareHoverRenderer = function (context: CanvasRenderingContext2D, data: PlainObject) {
    const { x, y, size: nodeSize, color } = data;

    const hoverSize = nodeSize * 1.1;

    context.fillStyle = color;
    context.fillRect(x - hoverSize, y - hoverSize, hoverSize * 2, hoverSize * 2);
};

export class CustomNodeSquareProgram extends NodeSquareProgram {
    override drawHover = squareHoverRenderer;
}
