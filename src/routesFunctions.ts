const connection = require('./databaseConnection')
const bcrypt = require('bcrypt');
import dotenv from 'dotenv';

dotenv.config()

// Necessary functions
function updateGoalProperties(goal_id: number, category: string, goal: string, goal_status: string) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE goals SET category = '${category}', goal = '${goal}', goal_status = '${goal_status}' WHERE id = ${goal_id}`
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            resolve(true)
        })
    })
}


function updateAccountProperties(first_name: string, last_name: string, email: string, account_id: number) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE accounts SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}' WHERE id = ${account_id}`
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error);
            resolve(true)
        })
    })
}

function changePassword (password: string, account_id: number) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE accounts SET password = '${password}' WHERE id = ${account_id}`
        connection.query(sql, (error: any, result: string) => {
            if (error) reject(error)
            resolve(result)
        })
    })
}

function getGoalBydate(date: string, account_id: number) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM goals WHERE date(set_date) = '${date}' AND account_id = ${account_id}`, (error: any, result: string) => {
            if (error) reject(error)
            resolve(result)
        })
    })
}

function getParticularGoalForId(goalId: number) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM goals WHERE id = ${goalId};`, (error: any, result: string) => {
            if (error) reject(error)
            resolve(result)
        })
    })
}

function getAccountIdForGoal(goalId: number) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT account_id FROM goals WHERE id = ${goalId}`, (error: any, result: string) => {
            if (error) reject(error)
            resolve(result)
        })
    })
}

function deleteGoal(id: number) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM goals WHERE id = ${id}`, (error: any, result: string) => {
            if (error) reject(error)
            resolve(true)
        })
    })
}

function returnGoalId(account_id: number){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT MAX(id) AS last_entry FROM goals WHERE account_id = ${account_id}`, (error: any, result: string) => {
            if (error) reject(error)
            // console.log(result)
            resolve(result)
        })
    })
}

function getGoalsForId(accountId : number) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM goals WHERE account_id = ${accountId}`, (error: any, result: string) => {
            if (error) reject(error)
            resolve(result)
        })
    })
}

function getPropertyValue (username: string, property: string) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT ${property} FROM accounts WHERE username = '${username}'`;
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            resolve(results)
        })
    })
}

function getBasicUserDetailsById (id: number) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, username, first_name, last_name, email FROM accounts WHERE id = '${id}'`;
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            resolve(results)
        })
    })
}


function getBasicUserDetailsByUsername (username: string) {
    return new Promise((resolve, reject) => {
        // SELECT password FROM accounts WHERE username = 'Temitee';
        let sql = `SELECT id, username, first_name, last_name, email FROM accounts WHERE username = '${username}'`;
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            resolve(results)
        })
    })
}

function checkIfEnteredPasswordsMatches(password: string, confirm_password: string) {
    // console.log(password, confirm_password)
    return new Promise((resolve, reject) => {
        if (password === confirm_password){
            resolve(true)
        } 
        else {
            resolve(false)
        }
    })
}

function checkIfUserExists(username: string) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM accounts WHERE username = '${username}'`
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            if (results.length == 1) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        });
    })
}

function checkIfEmailExists(email: string) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM accounts WHERE email = '${email}'`
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            if (results.length == 1) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        });
    })
}

function addUserToAccount(username: string, first_name: string, last_name: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO accounts (username, first_name, last_name, email, password) VALUES ('${username}', '${first_name}', '${last_name}', '${email}', '${password}')`
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            resolve(true)
        })
    })
} 

function addNewGoal(account_id: number, category: string, goal: string, goal_status: string, set_date: string) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `goals`(account_id, category, goal, goal_status, set_date) VALUES (?, ?, ?, ?, ?)"
        connection.query(sql, [account_id, category, goal, goal_status, set_date], (error: any, results: string) => {
            if (error) reject(error)
            resolve(true)
        })
    })
}

function hashEnteredPassword(password: string) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err: any, hash: string) {
            resolve(hash)
            reject(err)
        });
    })
}

function checkIfEnteredPasswordEqualsHashed(password: string, hashedPassword: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, function(err: any, result: string) {
            if (err) reject(err)
            resolve(result)
        });
    })
}

function collectUsernameHashedPassword(username: string) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT password FROM accounts WHERE username = '${username}'`;
        connection.query(sql, (error: any, results: string) => {
            if (error) reject(error)
            resolve(results)
        })
    })
}

const routesFunctions = {
    getPropertyValue,
    checkIfEnteredPasswordsMatches,
    checkIfEmailExists,
    checkIfUserExists,
    addUserToAccount,
    addNewGoal,
    hashEnteredPassword,
    checkIfEnteredPasswordEqualsHashed,
    collectUsernameHashedPassword,
    updateAccountProperties, 
    updateGoalProperties,
    returnGoalId,
    getGoalBydate,
    changePassword,
    getParticularGoalForId,
    deleteGoal,
    getGoalsForId,
    getAccountIdForGoal,
    getBasicUserDetailsById,
    getBasicUserDetailsByUsername
}

module.exports = routesFunctions