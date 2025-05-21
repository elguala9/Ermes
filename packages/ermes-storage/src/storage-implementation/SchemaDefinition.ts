import { MessageWithId } from 'ermes-types';
import { PrimaryKey, RxJsonSchema, StringKeys } from 'rxdb';
import { MessageChunkStorage, MessageDataStorage, ServiceMessageStorage } from '../ErmesStorageType.js';
import rawSchemaMessageChunkStorage from './schemas/MessageChunkStorage.json' with { type: 'json' };
import rawSchemaMessageDataStorage from './schemas/MessageDataStorage.json' with { type: 'json' };
import rawSchemaServiceMessageStorage from './schemas/ServiceMessageStorage.json' with { type: 'json' };

type schemaCommonType = {
    required: StringKeys<MessageWithId>[] | readonly StringKeys<MessageWithId>[];
    additionalProperties: false;
    version: number;
    primaryKey: PrimaryKey<MessageWithId>;
}


const schemaCommon : schemaCommonType= {
    
    additionalProperties: false,
    version: 0,
    required: ['id'],
    primaryKey: 'id',
    
}
// all the schaema that will be used in the database
// to generate the json i used ts-json-schema-generator
export const messageDataSchema: RxJsonSchema<MessageDataStorage> = {
    ...rawSchemaMessageDataStorage.definitions.MessageDataStorage, 
    title: 'data message',
    type: 'MessageDataStorage',
    ...schemaCommon
};

export const messageChunkSchema: RxJsonSchema<MessageChunkStorage> = {
    ...rawSchemaMessageChunkStorage.definitions.MessageChunkStorage, 
    title: 'chunk message',
    type: 'MessageChunkStorage',
    ...schemaCommon
};

export const serviceMessageSchema: RxJsonSchema<ServiceMessageStorage> = {
    ...rawSchemaServiceMessageStorage.definitions.ServiceMessageStorage, 
    title: 'chunk message',
    type: 'MessageChunkStorage',
    ...schemaCommon
};