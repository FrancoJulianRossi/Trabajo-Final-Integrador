"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    idUser;
    name;
    email;
    password;
    role;
    constructor(idUser, name, email, password, role) {
        this.idUser = idUser;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    // GETTERS
    getIdUser() {
        return this.idUser;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getRole() {
        return this.role;
    }
    // SETTERS
    setName(name) {
        this.name = name;
    }
    setEmail(email) {
        this.email = email;
    }
    setPassword(password) {
        this.password = password;
    }
    setRole(role) {
        this.role = role;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map