export function createUserData() {
  return {
    name: `User-${Date.now()}`,
    email: `user${Date.now()}@test.com`,
    password: "123456",
  };
}