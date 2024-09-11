import { NextResponse } from "next/server";
import pool from "../db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM students_details");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function POST(request) {
//   try {
//     const { name, email, age, gender } = await request.json();
//     const [result] = await pool.query(
//       "INSERT INTO students_details (name, email, age, gender) VALUES (?, ?, ?, ?)",
//       [name, email, age, gender]
//     );
//     return NextResponse.json({ id: result.insertId }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function POST(request) {
  try {
    const { name, email, age, gender } = await request.json();

    // Check if email already exists
    const [existingUser] = await pool.query(
      "SELECT * FROM students_details WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // If email doesn't exist, proceed with insertion
    const [result] = await pool.query(
      "INSERT INTO students_details (name, email, age, gender) VALUES (?, ?, ?, ?)",
      [name, email, age, gender]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
