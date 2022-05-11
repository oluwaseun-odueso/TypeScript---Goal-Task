import { connection} from './databaseConnection';
import bycrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config

// Necessary functions
function updateGoalProperties(goal_id: number, category: string, goal: string, goal_status: string) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE goals SET category = '${category}', goal = '${goal}', goal_status = '${goal_status}' WHERE id = ${goal_id}`
        connection.query(sql, (error, results) => {
            if (error) reject(error)
            resolve(true)
        })
    })
}