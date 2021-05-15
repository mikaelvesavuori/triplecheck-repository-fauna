"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewFaunaRepository = void 0;
const tslib_1 = require("tslib");
const faunadb_1 = tslib_1.__importStar(require("faunadb"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
function createNewFaunaRepository() {
    if (!process.env.FAUNA_KEY)
        throw new Error('Missing FaunaDB key!');
    const client = new faunadb_1.default.Client({
        secret: process.env.FAUNA_KEY
    });
    const fauna = new FaunaRepository(client);
    return fauna;
}
exports.createNewFaunaRepository = createNewFaunaRepository;
class FaunaRepository {
    constructor(client) {
        this.client = client;
    }
    getData(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.query(faunadb_1.query.Get(faunadb_1.query.Match(faunadb_1.query.Index('Key'), key)));
                return data.data.value;
            }
            catch (error) {
                console.error('Error getting data!', error.message);
            }
        });
    }
    updateData(key, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = {
                data: {
                    key,
                    value: data
                }
            };
            try {
                const documentExists = yield this.getData(key);
                const promise = (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (documentExists)
                        return yield this.client.query(faunadb_1.query.Replace(faunadb_1.query.Select(['data', 0], faunadb_1.query.Paginate(faunadb_1.query.Match(faunadb_1.query.Index('Key'), key))), payload));
                    else
                        return yield this.client.query(faunadb_1.query.Create(faunadb_1.query.Ref(faunadb_1.query.Collection('triplecheck'), faunadb_1.query.NewId()), payload));
                }))();
                const data = yield promise;
                if (!data)
                    throw new Error('Failed to create/update entry!');
            }
            catch (error) {
                console.error('Error updating!', error.message);
            }
        });
    }
    deleteData(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.query(faunadb_1.query.Delete(faunadb_1.query.Select(['data', 0], faunadb_1.query.Paginate(faunadb_1.query.Match(faunadb_1.query.Index('Key'), key)))));
            }
            catch (error) {
                console.error('Error deleting!', error.message);
            }
        });
    }
}
//# sourceMappingURL=FaunaRepository.js.map