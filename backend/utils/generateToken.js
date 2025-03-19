import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '6h'
    })

    res.cookie("lh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "None",
        maxAge: 6 * 60 * 60 * 1000
    })
}

export default generateToken