import { NextResponse } from "next/server";
import pool from "../../db";

export async function GET(request, { params }) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM students_details WHERE id = ?",
      [params.id]
    );
    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { name, email, age, gender } = await request.json();
    const [result] = await pool.query(
      "UPDATE students_details SET name = ?, email = ?, age = ?, gender = ? WHERE id = ?",
      [name, email, age, gender, params.id]
    );
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Student updated successfully" });
    } else {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const [result] = await pool.query(
      "DELETE FROM students_details WHERE id = ?",
      [params.id]
    );
    if (result.affectedRows > 0) {
      return NextResponse.json({ message: "Student deleted successfully" });
    } else {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
