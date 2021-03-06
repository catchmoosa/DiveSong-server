process.env.NODE_ENV = 'test';

let mysql = require("mysql");
const creds = require('../auth_details')
const hash = require('../hash');
const crypto = require('crypto');
const fileSystem=require("fs");
const config = require('../config');
const mail = require('../mail');

let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
var expect = chai.expect;



sql = {
host	: creds.sql.host,
user	: creds.sql.user,
password: creds.sql.password,
database: 'divesong'
}

var mailOptions = {
  to: creds.email.mail,
  subject: 'This is a test mail',
  html: '<h1>DiveSong</h1> <p>This mail has been generated by Team DiveSong<p> <img src=\'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png\'></img>'
};


chai.use(chaiHttp);
//Our parent block
	/*
	* Test the /GET route
	*/
describe('/GET detailNextSong', () => {
	it('it gets information about current/next song to be played', (done) => {
		chai.request(`${config.host.hostname}:${config.host.port}`)
		.get('/detailNextSong')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			//res.body.length.should.be.eql(0);
			done();
		});
	});
});

returnConnection= async (sql) =>{
	return new Promise(function(resolve, reject) {
		resolve(mysql.createConnection(sql))
	});;
}

describe('Connect to MySQL server',()=>{
	it('it should connect to MySQL server'),async done =>{
		connection = await returnConnection(sql)
		expect(await returnConnection(sql)).to.not.equal(undefined);
		done();
	}
})


describe('/POST login', () => {
	it('Checks with correct login details', (done) => {
		chai.request(`${config.host.hostname}:${config.host.port}`)
		.post('/login?user-agent=Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0&secret=abcdef&uname=divesong&password=123456')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('uid')
			res.body.uid.should.be.eql(4)

			done();
		});
	});
});

describe('/POST login', () => {
	it('Checks with wrong login details', (done) => {
		chai.request(`${config.host.hostname}:${config.host.port}`)
		.post('/login?user-agent=Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0&secret=abcdef&uname=divesong&password=12345')
		.end((err, res) => {
			res.should.have.status(401);

			done();
		});
	});
});
describe('/POST login', () => {
	it('Checks with wrong secret', (done) => {
		chai.request(`${config.host.hostname}:${config.host.port}`)
		.post('/login?user-agent=Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0&secret=abcde&uname=divesong&password=123456')
		.end((err, res) => {
			res.should.have.status(401);

			done();
		});
	});
});



describe('/GET song',()=>{
	it('get a song',done =>{
		chai.request(`${config.host.hostname}:${config.host.port}`)
		.get('/song?trackid=100')
		.end((err,res)=>{
			res.should.have.status(404);

		})
	})
})
