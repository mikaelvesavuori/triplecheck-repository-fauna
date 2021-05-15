import { FaunaRepository } from '../src/index';

const db = FaunaRepository();

db.updateData('dependents', {
  'api-provider': { '1.3.0': ['demo-provider@1.0.0'], '1.3.2': ['demo-provider@1.0.0'] },
  'some-provider': { '0.0.1': ['demo-provider@1.0.0'] },
  'something-random-123': { '5.2.1': ['demo-provider@1.0.0'] }
});

db.getData('dependents');

db.deleteData('dependents');
