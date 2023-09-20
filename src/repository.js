const mongo = require('mongodb');

class EventRepository {

    constructor(collection) {
        this.collection = collection;
    }

    async find(id) {
        return await this.collection.findOne({_id: new mongo.ObjectId(id)})
    }

    async findAll() {
        const result = await this.collection.find({});
        return result.toArray();
    }

    async create(event) {
        await this.collection.insertOne(event);
        return event;
    }

    async update(id, data) {
        await this.collection.updateOne({_id: id}, {$set: data});
    }

    async delete(id) {
        const result = await this.collection.deleteOne({_id: id});
        return result.deletedCount === 1;
    }
}

module.exports = EventRepository;