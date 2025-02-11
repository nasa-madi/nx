import { expect } from 'chai';



// Example usage
const response = {
    id: "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
    system_fingerprint: "fp_a24b4d720c",
};

const chunks = [
    {"choices":[{"index":0,"delta":{"role": "assistant","content": "John","age":30}}]},
    {"choices":[{"index":0,"delta":{"content":" Doe","age":"25"}}]},
    {"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"name":"get_weather","arguments":"a"}}]}}]},
    {"choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"b"}}]}}]},
    {"choices":[{"index":0,"delta":{"otherArray":[{"index":0,"function":{"arguments":"c"}}]}}]}
];


describe('handleDeltas', () => {
    it('should properly handle delta updates', () => {

        for (const chunk of chunks ){
            handleDeltas(chunk, response)

        }
        console.log(JSON.stringify(response, null, 2))

        expect(response).to.deep.equal({
            "id": "chatcmpl-8ObOw9AH2HPNU7bLLKzjYd8RUXBtI",
            "system_fingerprint": "fp_a24b4d720c",
            "choices": [
                {
                    "role": "assistant",
                    "content": "John Doe",
                    "age": '25',
                    "otherArray": [
                        {
                          "function": {
                            "arguments": "c"
                          }
                        }
                    ],
                    "tool_calls": [
                        {
                            "function":{
                                "name":"get_weather",
                                "arguments":"ab"
                            }
                        }
                    ]
                }
            ]
        });
    });
});
