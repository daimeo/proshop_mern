import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

faker.locale = "vi";
let users = [];

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

for (let i = 0; i < 5; i++) {
    users.push({
        name: firstName + lastName,
        email: faker.internet.exampleEmail(firstName),
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
    });
}

export default users;
