import {Transporter} from "../index";

const data: {age: number, name: string}[] = [];

for (let i = 0; i < 10_000; i++) {
    data.push({
       age: ~~(Math.random() * 100),
       name: ~~(Math.random() * 100) + 'Test',
    });
}

describe('testing lib', () => {
    test('transporter should be work fine if add and delete', () => {
        const line = new Transporter<{age: number, name: string}[]>(structuredClone(data));
        line.addOrUpdateLineUnit({
            id: "olderThan16",
            fn(data) {
                return data.filter(item => item.age > 16);
            }
        });

        line.addOrUpdateLineUnit({
            id: "nameStartsFrom2",
            fn(data) {
                return data.filter(item => item.name.startsWith('2'));
            }
        })

        expect(line.getProcessedData()).toEqual(data.filter(item => {
            return item.age > 16 && item.name.startsWith('2');
        }));

        line.deleteLineUnit('olderThan16');

        expect(line.getProcessedData()).toEqual(data.filter(item => {
            return item.name.startsWith('2');
        }));
    });

    test('transporter should be work fine if update', () => {
        const line = new Transporter<{age: number, name: string}[]>(structuredClone(data));
        line.addOrUpdateLineUnit({
            id: "olderThan",
            fn(data) {
                return data.filter(item => item.age > 16);
            }
        });

        line.addOrUpdateLineUnit({
            id: "nameStartsFrom2",
            fn(data) {
                return data.filter(item => item.name.startsWith('2'));
            }
        })

        line.addOrUpdateLineUnit({
            id: "olderThan",
            fn(data) {
                return data.filter(item => item.age > 24);
            }
        });

        expect(line.getProcessedData()).toEqual(data.filter(item => {
            return item.age > 24 && item.name.startsWith('2');
        }));
    });
});
