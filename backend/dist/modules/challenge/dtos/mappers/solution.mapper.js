"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicSolutionDTOs = exports.toPublicSolutionDTO = void 0;
const dtos_1 = require("../../../user/dtos");
const toPublicSolutionDTO = (solution) => {
    var _a, _b, _c;
    return {
        _id: solution._id.toString(),
        user: (0, dtos_1.toPublicUserDTO)(solution.user),
        challenge: typeof solution.challenge === 'object' && solution.challenge._id
            ? solution.challenge._id.toString()
            : solution.challenge.toString(),
        title: solution.title,
        content: solution.content,
        implementations: solution.implementations && solution.implementations.length > 0
            ? solution.implementations.map(impl => ({
                language: impl.language,
                codeSnippet: impl.codeSnippet
            }))
            : solution.codeSnippet || solution.language
                ? [{
                        language: solution.language || 'javascript',
                        codeSnippet: solution.codeSnippet || '// No code provided'
                    }]
                : [],
        likesCount: ((_a = solution.likes) === null || _a === void 0 ? void 0 : _a.length) || 0,
        likes: ((_b = solution.likes) === null || _b === void 0 ? void 0 : _b.map(like => like.toString())) || [],
        comments: ((_c = solution.comments) === null || _c === void 0 ? void 0 : _c.map(comment => ({
            _id: comment._id.toString(),
            user: (0, dtos_1.toPublicUserDTO)(comment.user),
            content: comment.content,
            commentedAt: comment.commentedAt,
        }))) || [],
        createdAt: solution.createdAt,
        updatedAt: solution.updatedAt,
    };
};
exports.toPublicSolutionDTO = toPublicSolutionDTO;
const toPublicSolutionDTOs = (solutions) => {
    return solutions.map(exports.toPublicSolutionDTO);
};
exports.toPublicSolutionDTOs = toPublicSolutionDTOs;
