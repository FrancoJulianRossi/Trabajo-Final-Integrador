"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMock = void 0;
exports.seedUsers = seedUsers;
const user_entity_1 = require("./entities/user.entity");
class UserMock {
    data;
    constructor() {
        this.data = [];
        this.data.push(new user_entity_1.User(1, "John Doe", "kYz3K@example.com", "1234", true), new user_entity_1.User(2, "Jane Doe", "gA9LW@example.com", "1234", false));
    }
    getUsers() {
        return this.data;
    }
}
exports.UserMock = UserMock;
const userMockInstance = new UserMock();
exports.default = userMockInstance;
// allow seeding users
function seedUsers(initial) {
    // Update the default exported instance
    userMockInstance.data = initial.map((u, idx) => new user_entity_1.User(u.idUser ?? idx + 1, u.name, u.email, u.password, u.role));
    return userMockInstance;
}
//# sourceMappingURL=user.models.js.map