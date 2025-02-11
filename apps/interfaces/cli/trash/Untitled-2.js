

describe('mergeDelta', () => {

    it('should correctly merge delta object', () => {
        const response = {
            "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
            "system_fingerprint": "fp_a24b4d720c",
            "choices": [
                {
                    "index": 0,
                    "role": "assistant",
                    "content": "John",
                    "age": 28,
                    "finish_reason": null
                }
            ]
        };
        let chunks = [
            {
                index: 0,
                delta: {
                    content: ' Doe',
                    age: '25'
                }
            },
            {
                index: 0,
                delta: {
                    content: ' Sr.',
                    age: '32'
                }
            }
        ]

        for (const chunk of chunks) {
            mergeDelta(chunk, 'choices', response, ['content']);
        }

        expect(response.id).to.equal("chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI");
        expect(response.choices[0].content).to.equal('John Doe Sr.');
        expect(response.choices[0].age).to.equal('32');
    });
    it('handles undefined content in starting object', () => {
        const response = {
            "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
            "system_fingerprint": "fp_a24b4d720c",
            "choices": [
                {
                    "index": 0,
                    "role": "assistant",
                    // content is undefined here
                    "age": 28,
                    "finish_reason": null
                }
            ]
        };
        let chunks = [
            {
                index: 0,
                delta: {
                    content: ' Doe',
                    age: '25'
                }
            },
            {
                index: 0,
                delta: {
                    content: ' Sr.',
                    age: '32'
                }
            }
        ]

        for (const chunk of chunks) {
            mergeDelta(chunk, 'choices', response, ['content']);
        }

        expect(response.id).to.equal("chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI");
        expect(response.choices[0].content).to.equal(' Doe Sr.');
        expect(response.choices[0].age).to.equal('32');
    });
    it('handles no content array in starting object', () => {
        const response = {
            "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
            "system_fingerprint": "fp_a24b4d720c",
        };
        let chunks = [
            {
                index: 0,
                delta: {
                    content: ' Doe',
                    age: '25'
                }
            },
            {
                index: 0,
                delta: {
                    content: ' Sr.',
                    age: '32'
                }
            }
        ]

        for (const chunk of chunks) {
            mergeDelta(chunk, 'choices', response, ['content']);
        }

        expect(response.id).to.equal("chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI");
        expect(response.choices[0].content).to.equal(' Doe Sr.');
        expect(response.choices[0].age).to.equal('32');
    });
    it('handles multiple indexes  in starting object', () => {
        const response = {
            "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
            "system_fingerprint": "fp_a24b4d720c",
            choices: [{}]
        };
        let chunks = [
            {
                index: 1,
                delta: {
                    content: ' Doe',
                    age: '25'
                }
            },
            {
                index: 1,
                delta: {
                    content: ' Sr.',
                    age: '32'
                }
            },
            {
                index: 2,
                delta: {
                    content: 'Third',
                    age: '34'
                }
            }
        ]

        for (const chunk of chunks) {
            mergeDelta(chunk, 'choices', response, ['content']);
        }

        expect(response.id).to.equal("chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI");
        expect(response.choices[1].content).to.equal(' Doe Sr.');
        expect(response.choices[1].age).to.equal('32');
        expect(response.choices[2].content).to.equal('Third');
        expect(response.choices[2].age).to.equal('34');
    });
});

