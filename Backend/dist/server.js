"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
(0, database_1.connectDB)().then(() => {
    app_1.default.listen(port, () => {
        // tslint:disable-next-line:no-console
        console.log(`Server listening on port ${port}`);
    });
});
//# sourceMappingURL=server.js.map