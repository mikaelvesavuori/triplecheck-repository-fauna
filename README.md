# triplecheck-repository-fauna

![TripleCheck database repository](readme/triplecheck-repository.png)

## TripleCheck: FaunaDB database repository

Database utility for using FaunaDB with the [TripleCheck broker](https://github.com/mikaelvesavuori/triplecheck-broker). It implements the repository base at [triplecheck-core](https://github.com/mikaelvesavuori/triplecheck-core).

## Instructions

- In Fauna, create a database called `triplecheck-broker`.
- Under `Security`, create a key for the database and set the role to `Server`
- Paste the key's value into the `.env` file like this: `FAUNA_KEY=some-secret-random-key`
- Create a new collection (call it `triplecheck`)
- Create an index called `Key` and set the term to `data.key`; also enable `Serialized` and `Unique`
- By default the Fauna repository will pick up an environment variable called `FAUNA_KEY` (as per above), so use something like [dotenv](https://www.npmjs.com/package/dotenv) to simplify getting that value

## Basic implementation

```TypeScript
import { TripleCheckBroker } from 'triplecheck-broker';
import { FaunaRepository } from 'triplecheck-repository-fauna';

import dotenv from 'dotenv';
dotenv.config();

const repository = FaunaRepository();
const request = "Get this from your API request and transform it as needed";
const payload = "Body";
const { responseData, status, headers } = await TripleCheckBroker(request, payload, repository);
```
