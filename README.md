# triplecheck-repository-fauna

## TripleCheck: FaunaDB database repository

Database utility for using FaunaDB with the [TripleCheck broker](https://github.com/mikaelvesavuori/triplecheck-broker). It implements the repository base at [triplecheck-core](https://github.com/mikaelvesavuori/triplecheck-core).

## Instructions

- In Fauna, create a database called `triplecheck-broker`.
- Under `Security`, create a key for the database and set the role to `Server`
- Paste the key's value into the `.env` file like this: `FAUNA_KEY=some-secret-random-key`
- Create a new collection (call it `triplecheck`)
- Create an index called `Key` and set the term to `data.key`; also enable `Serialized` and `Unique`
