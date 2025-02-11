// | Type          | $eq | $ne | $lt | $lte | $gt | $gte | $like | $ilike | $in | $nin | Index |
// |---------------|-----|-----|-----|------|-----|------|-------|--------|-----|-----|-------|
// | Date          | ✅  | ❌  | ❌  | ✅   | ❌  | ✅   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Integer       | ✅  | ❌  | ✅  | ❌   | ✅  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Float         | ✅  | ❌  | ❌  | ❌   | ✅  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | String        | ✅  | ❌  | ❌  | ❌   | ❌  | ❌   | ✅    | ✅     | ✅  | ✅  | ❌    |
// | Array Date    | ❌  | ❌  | ❌  | ❌   | ❌  | ❌   | ❌    | ❌     | ✅  | ✅  | ❌    |
// | Array Integer | ❌  | ❌  | ❌  | ❌   | ❌  | ❌   | ❌    | ❌     | ✅  | ✅  | ❌    |
// | Array Float   | ❌  | ❌  | ❌  | ❌   | ❌  | ❌   | ❌    | ❌     | ✅  | ✅  | ❌    |
// | Array String  | ❌  | ❌  | ❌  | ❌   | ❌  | ❌   | ❌    | ❌     | ✅  | ✅  | ✅    |


// | Nested Type       | $eq | $ne | $lt | $lte | $gt | $gte | $like | $ilike | $in | $nin | Index |
// |-------------------|-----|-----|-----|------|-----|------|-------|--------|-----|-----|-------|
// | Nested Date       | ❌  | ❌  | ❌  | ✅   | ❌  | ✅   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Nested Integer    | ❌  | ❌  | ✅  | ❌   | ✅  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Nested Float      | ❌  | ❌  | ❌  | ❌   | ✅  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Nested String     | ✅  | ❌  | ❌  | ❌   | ❌  | ❌   | ✅    | ✅     | ✅  | ✅  | ❌    |
// | Nested Array Date | ❌  | ❌  | ❌  | ✅   | ❌  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Nested Array Int  | ❌  | ❌  | ✅  | ❌   | ✅  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Nested Array Float| ❌  | ❌  | ❌  | ❌   | ✅  | ❌   | ❌    | ❌     | ❌  | ❌  | ❌    |
// | Nested Array Str  | ✅  | ❌  | ❌  | ❌   | ❌  | ❌   | ✅    | ✅     | ✅  | ✅  | ❌    |


export const aList = []
export const qoList = []


/* RIGHT HAND ONLY ARRAYS
 * casts both sides as strings and matches string to ANY value in the array
 */
aList.push(1)
qoList.push({ metadata: { user: { details: {
    birthDate: { '$like[]': ['1990-%-01T00:00:00Z'] }
}}}})

aList.push(1)
qoList.push({ metadata: { user: { details: {
    birthDate: { '$ilike[]': ['1990-01-01t%'] }
}}}})

aList.push(1)
qoList.push({ metadata: { user: { details: {
    height: { $in: [6.0, 5.9] }
}}}})

aList.push(1)
qoList.push({ metadata: { user: { details: {
    height: {'$notilike[]': ['6%'] }
}}}})

aList.push(1)
qoList.push({ metadata: { user: { details: {
    height: {'$nin': [5.9] }
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
    nickname: {'$nin': ['Techie'] }
}}}})





/* LEFT HAND ONLY ARRAYS
 * assumes left hand is an array and matches for which the right side matches 1+ times.
 */
aList.push(1)
qoList.push({ metadata: { user: { details: {
    floatArray: { $len: { $gt: 1 } }
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
    floatArray: { $len: { $gte: 2 } }
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
    floatArray: { $len: { $lt: 2 } }
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
    floatArray: { $len: { $lte: 1 } }
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
    floatArray: { $len: 1 } 
}}}})

aList.push(1)
qoList.push({ metadata: { user: { details: {
    floatArray: { $contains: 5.5 } 
}}}})

/* 
// aList.push(1)
// qoList.push({ metadata: { user: { details: {
//   floatArray: { $contains:  {"floatNumber": 5} } 
// }}}})
*/
aList.push(1)
qoList.push({ metadata: { user: { details: {
  hobbies: { $contains: 'gaming' } 
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
  nestedFloat: { $contains: '5' } 
}}}})
aList.push(1)
qoList.push({ metadata: { user: { details: {
  nestedFloat: { $contains: 5 } 
}}}})



/**
 * NEITHER ARRAY
 * assumes both sides are scalars
 */
// Test for equality
aList.push(1);
qoList.push({ metadata: { user: { details: {
  nickname: { $eq: 'Johnny' }
}}}});

// Test for inequality
aList.push(1);
qoList.push({ metadata: { user: { details: {
  age: { $ne: 38 }
}}}});

// Test for greater than
aList.push(1);
qoList.push({ metadata: { user: { details: {
  height: { $gt: 6.0 }
}}}});

// Test for greater than or equal
aList.push(1);
qoList.push({ metadata: { user: { details: {
  floatValue: { $gte: 6.0 }
}}}});

// Test for less than
aList.push(1);
qoList.push({ metadata: { user: { details: {
  age: { $lt: 35 }
}}}});

// Test for less than or equal
aList.push(1);
qoList.push({ metadata: { user: { details: {
  birthDate: { $lte: '1989-01-01T00:00:00Z' }
}}}});

// Test for like
aList.push(1);
qoList.push({ metadata: { user: { details: {
  nickname: { $like: '%John%' }
}}}});

// Test for not like
aList.push(1);
qoList.push({ metadata: { user: { details: {
  nickname: { $notlike: '%Techie%' }
}}}});

// Test for ilike (case-insensitive like)
aList.push(1);
qoList.push({ metadata: { user: { details: {
  nickname: { $ilike: '%john%' }
}}}});

// Test for not ilike (case-insensitive not like)
aList.push(1);
qoList.push({ metadata: { user: { details: {
  nickname: { $notilike: '%tEChie%' }
}}}});


/** BOTH ARRAYS
 * 
 */
// $any operator tests
// Should return documents where any of the specified values are in the 'intArray'
aList.push(1); // Expecting 2 documents to match
qoList.push({ metadata: { user: { details: {
  intArray: { $any: [7, 10] }
}}}});

// Should return documents where any of the specified values are in the 'floatArray'
aList.push(1); // Expecting 1 document to match
qoList.push({ metadata: { user: { details: {
  floatArray: { $any: [6.5, 3.2] }
}}}});

// $all operator tests
aList.push(1); // Expecting 1 document to match
qoList.push({ metadata: { user: { details: {
  intArray: { $all: [10] }
}}}});

aList.push(1); // Expecting 1 document to match
qoList.push({ metadata: { user: { details: {
  floatArray: { $all: [4.5, 3.2] }
}}}});

// $any operator tests with dates
aList.push(2); // Expecting 2 documents to match
qoList.push({ metadata: { user: { details: {
  dateArray: { $any: ['2023-01-01T00:00:00Z', '2022-12-31T00:00:00Z'] }
}}}});

// $all operator tests with dates
aList.push(1); // Expecting 1 document to match
qoList.push({ metadata: { user: { details: {
  dateArray: { $all: ['2023-01-01T00:00:00Z'] }
}}}});

// $any operator tests with strings
// Should return documents where any of the specified strings are in the 'hobbies' array
aList.push(1); // Expecting 2 documents to match because both have 'reading' or 'swimming'
qoList.push({ metadata: { user: { details: {
  hobbies: { $any: ['gaming','math'] }
}}}});

// $all operator tests with strings
// Should return documents where all of the specified strings are a subset of 'hobbies' array
aList.push(1); // Expecting 1 document to match because object1 has both 'reading' and 'swimming'
qoList.push({ metadata: { user: { details: {
  hobbies: { $all: ['reading', 'swimming'] }
}}}});




// /**
//  * Nested Array
//  * assumes both sides are scalars
//  */

/* // REMOVED because direct search is not allowed with *
aList.push(1);
qoList.push({ metadata: { user: { details: {
    list: { '*': 'item2' }
}}}}); // Checks nesting string- if 'list' contains 'item2'
*/

aList.push(1);
qoList.push({ metadata: { user: { details: {
    list2: { '*': { a: 'b' } }
}}}}); // Checks nesting object - if any object in 'list2' has a key 'a' with value 'b'

aList.push(1);
qoList.push({ metadata: { user: { details: {
    list3: { '*': { n: { '$contains': 1 } } }
}}}}); // Checks double nesting number - if any object in 'list3' has a key 'n' containing the number 1

aList.push(1);
qoList.push({ metadata: { user: { details: {
    list4: { 1: { a: 'b' } }
}}}}); // Checks exact index - if the second element in 'list4' has a key 'a' with value 'b'

aList.push(1);
qoList.push({ metadata: { user: { details: {
    list8: { '*': {n: { '*': { a: 'x' } }}}
}}}}); // Checks exact index - if the second element in 'list4' has a key 'a' with value 'b'

aList.push(1);
qoList.push({ metadata: { user: { details: {
    list8: { '*': { n: { 0: { a: 'x' } }}}
}}}}); // Checks exact index - if the second element in 'list4' has a key 'a' with value 'b'








// export const a27 = 1;
// export const qo27 = { metadata: { user: { details: {
//     birthDate: { $eq: '1990-01-01T00:00:00Z' }
// }}}}; // Checks if 'birthDate' is exactly '1990-01-01T00:00:00Z'

// export const a28 = 1;
// export const qo28 = { metadata: { user: { details: {
//     age: { $gt: 30 }
// }}}}; // Checks if 'age' is greater than 30

// export const a29 = 1;
// export const qo29 = { metadata: { user: { details: {
//     height: { $lt: 6.0 }
// }}}}; // Checks if 'height' is less than 6.0

// export const a30 = 1;
// export const qo30 = { metadata: { user: { details: {
//     nickname: { $ilike: '%john%' }
// }}}}; // Checks if 'nickname' case-insensitively contains 'john'

// export const a13 = 2;
// export const qo13 = { metadata: {
//     status: { '$ilike[]': ['active', 'inactive'] }
// }}; // Checks if 'status' is case-insensitively like 'active' or 'inactive'

// aList.push(a27, a28, a29, a30);
// qoList.push(qo27, qo28, qo29, qo30);








// // NESTING

// export const a2 = 1;
// export const qo2 = { metadata: { user: { details: {
//     list: { '*': 'item2' }
// }}}}; // Checks nesting string- if 'list' contains 'item2'

// export const a3 = 1;
// export const qo3 = { metadata: { user: { details: {
//     list2: { '*': { a: 'b' } }
// }}}}; // Checks nesting object - if any object in 'list2' has a key 'a' with value 'b'

// export const a4 = 1;
// export const qo4 = { metadata: { user: { details: {
//     list3: { '*': { n: { '*': 1 } } }
// }}}}; // Checks double nesting number - if any object in 'list3' has a key 'n' containing the number 1

// export const a5 = 1;
// export const qo5 = { metadata: { user: { details: {
//     list4: { 1: { a: 'b' } }
// }}}}; // Checks exact index - if the second element in 'list4' has a key 'a' with value 'b'


// export const a7 = 1;
// export const qo7 = { metadata: { user: { details: {
//     list7: { $len: { $gte: 2 } }
// }}}}; // Checks if 'list7' has a length of at least 2

// export const a8 = 1;
// export const qo8 = { metadata: { user: { details: {
//     list8: { '*': { n: { '*': { a: 'b' } } } }
// }}}}; // Checks double nesting - if any object in 'list8' has a key 'n' containing an object with key 'a' and value 'b'

// export const a9 = 1;
// export const qo9 = { metadata: {
//     status: 'active'
// }}; // Checks if 'status' is 'active'

// export const a10 = 2;
// export const qo10 = { metadata: {
//     status: { $like: '%active%' }
// }}; // Checks if 'status' contains the substring 'active'


// export const a14 = 1;
// export const qo14 = { metadata: { user: { details: {
//     list9: { '*': { date: { $gte: '2023-01-01T00:00:00Z' } } }
// }}}}; // Checks if any date in 'list9' is greater than or equal to '2023-01-01T00:00:00Z'

// export const a15 = 1;
// export const qo15 = { metadata: { user: { details: {
//     list10: { '*': { number: { $gt: 10 } } }
// }}}}; // Checks if any number in 'list10' is greater than 10

// export const a16 = 1;
// export const qo16 = { metadata: { user: { details: {
//     list11: { '*': { text: { $ilike: '%example%' } } }
// }}}}; // Checks if any text in 'list11' case-insensitively contains 'example'

// export const a17 = 1;
// export const qo17 = { metadata: { user: { details: {
//     list10: { '*': { number: { $lt: 10 } } }
// }}}}; // Checks if any number in 'list10' is less than 10

// export const a18 = 0;
// export const qo18 = { metadata: { user: { details: {
//     list12: { '*': { floatNumber: { $gt: 5.5 } } }
// }}}}; // Checks if any floatNumber in 'list12' is greater than 5.5

// export const a19 = 1;
// export const qo19 = { metadata: { user: { details: {
//     list9: { '*': { date: { $lte: '2023-01-01T00:00:00Z' } } }
// }}}}; // Checks if any date in 'list9' is less than or equal to '2023-01-01T00:00:00Z'

// export const a20 = 1;
// export const qo20 = { metadata: { user: { details: {
//     floatValue: { $gt: 5.5 }
// }}}}; // Checks if 'floatValue' is greater than 5.5


// export const a1 = 1;
// export const qo1 = { metadata: { user: { details: {
//     hobbies: { $in: ['reading', 'swimming','running'] }
// }}}}; // Checks if 'hobbies' includes 'reading' or 'swimming'

// export const a6 = 1;
// export const qo6 = { metadata: { user: { details: {
//     list6: { $eq: [{ a: 'b', c: 'd' }] }
// }}}}; // Checks if 'list6' exactly matches the array [{ a: 'b', c: 'd' }]

// export const a11 = 1;
// export const qo11 = { metadata: {
//     tags: { $in: ['sports', 'health'] }
// }}; // Checks if 'tags' includes 'sports' or 'health'

// export const a12 = 1;
// export const qo12 = { metadata: {
//     items: { $nin: ['item1', 'item3'] }
// }}; // Checks if 'items' does not include 'item1' or 'item3'




// // BOTH ARRAYS
// export const a21 = 1;
// export const qo21 = { metadata: { user: { details: {
//     dateArray: { $in: ['2023-01-01T00:00:00Z'] }
// }}}}; // Checks if 'dateArray' includes '2023-01-01T00:00:00Z'

// export const a22 = 1;
// export const qo22 = { metadata: { user: { details: {
//     intArray: { $in: [10] }
// }}}}; // Checks if 'intArray' includes 10

// export const a23 = 1;
// export const qo23 = { metadata: { user: { details: {
//     floatArray: { $in: [5.5] }
// }}}}; // Checks if 'floatArray' includes 5.5







// export const a24 = 1;
// export const qo24 = { metadata: { user: { details: {
//     nestedFloat: { $gt: 5.5 }
// }}}}; // Checks if any 'nestedFloat' is greater than 5.5

// export const a25 = 1;
// export const qo25 = { metadata: { user: { details: {
//     nestedDateArray: { '*': { date: { $lte: '2023-01-01T00:00:00Z' } } }
// }}}}; // Checks if any date in 'nestedDateArray' is less than or equal to '2023-01-01T00:00:00Z'

// export const a26 = 1;
// export const qo26 = { metadata: { user: { details: {
//     nestedFloatArray: { '*': { floatNumber: { $gt: 5.5 } } }
// }}}}; // Checks if any floatNumber in 'nestedFloatArray' is greater than 5.5

export let object1 = {
  "tags": [
    "sports",
    "health"
  ],
  "user": {
    "details": {
      "list": [
        "item2"
      ],
      "list2": [
        {
          "a": "b"
        }
      ],
      "list3": [
        {
          "n": [
            1
          ]
        }
      ],
      "list4": [
        null,
        {
          "a": "b"
        }
      ],
      "list6": [
        {
          "a": "b",
          "c": "d"
        }
      ],
      "list7": [
        1,
        2
      ],
      "list8": [
        {
          "n": [
            {
              "a": "b"
            }
          ]
        }
      ],
      "list9": [
        {
          "date": "2023-01-02T00:00:00Z"
        }
      ],
      "list10": [
        {
          "number": 15
        }
      ],
      "list11": [
        {
          "text": "This is an example text"
        }
      ],
      "hobbies": [
        "reading",
        "swimming"
      ],
      "floatValue": 6.0,
      "dateArray": ["2023-01-01T00:00:00Z"],
      "intArray": [10],
      "floatArray": [5.5],
      "nestedFloat": [6.0],
      "nestedDateArray": [
        { "date": "2022-12-31T00:00:00Z" }
      ],
      "nestedFloatArray": [
        { "floatNumber": 6.0 }
      ],
      "birthDate": "1990-01-01T00:00:00Z", // New date field
      "age": 33, // New integer field
      "height": 5.9, // New float field
      "nickname": "Johnny" // New string field
    }
  },
  "items": [],
  "status": "active"
};

export let object2 = {
  "tags": [
    "technology",
    "education"
  ],
  "user": {
    "details": {
      "list": [
        "item3"
      ],
      "list2": [
        {
          "a": "c"
        }
      ],
      "list3": [
        {
          "n": [
            2
          ]
        }
      ],
      "list4": [
        null,
        {
          "a": "c"
        }
      ],
      "list6": [
        {
          "a": "x",
          "c": "y"
        }
      ],
      "list7": [
        1
      ],
      "list8": [
        {
          "n": [
            {
              "a": "x"
            }
          ]
        }
      ],
      "list9": [
        {
          "date": "2022-12-31T23:59:59Z"
        }
      ],
      "list10": [
        {
          "number": 5
        }
      ],
      "list11": [
        {
          "text": "This is a different text"
        }
      ],
      "hobbies": [
        "gaming",
        "coding"
      ],
      "floatValue": 5.0,
      "dateArray": ["2022-12-31T00:00:00Z"],
      "intArray": [5],
      "floatArray": [4.5,3.2],
      "nestedFloat": [5.0],
      "nestedDateArray": [
        { "date": "2023-01-02T00:00:00Z" }
      ],
      "nestedFloatArray": [
        { "floatNumber": 5.0 }
      ],
      "birthDate": "1985-05-15T00:00:00Z", // New date field
      "age": 38, // New integer field
      "height": 6.1, // New float field
      "nickname": "Techie" // New string field
    }
  },
  "items": [
    "item1"
  ],
  "status": "inactive"
};