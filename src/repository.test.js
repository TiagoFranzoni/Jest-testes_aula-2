const EventRepository = require("./repository");
const {MongoClient} = require('mongodb');
const mongo = require('mongodb');

describe("EventRepository", () => {

    let client;
    let collection;
    let repository;

    // Cria a conexão com o banco antes de cada teste
    beforeAll(async() => {
        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority'
        client = new MongoClient(dsn);
        await client.connect();
        collection = client.db('app_db').collection('events');
        repository = new EventRepository(collection);
    });
    
    // Deleta os dados do banco antes de cada teste
    beforeEach(async() => {
        await collection.deleteMany({});
    });

    // Encerra a conexão com o banco após cada teste
    afterAll(async() => {
        await client.close();
    });

    test('Read an event', async() => {
        const result = await collection.insertOne({
            name: 'Rock in Rio',
            date: '2023-01-01'
        });

        const event = await repository.find(result.insertedId.toString());

        expect(event).toStrictEqual(expect.objectContaining({
            name: 'Rock in Rio',
            date: '2023-01-01'
        }));
    });
    
    test("Create an event", async() => {
        const event = await repository.create({
            name: 'Rock in Rio',
            date: '2023-01-01'            
        });

        expect(event).toStrictEqual(expect.objectContaining({
            name: 'Rock in Rio',
            date: '2023-01-01'
        }));

    });

    test("Read all event", async() => {

        await repository.create({
            name: 'Copo do Mundo',
            date: '2026-01-01'
        });
        await repository.create({
            name: 'Copo do Mundo',
            date: '2026-01-01'
        });

        const events = await repository.findAll();

        expect(events).toHaveLength(2);
        expect(events[0]).toStrictEqual(expect.objectContaining({
            name: 'Copo do Mundo',
            date: '2026-01-01'
        }));
    });

    test("Update an event", async() => {

        // cria o registro
        const event = await repository.create({
            name: 'Copo do Mundo',
            date: '2026-01-01'
        });

        // altera o registro
        await repository.update(event._id, {
            name: 'Rock in Rio',
            date: '2030-01-01'
        });

        // consulta o registro
        const updatedEvent = await repository.find(event._id.toString());

        // compara o registro
        expect(updatedEvent).toStrictEqual(expect.objectContaining({
            name: 'Rock in Rio',
            date: '2030-01-01'
        }));

    });

    test("Delete an event", async() => {

        const event = await repository.create({
            name: 'Copo do Mundo',
            date: '2035-01-01'
        });

        const result = await repository.delete(event._id);
        expect(result).toBe(true);

        const removedEvent = await repository.find(event._id.toString());
        expect(removedEvent).toBe(null);
    });

    test('Delete an event that does not exist should return false', async() => {
        const id = new mongo.ObjectId('64ed4142b146d674e76af07c');
        const result = await repository.delete(id);
        expect(result).toBe(false);
    });



})