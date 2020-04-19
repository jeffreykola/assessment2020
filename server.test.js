const request = require("supertest");
const server = require("./server");



describe("Tests for server.js", () => {
 
    test("SETTING UP TESTING ENV", async ()=>{

        const fakeTaskObj = {
            module: "Programming",
            taskName: "New task",
            description: "New task description",
            date: "2020-04-15T11:00:00.000Z",
            priority: 1,
          };
          
        return request(server).post("/")
            .send(fakeTaskObj)
            .expect(200);
        
    });
    
  test('GET data for Programming module', () => {
      return request(server)
      .get('/data?id=Programming')
      .expect(200);
  });

  ///GET /subjects
  test('Given there are modules, when the module request is made, then response is a HTTP 200 code', () => {
      return request(server)
      .get('/subjects')
      .expect(200);
  });

  test('Given there are modules, when the module request is made, then response in JSON format is received', () => {
      return request(server)
      .get('/subjects')
      .expect('Content-Type', /json/);
  });

  // /GET search
  test('Given a blank module already exists, when searching for Programming, then receive a HTTP 409 conflict with a JSON object ', () => {
      return request(server)
      .get('/search?search=')
      .expect(409)
      .expect('Content-Type', /json/);
  });

  test('Given there is not a module called Geography, when the search request is made, then a HTTP 200 OK is received with a JSON object ', ()=>{
      return request(server)
      .get('/search?search=Geography')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  // GET /data
  test('Content type for /GET data', () => {
      return request(server)
      .get('/data?id=Programming')
      .expect(200);
  });

  test('Content type for /GET data', () => {
      return request(server)
      .get('/data?id=Programming')
      .expect('Content-Type',/text\/html/);
  });

  // POST /
  test('Given there is a module called Programming in existence, when request is made to `/` then expect a HTTP 200 OK code', () => {

      const fakeTaskObj = {
          module: "Programming",
          taskName: "New task",
          description: "New task description",
          date: "2020-04-15T11:00:00.000Z",
          priority: 1
      }

      return request(server)
      .post('/')
          .send(fakeTaskObj)
          .expect(200);
  });

  test('GIVEN the harcoded limit on the module number has not been exceeded, WHEN the /add request is made THEN a recevie a  200 OK response ', async () => {
      const newModule = {
          "module" : "Module One"
      };

       await request(server)
      .post('/add')
          .send(newModule)
          .expect(200);
  });

  test("Given there is a there is a module containing a task with an ID which we already know WHEN we make a delete request THEN the module is deleted (200 Response)", async () => {
 
    const res = await request(server)
            .get("/data?id=Programming");

    const iden = JSON.parse(res.text)[0]._id;
    const params = {
        name: "Programming",
        id: iden
    }

    return request(server)
    .post("/delete")
        .send(params)
        .expect(200);
  });


  test("Given there is a there is a module containing a task WHEN we make a delete request with inadequate parameters THEN no task is found (404)", async () => {
 
    const params = {
        name: "Programming",
        id: "not found"
    }

    return request(server)
    .post("/delete")
        .send(params)
        .expect(404);
  });

  test(`Given a module is already in existence, WHEN the /dropmod request is made THEN the file is deleted and a 200 request is the response`, async ()=>{
      const params = {
        name : "Module One"
      }

      return request(server)
      .post('/dropmod')
          .send(params)
          .expect(200);

  });


  test("Given there a we specify the name of a module that does not exist, WHEN the /dropmod request is made THEN a 404 Not Found response is returnred", ()=>{
    const params = {
      name: "Does Not Exist"
    }

    return request(server)
    .post('/dropmod')
        .send(params)
        .expect(404);
  });


  test("Given there is a module called Programming, WHEN the /updatemod request is made THEN the module name is updated and a 200 OK response is returned ", ()=>{
    const params = {
      originalName: "Programming",
      newFileName: "Prog"
    }

    return request(server)
    .post('/updatemod')
        .send(params)
        .expect(200);
  });


  
  test("Given there are some modules in existence, WHEN the /updatemod request is made with an originalFileName of a file that does not exist THEN no modules are updated and a 404 Not Found response is returned ", ()=>{
    const params = {
      originalName: "Not Found",
      newFileName: "Prog"
    }

    return request(server)
    .post('/updatemod')
        .send(params)
        .expect(404);
  });


  test("Given there is a task in Prog, WHEN the update request when the body includes {taskNaem} is made THEN the task is updated and a 200 OK response is returned", async ()=>{
    const res = await request(server)
    .get("/data?id=Prog");

    const iden = JSON.parse(res.text)[0]._id;

    const params = {
      "taskName":"Name",
      "properties":["taskName"],
      "module":"Prog",
      "id":iden
    }

    return request(server)
    .post('/update')
        .send(params)
        .expect(200);

  });  

  test("Given there is a task in Prog, WHEN the update request with the body includes {taskName, description} is made THEN the task is updated and a 200 OK response is returned", async ()=>{
    const res = await request(server)
    .get("/data?id=Prog");

    global.iden = JSON.parse(res.text)[0]._id;

    const params = {
      "taskName":"New name",
      "description": "The new task desc",
      "properties":["taskName", "description"],
      "module":"Prog",
      "id":iden
    }

    return request(server)
    .post('/update')
        .send(params)
        .expect(200);

  });
  
});
