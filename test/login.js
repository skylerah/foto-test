//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const assert = require("assert");
http = require("http");

chai.use(chaiHttp);
//Our parent block
describe("Login", () => {
  describe("login existing user", () => {
    it("it should successfuly log in user", (done) => {
      let user = { email: "misan@misan.com", password: "misan" };
      chai
        .request(server)
        .post("/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("login user with correct email but wrong password", () => {
    it('it should return "invalid username or password" error message', (done) => {
      let user = { email: "misan@misan.com", password: "abc" };
      let error = { message: "Invalid username or password!" };
      chai
        .request(server)
        .post("/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.eql(error);
          done();
        });
    });
  });

  describe("login user with wrong email", () => {
    it('it should "Account with that email doesnt exist!" error message', (done) => {
      let student = { email: "misannn@email.com", password: "misan" };
      let error = { message: "Account with that email doesnt exist!" };
      chai
        .request(server)
        .post("/login")
        .send(student)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql(error);
          done();
        });
    });
  });
});
