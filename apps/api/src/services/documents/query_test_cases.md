
# JSONB Test Cases for PostgreSQL Query Engine

## Sample Test Objects

### Object 1
```json
{
  "id": 1,
  "name": "Document One",
  "metadata": {
    "authors": ["Alice Smith", "Bob Johnson"],
    "type": ["Book", "Article"],
    "published": 2023,
    "tags": ["science", "technology"],
    "nested": {
      "level1": {
        "level2": {
          "entries": [5, 10, 15],
          "comments": [
            { "text": "Great work", "likes": 5 },
            { "text": "Needs improvement", "likes": 2 }
          ]
        }
      }
    }
  },
  "archived": false,
  "roomId": 2
}
```

### Object 2
```json
{
  "id": 2,
  "name": "Document Two",
  "metadata": {
    "authors": ["Charlie Brown"],
    "type": ["Research Paper"],
    "published": 2021,
    "tags": ["math", "science"],
    "nested": [
      {
        "level1": [
          { "level2": { "data": [1, 2, { "deep": [100, 200] }] } },
          { "level2": { "comments": ["Interesting", "Review"] } }
        ]
      }
    ]
  },
  "archived": true,
  "roomId": 5
}
```

## Test Query Path Statements and Query Objects

### 1. Query for \`metadata.authors\` containing "Alice Smith"

**Query Path Statement:**
```plaintext
metadata.authors[]=Alice Smith
```

**Query Object:**
```json
{
  "metadata": {
    "authors": ["Alice Smith"]
  }
}
```

### 2. Query for \`metadata.type\` being either "Book" or "Article"

**Query Path Statement:**
```plaintext
metadata.type[$in]=Book&metadata.type[$in]=Article
```

**Query Object:**
```json
{
  "metadata": {
    "type": {
      "$in": ["Book", "Article"]
    }
  }
}
```

### 3. Query for \`metadata.nested.level1.level2.entries\` containing any value greater than 10

**Query Path Statement:**
```plaintext
metadata.nested.level1.level2.entries[$gt]=10
```

**Query Object:**
```json
{
  "metadata": {
    "nested": {
      "level1": {
        "level2": {
          "entries": {
            "$gt": 10
          }
        }
      }
    }
  }
}
```

### 4. Query for \`metadata.nested.level1.level2.comments\` where \`likes\` is greater than 3

**Query Path Statement:**
```plaintext
metadata.nested.level1.level2.comments.likes[$gt]=3
```

**Query Object:**
```json
{
  "metadata": {
    "nested": {
      "level1": {
        "level2": {
          "comments": {
            "likes": {
              "$gt": 3
            }
          }
        }
      }
    }
  }
}
```

### 5. Query for \`metadata.nested\` containing objects with arrays of mixed types, including numbers and objects

**Query Path Statement:**
```plaintext
metadata.nested[0].level1[0].level2.data[2].deep[$in]=100&metadata.nested[0].level1[0].level2.data[2].deep[$in]=200
```

**Query Object:**
```json
{
  "metadata": {
    "nested": [
      {
        "level1": [
          {
            "level2": {
              "data": [
                null,
                null,
                {
                  "deep": {
                    "$in": [100, 200]
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

### 6. Query for \`metadata.tags\` containing all elements "science" and "technology"

**Query Path Statement:**
```plaintext
metadata.tags[$all]=science&metadata.tags[$all]=technology
```

**Query Object:**
```json
{
  "metadata": {
    "tags": {
      "$all": ["science", "technology"]
    }
  }
}
```

### 7. Query for \`metadata.tags\` containing any of "math" or "science"

**Query Path Statement:**
```plaintext
metadata.tags[$in]=math&metadata.tags[$in]=science
```

**Query Object:**
```json
{
  "metadata": {
    "tags": {
      "$in": ["math", "science"]
    }
  }
}
```

### 8. Query for \`metadata.nested\` where \`level2.comments\` contain "Review"

**Query Path Statement:**
```plaintext
metadata.nested[0].level1[1].level2.comments[$in]=Review
```

**Query Object:**
```json
{
  "metadata": {
    "nested": [
      {
        "level1": [
          null,
          {
            "level2": {
              "comments": {
                "$in": ["Review"]
              }
            }
          }
        ]
      }
    ]
  }
}
```

## Edge Case Considerations

### Arrays of Numeric Values

**Query Path Statement:**
```plaintext
metadata.nested.level1.level2.entries[$in]=5
```

### Mixed-Type Arrays

**Query Path Statement:**
```plaintext
metadata.nested[0].level1[0].level2.data[0][$exists]=true
```

### Deep Nested Arrays and Objects

**Query Path Statement:**
```plaintext
metadata.nested[0].level1[0].level2.data[2].deep[$gt]=150
```
