//App User Controller Logic
const bcrypt = require ("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

//User registration logic
exports.userRegister = [ 
    async(req, res)=> {
        try {
            const {
                first_name, last_name, email, password
            } = req.body;

            if(!(email && password && first_name && last_name)) {
                res.status(400).send("All input is required");
            } else {
                encryptedPassword = await bcrypt.hash(password, 10);

                const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                });

                const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN,
                {
                    expiresIn: "2h",
                }
            );
            user.token = token;
            res.status(201).json(user);
            }
            
        } catch (err) {
            console.log(err);
        }
    }
];

//User Login Logic
exports.userLogin = [
    async (req, res) => {
        try {
            const {email, password} = req.body;

            if(!(email && password)) {
                res.status(400).send("All input is required");
            }

            const user = await User.findOne({email});

            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    {user_id: user._id, email},
                    process.env.TOKEN,
                    {
                        expiresIn: "2h",
                    }
                );

                user.token = token;

                res.status(200).json(user);
            }
            res.status(400).send("Invalid Credentials");
        } catch(err) {
            console.log(err);
        }
    }
]