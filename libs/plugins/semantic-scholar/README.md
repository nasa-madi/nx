# madi-plg-semantic-scholar
This plugin connects Semantic Scholar's search capabiltity into the MADI AI system.  

                    
[![NPM](https://img.shields.io/npm/l/madi-plg-semantic-scholar)](https://github.com/nasa-madi/madi-plg-semantic-scholar/blob/main/LICENSE) 

[![npm](https://img.shields.io/npm/v/madi-plg-semantic-scholar?label=latest)](https://www.npmjs.com/package/madi-plg-semantic-scholar)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nasa-madi/madi-plg-semantic-scholar/npm-publish.yml?branch=main)

[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/NPM/madi-plg-semantic-scholar)]()

<!-- [![Download Status](https://img.shields.io/npm/dm/madi-plg-semantic-scholar.svg)](https://www.npmjs.com/package/madi-plg-semantic-scholar) -->





## Installation


### `service(options)`
__Options:__
- `disableHeader` (**optional**, default: `false`) - Set to true to prevent the `x-service-method` header from being overwritten by the middleware.  The RPC verb can still get captured and used from the Feathers hook ctx object.
- `allowedRpcVerbs` (**optional**. default: `any`) - Accepts a string or an array of strings.  Defaults to fully open, allowing any verb.  Setting to `[]` will disallow any verb. In order to use the `x-service-method` automatic call, the custom method of the service **must** be named exactly the same as the verb sent.


### Using this Template

```
git checkout -B main; git branch --set-upstream-to=origin/main;
git checkout -B beta; git branch --set-upstream-to=origin/beta;
git checkout -B alpha; git branch --set-upstream-to=origin/alpha;
```

```bash
gh secret set NPM_TOKEN --repo nasa-madi/madi-plg-semantic-scholar
```

### Extending an existing Service


## Contributing
Please see https://github.com/nasa-madi/madi-plg-semantic-scholar/blob/main/.github/contributing.md

