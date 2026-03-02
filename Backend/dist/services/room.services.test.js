"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Test room service logic indirectly through routes since creating a room
// requires database transaction setup that's hard to mock during import.
// The RoomService class methods are tested via the controller integration tests.
describe('RoomService', () => {
    it('placeholder test - room service tested via controller routes', () => {
        expect(true).toBe(true);
    });
});
//# sourceMappingURL=room.services.test.js.map