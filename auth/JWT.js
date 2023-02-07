import dotenv from 'dotenv'
import jwt from "jsonwebtoken"
const {sign,verify} = jwt
dotenv.config();


const createTokens = (user) => {
    const accessToken = sign({ username: user.email, id: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET
    );

    return accessToken;
};

const createemail_verificationTokens = (user) => {
    const accessToken = sign({ username: user.email, id: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET, {
            expiresIn: '1d',
        }
    );

    return accessToken;
};
const passwordResetToken = (user) => {
    const accessToken = sign({ username: user.email, id: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET, {
            expiresIn: '30min',
        }
    );

    return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken)
        return res.status(400).json({ error: "User not Authenticated!" });

    try {
        const is_valid = verify(accessToken, process.env.USER_VERIFICATION_TOKEN_SECRET);
        if (is_valid) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

const decodeToken = (req, res) => {
    console.log("entered decodeToken");
    const accessToken = req.cookies["access-token"];

    if (!accessToken)
        return res.status(400).json({ error: "User not Authenticated!" });

    try {
        const payload = verify(accessToken, process.env.USER_VERIFICATION_TOKEN_SECRET);
        console.log(payload);
        return payload.id;
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

export { createTokens, validateToken, createemail_verificationTokens, passwordResetToken, decodeToken };