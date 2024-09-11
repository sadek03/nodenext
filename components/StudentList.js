"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingStudent) {
      setEditingStudent((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewStudent((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = editingStudent || newStudent;
    const { name, email, age, gender } = student;

    if (!name || !email || !age || !gender) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (isNaN(age) || age <= 0) {
      toast.error("Please enter a valid age.");
      return;
    }

    try {
      let response;
      if (editingStudent) {
        response = await fetch(`/api/students/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingStudent),
        });
      } else {
        response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${data.error}`);
        throw new Error(data.error || "Failed to submit student.");
      }

      toast.success(
        `${editingStudent ? "Student updated" : "Student added"} successfully!`
      );

      if (!editingStudent) {
        setNewStudent({ name: "", email: "", age: "", gender: "" });
      }

      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error submitting/updating student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={editingStudent ? editingStudent.name : newStudent.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={editingStudent ? editingStudent.email : newStudent.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="age"
            value={editingStudent ? editingStudent.age : newStudent.age}
            onChange={handleInputChange}
            placeholder="Age"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <select
            name="gender"
            value={editingStudent ? editingStudent.gender : newStudent.gender}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
        >
          {editingStudent ? "Update" : "Submit"}
        </button>
        {editingStudent && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {students.map((student) => (
        <div key={student.id} className="bg-white shadow-md rounded p-4 mb-4">
          <h3 className="text-xl font-semibold">{student.name}</h3>
          <p>Email: {student.email}</p>
          <p>Age: {student.age}</p>
          <p>Gender: {student.gender}</p>
          <button
            onClick={() => handleEdit(student)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(student.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
