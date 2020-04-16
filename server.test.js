const request = require('supertest');
const server = require("./server");


// const fakeModuleObj = {
//     module: "Programming"
// }

// request(server)
// .post('/add')
//     .send(fakeModuleObj);


describe('Tests for server.js', () => {




    // test('GET data for Programming module', () => {
    //     return request(server)
	//     .get('/data?id=Programming')
    //     .expect(200);
    // });


    // /GET /subjects
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


    // test('GIVEN the harcoded limit has been exceeded, WHEN trying to make anothe /add request, THEN should received a 403 forbidden request', async ()=>{
    //     let modobj = {};
    //     const MAX_FILES  = 6;

    //     async function setUpForError(){
    //         for(let i = 1; i <= MAX_FILES; ++i){
    //             modobj['module'] = `FakeModuleObj${i}`;
    //             request(server)
    //             .post('/add')
    //                 .send(modobj);
    //         }
    //     }

    //     async function getError(){
    //         const finalObj = {
    //             module : "FakeModule6"
    //         }
            
    //         await request(server)
    //         .post('/add')
    //             .send(finalObj)
    //             .expect(403);
    //     }

    //     let [x, finalError] = await Promise.all([setUpForError(),getError()])
        
    //     return finalError;
    // });



    // test('Creating a new module and search for new module', async ()=>{
    //     const params = {
    //         module : "Physics"
    //     }

    //     await request(server)
	//     .post('/add')
    //         .send(params)

    //     return request(server)
    //     .get('/search?search=Physics')
    //     .expect(409);

    // });


    // test('Creating a new module and search for new module', async ()=>{
    //     const params = {
    //         module : "Geography"
    //     }

    //     await request(server)
	//     .post('/add')
    //         .send(params)

    //     return request(server)
    //     .get('/search?search=Physics')
    //     .expect(409);

    // });

    




    // test('POST /data requires body and not found', () => {
    //     return request(server)
	//     .post('/data')
	//     .expect(404);
    // });


});