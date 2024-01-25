// schema.js
const { client } = require("./db");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema,
  graphql,
} = require("graphql");

const StudentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    studentId: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllStudents: {
      type: new GraphQLList(StudentType),
      async resolve() {
        const collection = client.db("graphql").collection("students");
        return collection.find().toArray();
      },
    },
    getStudentById: {
      type: StudentType,
      args: {
        studentId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const collection = client.db("graphql").collection("students");
        return collection.findOne({ studentId: args.studentId });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addStudent: {
      type: StudentType,
      args: {
        studentId: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const collection = client.db("graphql").collection("students");
        const result = await collection.insertOne(args);
        return args;
      },
    },
    updateStudent: {
      type: StudentType,
      args: {
        studentId: { type: new GraphQLNonNull(GraphQLString) },
        // Include other fields that can be updated
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        gender: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const collection = client.db("graphql").collection("students");
        const result = await collection.findOneAndUpdate(
          { studentId: args.studentId },
          { $set: args },
          { returnOriginal: false }
        );
        console.log(result);
        return result;
      },
    },
    deleteStudent: {
      type: StudentType,
      args: {
        studentId: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const collection = client.db("graphql").collection("students");
        const result = await collection.findOneAndDelete({
          studentId: args.studentId,
        });
        return result;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
