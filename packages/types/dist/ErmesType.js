"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_HEADER = exports.MessageValue = void 0;
// b -> base message 
// c -> chunk 
// s -> service message
var MessageValue;
(function (MessageValue) {
    MessageValue[MessageValue["base"] = 0] = "base";
    MessageValue[MessageValue["chunk"] = 1] = "chunk";
    MessageValue[MessageValue["service"] = 2] = "service";
})(MessageValue || (exports.MessageValue = MessageValue = {}));
exports.MAX_HEADER = 81; // 24 bytes, ChunkMessageGeneric
//# sourceMappingURL=ErmesType.js.map