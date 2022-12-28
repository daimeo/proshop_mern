import jwt from "jsonwebtoken";
// import * as jose from "jose";

const generateToken = async (id, expiresIn) => {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: expiresIn ? expiresIn : process.env.JWT_EXPIRATION_TIME,
        algorithm: "HS512",
    });
    console.log("TOKEN SIGN: " + JSON.stringify(token));

    return token;
};

// const secretKey = new TextEncoder().encode(
//     "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
// );
// const alg = "HS256";

// const generateToken = async (id) => {
//     const token = await new jose.SignJWT({ id: id }) // details to encode in the token
//         .setProtectedHeader({ alg: alg }) // algorithm
//         .setIssuedAt()
//         .setIssuer(process.env.JWT_ISSUER) // issuer
//         .setAudience(process.env.JWT_AUDIENCE) // audience
//         .setExpirationTime(process.env.JWT_EXPIRATION_TIME) // token expiration time, e.g., "1 day"
//         .sign(secretKey); // secretKey generated from previous step
//     console.log(token); // log token to console
//     return token;
// };

export default generateToken;
// export { tk };
