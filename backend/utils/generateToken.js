import jwt from "jsonwebtoken";
// import * as jose from "jose";

/*
 *   If you need to store sensitive data, you should always use a server-side session. Sensitive data includes:
 *       User IDs, Session IDs, JWTs, Personal information, Credit card information, API keys,
 *           And anything else you wouldn't want to publicly share on Facebook If you need to store sensitive data,
 *           here's how to do it:
 *
 *           When a user logs into your website, create a session identifier for them and store it in
 *               a cryptographically signed cookie. If you're using a web framework, look up “how to create a user
 *               session using cookies” and follow that guide.
 *
 *           Make sure that whatever cookie library your web framework uses is setting the httpOnly cookie flag.
 *               This flag makes it impossible for a browser to read any cookies, which is required in order to
 *               safely use server-side sessions with cookies. Read Jeff Atwood's article for more information. He's the man.
 *
 *           Make sure that your cookie library also sets the SameSite=strict cookie flag (to prevent CSRF attacks), as well
 *               as the secure=true flag (to ensure cookies can only be set over an encrypted connection).
 *
 *           Each time a user makes a request to your site, use their session ID (extracted from the cookie they send to you)
 *               to retrieve their account details from either a database or a cache (depending on how large your website is)
 *
 *           Once you have the user's account info pulled up and verified, feel free to pull any associated sensitive
 *               data along with it This pattern is simple, straightforward, and most importantly: secure. And yes,
 *               you can most definitely scale up a large website using this pattern. Don't tell me that JWTs are “stateless”
 *               and “fast” and you have to use local storage to store them: you're wrong!
 */

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
