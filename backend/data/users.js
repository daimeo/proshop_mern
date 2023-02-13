import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

faker.locale = "vi";
let users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
];

for (let i = 0; i < 5; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    users.push({
        name: lastName + " " + firstName,
        email: faker.internet.exampleEmail(firstName, lastName).toLowerCase(),
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
    });
}

export default users;
