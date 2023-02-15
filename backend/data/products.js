import { faker } from "@faker-js/faker";

faker.locale = "vi";
let products = [];
for (let i = 0; i < 15; i++) {
    products.push({
        name: faker.commerce.productName(),
        image: faker.image.nature(640, 480, true),
        description: faker.commerce.productDescription(),
        brand: faker.commerce.productMaterial(),
        category: faker.commerce.department(),
        price: Number(faker.commerce.price()),
        countInStock: Number(faker.random.numeric(2)),
        rating: 0,
        numReviews: 0,
        general: faker.lorem.paragraphs(),
        detail: faker.lorem.paragraphs(),
    });
}

export default products;
