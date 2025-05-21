import rawSchemaMessageChunkStorage from './schemas/MessageChunkStorage.json' with { type: 'json' };
import rawSchemaMessageDataStorage from './schemas/MessageDataStorage.json' with { type: 'json' };
import rawSchemaServiceMessageStorage from './schemas/ServiceMessageStorage.json' with { type: 'json' };
const schemaCommon = {
    additionalProperties: false,
    version: 0,
    required: ['id'],
    primaryKey: 'id',
};
// all the schaema that will be used in the database
// to generate the json i used ts-json-schema-generator
export const messageDataSchema = {
    ...rawSchemaMessageDataStorage.definitions.MessageDataStorage,
    title: 'data message',
    type: 'MessageDataStorage',
    ...schemaCommon
};
export const messageChunkSchema = {
    ...rawSchemaMessageChunkStorage.definitions.MessageChunkStorage,
    title: 'chunk message',
    type: 'MessageChunkStorage',
    ...schemaCommon
};
export const serviceMessageSchema = {
    ...rawSchemaServiceMessageStorage.definitions.ServiceMessageStorage,
    title: 'chunk message',
    type: 'MessageChunkStorage',
    ...schemaCommon
};
//# sourceMappingURL=SchemaDefinition.js.map