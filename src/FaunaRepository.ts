import { Repository } from 'triplecheck-core';
import faunadb, { query as q } from 'faunadb';
import dotenv from 'dotenv';

dotenv.config();

export function createNewFaunaRepository() {
  if (!process.env.FAUNA_KEY) throw new Error('Missing FaunaDB key!');
  const client = new faunadb.Client({
    secret: process.env.FAUNA_KEY
  });

  const fauna = new FaunaRepository(client);
  return fauna;
}

/**
 * @description FaunaDB repository for TripleCheck broker.
 * The business logic itself is encapsulated in the TripleCheck broker.
 */
class FaunaRepository implements Repository {
  client: any;

  constructor(client: any) {
    this.client = client;
  }

  /**
   * @description Get data for the provided key.
   */
  async getData(key: string): Promise<any> {
    try {
      const data = await this.client.query(q.Get(q.Match(q.Index('Key'), key)));
      return data.data.value;
    } catch (error) {
      console.error('Error getting data!', error.message);
    }
  }

  /**
   * @description Put data at the provided document key. Stringify data and place it under a "value" key.
   * We use `.Replace()` instead of `.Update()` so it will remove anything not contained in the new data.
   */
  async updateData(key: string, data: any): Promise<void> {
    const payload = {
      data: {
        key,
        value: data
      }
    };

    try {
      const documentExists = await this.getData(key);
      const promise = (async () => {
        // Update existing entry
        if (documentExists)
          return await this.client.query(
            q.Replace(q.Select(['data', 0], q.Paginate(q.Match(q.Index('Key'), key))), payload)
          );
        // Create new entry
        else
          return await this.client.query(
            q.Create(q.Ref(q.Collection('triplecheck'), q.NewId()), payload)
          );
      })();

      const data = await promise;

      if (!data) throw new Error('Failed to create/update entry!');
    } catch (error) {
      console.error('Error updating!', error.message);
    }
  }

  /**
   * @description Delete data for type and service.
   */
  async deleteData(key: string): Promise<void> {
    try {
      await this.client.query(
        q.Delete(q.Select(['data', 0], q.Paginate(q.Match(q.Index('Key'), key))))
      );
    } catch (error) {
      console.error('Error deleting!', error.message);
    }
  }
}
