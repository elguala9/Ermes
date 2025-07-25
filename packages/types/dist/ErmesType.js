"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValue = void 0;
// b -> base message 
// c -> chunk 
// s -> service message
var MessageValue;
(function (MessageValue) {
    MessageValue[MessageValue["base"] = 0] = "base";
    MessageValue[MessageValue["chunk"] = 1] = "chunk";
    MessageValue[MessageValue["service"] = 2] = "service";
})(MessageValue || (exports.MessageValue = MessageValue = {}));
//# sourceMappingURL=ErmesType.js.map