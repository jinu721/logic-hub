"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLean = toLean;
exports.toLeanMany = toLeanMany;
exports.populateAndLean = populateAndLean;
exports.populateAndLeanMany = populateAndLeanMany;
function toLean(query) {
    return query.lean().exec();
}
function toLeanMany(query) {
    return query.lean().exec();
}
function populateAndLean(query, populateFn) {
    return populateFn(query).lean().exec();
}
function populateAndLeanMany(query, populateFn) {
    return populateFn(query).lean().exec();
}
