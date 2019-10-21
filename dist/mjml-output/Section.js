"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blocks_1 = require("./blocks");
const utils_1 = require("./utils");
const defaultColumnsOptions = {
    background: {
        color: '#cccccc'
    },
    border: {
        width: 0,
        color: '#cccccc',
        radius: 0,
        style: 'solid'
    },
    verticalAlign: 'top'
};
class Section {
    constructor(structure) {
        this.structure = structure;
    }
    getBlock(block) {
        switch (block.type) {
            case 'text':
                return new blocks_1.Text(block.innerText, block.options).render();
            case 'image':
                return new blocks_1.Image(block.src, block.options).render();
            case 'button':
                return new blocks_1.Button(block.innerText, block.options).render();
            case 'divider':
                return new blocks_1.Divider(block.options).render();
            case 'spacer':
                return new blocks_1.Spacer(block.options).render();
            case 'social':
                return new blocks_1.Social(block.networks, block.options).render();
        }
    }
    getColumnWidth(index) {
        const { columnsWidth = utils_1.defaultStructureColumnsWidth(this.structure.type) } = this.structure.options;
        const fullWidth = columnsWidth.reduce((n, fr) => n + fr, 0);
        const colFr = columnsWidth[index];
        return Math.round((100 * colFr) / fullWidth);
    }
    createColumns() {
        const { elements, options: { disableResponsive = false, gaps = [4, 4], columns = [] } } = this.structure;
        const columnsElements = elements
            .map((el, index) => {
            const column = (columns && columns[index]) || defaultColumnsOptions;
            return `
          <mj-column
            width="${this.getColumnWidth(index)}%"
            background-color="${column.background.color}"
            padding="${gaps[0]}px ${gaps[1]}px"
            border="${utils_1.createBorder(column.border)}"
            border-radius="${column.border.radius || 0}px"
            vertical-align="${column.verticalAlign}"
            css-class="ip-column ${(column.border.radius || 0) > 0 ? 'ip-border-radius' : ''}">
            ${el.map(block => this.getBlock(block)).join('')}
          </mj-column>
        `;
        })
            .join('');
        if (disableResponsive) {
            return `<mj-group>${columnsElements}</mj-group>`;
        }
        return columnsElements;
    }
    render() {
        const { type, id, options } = this.structure;
        let cssClass = `${type} ${id} ip-section`;
        if (options.disableResponsive) {
            cssClass = `${cssClass} disable-responsive`;
        }
        return `
      <mj-section
        css-class="${cssClass}"
        border-radius="${options.border.radius}px"
        text-align="center"
        padding="${utils_1.createPadding(options.padding)}"
        background-color="${options.background.color}"
        background-url="${options.background.url}"
        background-repeat="${options.background.repeat}"
        background-size="${options.background.size
            ? utils_1.createWidthHeight(options.background.size)
            : 'auto'}">
        ${this.createColumns()}
      </mj-section>
      `;
    }
}
exports.Section = Section;
