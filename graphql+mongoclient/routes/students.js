const express = require("express");
const router = express.Router();
const { client } = require("../db");

// Add new student data
router.post("/adddata", async (req, res) => {
  const requiredFields = [
    "studentId",
    "name",
    "age",
    "gender",
    "email",
    "phone",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  try {
    const newStudent = {
      studentId: req.body.studentId,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
    };

    const collection = client.db("studentDatabase").collection("list");
    const result = await collection.insertOne(newStudent);

    res.json({
      message: "Data successfully added",
      addedStudent: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Update student data
router.put("/update/:id", async (req, res) => {
  const { name, age, gender, email, phone } = req.body;
  const requiredFields = ["name", "age", "gender", "email", "phone"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  try {
    const updateStudent = { name, age, gender, email, phone };

    const collection = client.db("studentDatabase").collection("list");
    const updateResult = await collection.updateOne(
      { studentId: req.params.id },
      { $set: updateStudent }
    );

    if (updateResult.modifiedCount === 1) {
      // The document was successfully updated
      const updatedStudent = await collection.findOne({
        studentId: req.params.id,
      });

      res.json({ message: "Data successfully updated", updatedStudent });
    } else if (updateResult.matchedCount === 0) {
      // No matching document found
      res.status(404).json({ message: "ID not found" });
    } else {
      // Some error occurred during the update
      res.status(500).json({
        error: "Internal Server Error",
        details: "Failed to update the document",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// View specific student data
router.get("/view/:id", async (req, res) => {
  try {
    const collection = client.db("studentDatabase").collection("list");
    const doc = await collection.findOne({ studentId: req.params.id });
    console.log(doc);
    if (doc !== null) {
      console.log(doc);
      res.json({ result: doc });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Delete student data
router.delete("/delete/:id", async (req, res) => {
  try {
    const query = { studentId: req.params.id };

    const collection = client.db("studentDatabase").collection("list");
    const result = await collection.deleteOne(query);

    if (result.deletedCount > 0) {
      res.json({ message: "Deleted" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Get all students with pagination and search
router.get("/all", async (req, res) => {
  try {
    const collection = client.db("studentDatabase").collection("list");
    const students = await collection.find().toArray();

    if (students.length === 0) {
      res.status(404).json({ message: "No results found" });
    } else {
      res.json({ students });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
