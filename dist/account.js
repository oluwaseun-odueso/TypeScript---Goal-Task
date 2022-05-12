"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const functions = require('./routesFunctions');
const auth = require('./auth');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const { generateToken, verifyToken } = auth;
const { checkIfEnteredPasswordsMatches, checkIfEmailExists, checkIfUserExists, changePassword, updateAccountProperties, addUserToAccount, hashEnteredPassword, getBasicUserDetailsById, getBasicUserDetailsByUsername, checkIfEnteredPasswordEqualsHashed, collectUsernameHashedPassword } = functions;
router.post('/log_in', async (req, res) => {
    if (req.body.username && req.body.password) {
        try {
            const results = await checkIfUserExists(req.body.username);
            if (results === true) {
                const hashedPW = await collectUsernameHashedPassword(req.body.username);
                const checkPassword = await checkIfEnteredPasswordEqualsHashed(req.body.password, hashedPW[0].password);
                if (checkPassword === true) {
                    const userDetails = await getBasicUserDetailsByUsername(req.body.username);
                    const user = JSON.parse(JSON.stringify(userDetails[0]));
                    const token = await generateToken(user);
                    res.status(200).send({
                        message: "You have successfully logged in.",
                        user,
                        token
                    });
                }
                else {
                    res.status(400).send({
                        errno: "116",
                        message: "Incorrect Password."
                    });
                }
            }
            else {
                res.status(400).send({
                    errno: "114",
                    message: "Username does not exist."
                });
            }
        }
        catch (error) {
            res.send({ message: error.message });
        }
    }
    else {
        res.status(500).send({
            errno: "112",
            message: "All inputs must be entered correctly"
        });
    }
});
router.post('/signUp', async (req, res) => {
    if (req.body.username && req.body.first_name && req.body.last_name && req.body.email && req.body.password && req.body.confirm_password) {
        try {
            const checkUser = await checkIfUserExists(req.body.username);
            if (checkUser === false) {
                const checkEmail = await checkIfEmailExists(req.body.email);
                if (checkEmail === false) {
                    const checkPW = await checkIfEnteredPasswordsMatches(req.body.password, req.body.confirm_password);
                    if (checkPW == true) {
                        const hashedPassword = await hashEnteredPassword(req.body.password);
                        await addUserToAccount(req.body.username, req.body.first_name, req.body.last_name, req.body.email, hashedPassword);
                        res.status(201).send({
                            message: "New user added"
                        });
                    }
                    else {
                        res.status(400).send({
                            errno: "115",
                            message: "Passwords don't match"
                        });
                    }
                }
                else {
                    res.status(400).send({
                        errno: "113",
                        message: "Can't add an existing email."
                    });
                }
            }
            else {
                res.status(400).send({
                    errno: "111",
                    message: "Can't add an existing username."
                });
            }
        }
        catch (error) {
            res.send({ message: error.message });
        }
    }
    else
        res.status(500).send({
            errno: "101",
            message: "All fields must be entered correctly"
        });
});
// router.patch('/update_account_details', verifyToken, async(req: Request, res: Response) => {
//     if (req.body.first_name && req.body.last_name && req.body.email) {
//         try {
//             await updateAccountProperties(req.body.first_name, req.body.last_name, req.body.email, req.user.id)
//             const details = await getBasicUserDetailsById(req.user.id)
//             res.status(201).send({
//                 message : "Updated",
//                 details
//             })
//         }
//         catch(error: any) {
//             res.send({errno : 124, message : error.message})
//         }
//     }
//     else {
//         res.status(500).send({
//             error:"104" ,
//             message : "All properties must be entered correctly."
//         })
//     }
// })
// router.patch('/change_password', verifyToken, async(req: Request, res: Response) => {
//     if (req.body.old_password && req.body.new_password && req.body.confirm_new_password) {
//         try {
//             const oldHashedPW = await collectUsernameHashedPassword(req.user.username)
//             const checkPassword = await checkIfEnteredPasswordEqualsHashed(req.body.old_password, oldHashedPW[0].password)
//             if (checkPassword === true) {
//                 const confirmNewPassword = await checkIfEnteredPasswordsMatches(req.body.new_password, req.body.confirm_new_password)
//                 if (confirmNewPassword == true) {
//                     const hashedPassword = await hashEnteredPassword(req.body.new_password)
//                     await changePassword(hashedPassword, req.user.id);
//                     res.status(201).send({
//                         message : "Password Updated, your new password is " + (req.body.new_password).toString()
//                     })
//                 }
//                 else {
//                     res.status(400).send({
//                         errno:"115" ,
//                         message : "Passwords don't match"
//                     })
//                 }
//             }
//             else {
//                 res.status(400).send({
//                     errno:"116" ,
//                     message : "Incorrect old password."
//                 })
//             }
//         }
//         catch (error: any) {
            // res.send({errno : "106", message : error.message})
//         }
//     }
//     else {
//         res.status(500).send({
//             error:"104" ,
//             message : "All properties must be entered correctly."
//         })
//     }
// })
module.exports = router;
