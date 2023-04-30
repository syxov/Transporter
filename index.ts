interface NewLineUnit<T = unknown> {
    id: string;
    fn: (data: T) => T;
}

interface LineUnit<T = unknown> extends NewLineUnit<T> {
    data: T;
}

export class Transporter<DataType = unknown> {
    private line: LineUnit<DataType>[] = [];

    constructor(private data: DataType) {}

    public updateData(data: DataType): void {
        this.data = data;
        this.updateDataInLine(0);
    }

    public addOrUpdateLineUnit(unit: NewLineUnit<DataType>): void {
        const index = this.line.findLastIndex((lineUnit) => {
            return lineUnit.id === unit.id;
        });
        if (index === -1) {
            const newUnit: LineUnit<DataType> = {
                ...unit,
                data: unit.fn(this.getProcessedData()),
            }
            this.line.push(newUnit);
        } else {
            this.line[index].fn = unit.fn;

            if (index !== (this.line.length - 1)) {
                const lastItem = this.line[this.line.length - 1];
                this.line[this.line.length - 1] = this.line[index];
                this.line[index] = lastItem;
            }

            this.updateDataInLine(index);
        }
    }

    public deleteLineUnit(id: string): void {
        const index = this.line.findLastIndex((lineUnit) => {
            return lineUnit.id === id;
        });
        if (index !== -1) {
            this.line.splice(index, 1);
            this.updateDataInLine(index);
        }
    }

    public getProcessedData(): DataType {
        return this.line.length > 0 ? this.line[this.line.length - 1].data : this.data;
    }

    private updateDataInLine(fromIndex: number): void {
        for (let i = fromIndex; i < this.line.length; i++) {
            this.line[i].data = this.line[i].fn(i === 0 ? this.data : this.line[i - 1].data);
        }
    }
}
