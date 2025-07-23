<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { StudentForm } from "@/types/student";
import { pool } from "./db";

export const insertStudent = async (
    studentForm: StudentForm,
    photoURL: string | null
) => {
    try {
        const checkDuplicates = await pool.query(
            `SELECT register_number,email 
            FROM students 
            WHERE register_number = $1 OR email = $2`,
            [studentForm.registerNumber, studentForm.email]
        )

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists"

            const error = new Error(reason)
            error.name = "Duplicate Error"
            throw error;
            
        }

        const response = await pool.query(
            `INSERT INTO students (
            full_name, 
            initial_name, 
            register_number,
            email, 
            faculty, 
            year_of_study, 
            address, 
            phone, 
            photo, 
            date_of_birth 
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
            [
                studentForm.fullName,
                studentForm.initName,
                studentForm.registerNumber,
                studentForm.email,
                studentForm.faculty,
                studentForm.yearOfStudy,
                studentForm.address,
                studentForm.phoneNumber,
                photoURL,
                studentForm.dateOfBirth,
            ]
        );
        return response.rows[0].id;
    } catch (error) {
        console.error("Insert to DB error",error)
        throw error;
    }
};
=======
import { BaseStudent, StudentForm } from "@/types/student";
import { pool } from "./db";
import { LecturerForm } from "@/types/lecturers";
const bcrypt = require("bcrypt");

export const insertStudent = async (
    studentForm: StudentForm,
    photoURL: string | null
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        //hash password
        const saltRounds = 10;
        const std_pw = await bcrypt.hash(studentForm.nicNumber, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT register_number,email 
            FROM students 
            WHERE register_number = $1 OR email = $2`,
            [studentForm.registerNumber, studentForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'STUDENT') 
             RETURNING id`,
            [studentForm.email, studentForm.fullName, std_pw]
        );

        const userId = userResponse.rows[0].id;

        const studentResponse = await client.query(
            `INSERT INTO students (
            user_id,
            full_name, 
            initial_name,
            nic_no, 
            register_number,
            email, 
            faculty, 
            year_of_study, 
            address, 
            phone, 
            photo, 
            date_of_birth 
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
            [
                userId,
                studentForm.fullName,
                studentForm.initName,
                studentForm.nicNumber,
                studentForm.registerNumber,
                studentForm.email,
                studentForm.faculty,
                studentForm.yearOfStudy,
                studentForm.address,
                studentForm.phoneNumber,
                photoURL,
                studentForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            studentId: studentResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const insertLecturer = async (
    lecturerForm: LecturerForm,
    photoURL: string | null
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        //hash password
        const saltRounds = 10;
        const lec_pw = await bcrypt.hash(lecturerForm.nicNo, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT staff_id,email 
            FROM lecturers 
            WHERE staff_id = $1 OR email = $2`,
            [lecturerForm.registerNumber, lecturerForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'LECTURER') 
             RETURNING id`,
            [lecturerForm.email, lecturerForm.fullName, lec_pw]
        );

        const userId = userResponse.rows[0].id;

        const lecturerResponse = await client.query(
            `INSERT INTO lecturers (
            user_id,
            staff_id, 
            nic_no,
            full_name,
            initial_name, 
            email, 
            faculty, 
            position, 
            specialization,
            address, 
            phone, 
            photo, 
            date_of_birth
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
            [
                userId,
                lecturerForm.registerNumber,
                lecturerForm.nicNo,
                lecturerForm.fullName,
                lecturerForm.initName,
                lecturerForm.email,
                lecturerForm.faculty,
                lecturerForm.position,
                lecturerForm.bio,
                lecturerForm.address,
                lecturerForm.phoneNumber,
                photoURL,
                lecturerForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            lecturerID: lecturerResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const notIssued = async () => {
    const client = await pool.connect();

    try {
        const notIssuedStudents = await client.query(
            `SELECT * FROM students WHERE card_id IS null ORDER BY created_at DESC`
        );

        return notIssuedStudents.rows
    } catch (error) {
        console.error('Database query error:', error);
    }finally{
        client.release()
    }
};

export const insertCardDetails = async(cardData : BaseStudent)=>{
    const client = await pool.connect()

    try{
        const cardInsertResponse = await client.query(
            `INSERT INTO rfid_cards (
                card_uid,
                assigned_student,
                assigned_date,
                status,
                balance
            )VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )RETURNING id`,[
                cardData.card_id,
                cardData.user_id,
                new Date().toISOString(),
                'ACTIVE',
                cardData.credits
            ]
        );

        return cardInsertResponse.rows[0];
    }catch (error){
        console.error("Insert to DB error", error);
        throw error;
    }finally{
        client.release()
    }
}
>>>>>>> Stashed changes
=======
import { BaseStudent, StudentForm } from "@/types/student";
import { pool } from "./db";
import { LecturerForm } from "@/types/lecturers";
const bcrypt = require("bcrypt");

export const insertStudent = async (
    studentForm: StudentForm,
    photoURL: string | null
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        //hash password
        const saltRounds = 10;
        const std_pw = await bcrypt.hash(studentForm.nicNumber, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT register_number,email 
            FROM students 
            WHERE register_number = $1 OR email = $2`,
            [studentForm.registerNumber, studentForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'STUDENT') 
             RETURNING id`,
            [studentForm.email, studentForm.fullName, std_pw]
        );

        const userId = userResponse.rows[0].id;

        const studentResponse = await client.query(
            `INSERT INTO students (
            user_id,
            full_name, 
            initial_name,
            nic_no, 
            register_number,
            email, 
            faculty, 
            year_of_study, 
            address, 
            phone, 
            photo, 
            date_of_birth 
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
            [
                userId,
                studentForm.fullName,
                studentForm.initName,
                studentForm.nicNumber,
                studentForm.registerNumber,
                studentForm.email,
                studentForm.faculty,
                studentForm.yearOfStudy,
                studentForm.address,
                studentForm.phoneNumber,
                photoURL,
                studentForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            studentId: studentResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const insertLecturer = async (
    lecturerForm: LecturerForm,
    photoURL: string | null
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        //hash password
        const saltRounds = 10;
        const lec_pw = await bcrypt.hash(lecturerForm.nicNo, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT staff_id,email 
            FROM lecturers 
            WHERE staff_id = $1 OR email = $2`,
            [lecturerForm.registerNumber, lecturerForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'LECTURER') 
             RETURNING id`,
            [lecturerForm.email, lecturerForm.fullName, lec_pw]
        );

        const userId = userResponse.rows[0].id;

        const lecturerResponse = await client.query(
            `INSERT INTO lecturers (
            user_id,
            staff_id, 
            nic_no,
            full_name,
            initial_name, 
            email, 
            faculty, 
            position, 
            specialization,
            address, 
            phone, 
            photo, 
            date_of_birth
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
            [
                userId,
                lecturerForm.registerNumber,
                lecturerForm.nicNo,
                lecturerForm.fullName,
                lecturerForm.initName,
                lecturerForm.email,
                lecturerForm.faculty,
                lecturerForm.position,
                lecturerForm.bio,
                lecturerForm.address,
                lecturerForm.phoneNumber,
                photoURL,
                lecturerForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            lecturerID: lecturerResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const notIssued = async () => {
    const client = await pool.connect();

    try {
        const notIssuedStudents = await client.query(
            `SELECT * FROM students WHERE card_id IS null ORDER BY created_at DESC`
        );

        return notIssuedStudents.rows
    } catch (error) {
        console.error('Database query error:', error);
    }finally{
        client.release()
    }
};

export const insertCardDetails = async(cardData : BaseStudent)=>{
    const client = await pool.connect()

    try{
        const cardInsertResponse = await client.query(
            `INSERT INTO rfid_cards (
                card_uid,
                assigned_student,
                assigned_date,
                status,
                balance
            )VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )RETURNING id`,[
                cardData.card_id,
                cardData.user_id,
                new Date().toISOString(),
                'ACTIVE',
                cardData.credits
            ]
        );

        return cardInsertResponse.rows[0];
    }catch (error){
        console.error("Insert to DB error", error);
        throw error;
    }finally{
        client.release()
    }
}
>>>>>>> Stashed changes
=======
import { BaseStudent, StudentForm } from "@/types/student";
import { pool } from "./db";
import { LecturerForm } from "@/types/lecturers";
const bcrypt = require("bcrypt");

export const insertStudent = async (
    studentForm: StudentForm,
    photoURL: string | null
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        //hash password
        const saltRounds = 10;
        const std_pw = await bcrypt.hash(studentForm.nicNumber, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT register_number,email 
            FROM students 
            WHERE register_number = $1 OR email = $2`,
            [studentForm.registerNumber, studentForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'STUDENT') 
             RETURNING id`,
            [studentForm.email, studentForm.fullName, std_pw]
        );

        const userId = userResponse.rows[0].id;

        const studentResponse = await client.query(
            `INSERT INTO students (
            user_id,
            full_name, 
            initial_name,
            nic_no, 
            register_number,
            email, 
            faculty, 
            year_of_study, 
            address, 
            phone, 
            photo, 
            date_of_birth 
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
            [
                userId,
                studentForm.fullName,
                studentForm.initName,
                studentForm.nicNumber,
                studentForm.registerNumber,
                studentForm.email,
                studentForm.faculty,
                studentForm.yearOfStudy,
                studentForm.address,
                studentForm.phoneNumber,
                photoURL,
                studentForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            studentId: studentResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const insertLecturer = async (
    lecturerForm: LecturerForm,
    photoURL: string | null
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        //hash password
        const saltRounds = 10;
        const lec_pw = await bcrypt.hash(lecturerForm.nicNo, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT staff_id,email 
            FROM lecturers 
            WHERE staff_id = $1 OR email = $2`,
            [lecturerForm.registerNumber, lecturerForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'LECTURER') 
             RETURNING id`,
            [lecturerForm.email, lecturerForm.fullName, lec_pw]
        );

        const userId = userResponse.rows[0].id;

        const lecturerResponse = await client.query(
            `INSERT INTO lecturers (
            user_id,
            staff_id, 
            nic_no,
            full_name,
            initial_name, 
            email, 
            faculty, 
            position, 
            specialization,
            address, 
            phone, 
            photo, 
            date_of_birth
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
            [
                userId,
                lecturerForm.registerNumber,
                lecturerForm.nicNo,
                lecturerForm.fullName,
                lecturerForm.initName,
                lecturerForm.email,
                lecturerForm.faculty,
                lecturerForm.position,
                lecturerForm.bio,
                lecturerForm.address,
                lecturerForm.phoneNumber,
                photoURL,
                lecturerForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            lecturerID: lecturerResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const notIssued = async () => {
    const client = await pool.connect();

    try {
        const notIssuedStudents = await client.query(
            `SELECT * FROM students WHERE card_id IS null ORDER BY created_at DESC`
        );

        return notIssuedStudents.rows
    } catch (error) {
        console.error('Database query error:', error);
    }finally{
        client.release()
    }
};

export const insertCardDetails = async(cardData : BaseStudent)=>{
    const client = await pool.connect()

    try{
        const cardInsertResponse = await client.query(
            `INSERT INTO rfid_cards (
                card_uid,
                assigned_student,
                assigned_date,
                status,
                balance
            )VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )RETURNING id`,[
                cardData.card_id,
                cardData.user_id,
                new Date().toISOString(),
                'ACTIVE',
                cardData.credits
            ]
        );

        return cardInsertResponse.rows[0];
    }catch (error){
        console.error("Insert to DB error", error);
        throw error;
    }finally{
        client.release()
    }
}
>>>>>>> Stashed changes
=======
import { BaseStudent, StudentForm } from "@/types/student";
import { pool } from "./db";
import { LecturerForm } from "@/types/lecturers";
const bcrypt = require("bcrypt");

export const insertStudent = async (
    studentForm: StudentForm,
    photoURL: string | null
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        //hash password
        const saltRounds = 10;
        const std_pw = await bcrypt.hash(studentForm.nicNumber, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT register_number,email 
            FROM students 
            WHERE register_number = $1 OR email = $2`,
            [studentForm.registerNumber, studentForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'STUDENT') 
             RETURNING id`,
            [studentForm.email, studentForm.fullName, std_pw]
        );

        const userId = userResponse.rows[0].id;

        const studentResponse = await client.query(
            `INSERT INTO students (
            user_id,
            full_name, 
            initial_name,
            nic_no, 
            register_number,
            email, 
            faculty, 
            year_of_study, 
            address, 
            phone, 
            photo, 
            date_of_birth 
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
            [
                userId,
                studentForm.fullName,
                studentForm.initName,
                studentForm.nicNumber,
                studentForm.registerNumber,
                studentForm.email,
                studentForm.faculty,
                studentForm.yearOfStudy,
                studentForm.address,
                studentForm.phoneNumber,
                photoURL,
                studentForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            studentId: studentResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const insertLecturer = async (
    lecturerForm: LecturerForm,
    photoURL: string | null
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        //hash password
        const saltRounds = 10;
        const lec_pw = await bcrypt.hash(lecturerForm.nicNo, saltRounds);

        const checkDuplicates = await client.query(
            `SELECT staff_id,email 
            FROM lecturers 
            WHERE staff_id = $1 OR email = $2`,
            [lecturerForm.registerNumber, lecturerForm.email]
        );

        if (checkDuplicates.rows.length > 0) {
            let reason = "Register number or Email address already exists";

            const error = new Error(reason);
            error.name = "Duplicate Error";
            throw error;
        }

        //insert into user table
        const userResponse = await client.query(
            `INSERT INTO users (email, name, password, role) 
             VALUES ($1, $2, $3, 'LECTURER') 
             RETURNING id`,
            [lecturerForm.email, lecturerForm.fullName, lec_pw]
        );

        const userId = userResponse.rows[0].id;

        const lecturerResponse = await client.query(
            `INSERT INTO lecturers (
            user_id,
            staff_id, 
            nic_no,
            full_name,
            initial_name, 
            email, 
            faculty, 
            position, 
            specialization,
            address, 
            phone, 
            photo, 
            date_of_birth
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
            [
                userId,
                lecturerForm.registerNumber,
                lecturerForm.nicNo,
                lecturerForm.fullName,
                lecturerForm.initName,
                lecturerForm.email,
                lecturerForm.faculty,
                lecturerForm.position,
                lecturerForm.bio,
                lecturerForm.address,
                lecturerForm.phoneNumber,
                photoURL,
                lecturerForm.dateOfBirth,
            ]
        );

        await client.query("COMMIT");

        return {
            userId: userId,
            lecturerID: lecturerResponse.rows[0].id,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Insert to DB error", error);
        throw error;
    } finally {
        client.release();
    }
};

export const notIssued = async () => {
    const client = await pool.connect();

    try {
        const notIssuedStudents = await client.query(
            `SELECT * FROM students WHERE card_id IS null ORDER BY created_at DESC`
        );

        return notIssuedStudents.rows
    } catch (error) {
        console.error('Database query error:', error);
    }finally{
        client.release()
    }
};

export const insertCardDetails = async(cardData : BaseStudent)=>{
    const client = await pool.connect()

    try{
        const cardInsertResponse = await client.query(
            `INSERT INTO rfid_cards (
                card_uid,
                assigned_student,
                assigned_date,
                status,
                balance
            )VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )RETURNING id`,[
                cardData.card_id,
                cardData.user_id,
                new Date().toISOString(),
                'ACTIVE',
                cardData.credits
            ]
        );

        return cardInsertResponse.rows[0];
    }catch (error){
        console.error("Insert to DB error", error);
        throw error;
    }finally{
        client.release()
    }
}
>>>>>>> Stashed changes
