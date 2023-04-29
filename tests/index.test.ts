import {Transporter} from "../index";

const data = [
    {
        age: 15,
        name: '2Test'
    },
    {
        age: 18,
        name: '1Test'
    },
    {
        age: 60,
        name: '2Test'
    }
]

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

        expect(line.getData()).toEqual([{
            age: 60,
            name: '2Test'
        }]);

        line.deleteLineUnit('olderThan16');

        expect(line.getData()).toEqual([{
            age: 15,
            name: '2Test'
        }, {
            age: 60,
            name: '2Test'
        }]);
    });

    test('transporter should be work fine if update', () => {
        const line = new Transporter<{age: number, name: string}[]>(structuredClone(data));
        line.addOrUpdateLineUnit({
            id: "olderThan",
            fn(data) {
                return data.filter(item => item.age > 16);
            }
        });

        expect(line.getData()).toEqual([
            {
                age: 18,
                name: '1Test'
            },
            {
                age: 60,
                name: '2Test'
            }
        ]);

        line.addOrUpdateLineUnit({
            id: "olderThan",
            fn(data) {
                return data.filter(item => item.age > 24);
            }
        });

        expect(line.getData()).toEqual([{
            age: 60,
            name: '2Test'
        }]);
    });
});
