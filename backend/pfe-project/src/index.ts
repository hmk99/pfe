import { AppDataSource } from "./data-source"
import { Test } from "./entity/Test"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new Test()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Test)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
