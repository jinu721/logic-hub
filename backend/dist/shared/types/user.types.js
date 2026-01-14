"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["MODERATOR"] = "moderator";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var LoginType;
(function (LoginType) {
    LoginType["NORMAL"] = "normal";
    LoginType["GOOGLE"] = "google";
    LoginType["GITHUB"] = "github";
})(LoginType || (exports.LoginType = LoginType = {}));
