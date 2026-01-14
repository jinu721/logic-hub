"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectId = void 0;
const mongoose_1 = require("mongoose");
const isObjectId = (val) => val instanceof mongoose_1.Types.ObjectId;
exports.isObjectId = isObjectId;
