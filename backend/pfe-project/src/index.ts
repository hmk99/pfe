import { AppDataSource } from "./data-source"
import { Test } from "./entity/Test"
import { User } from "./entity/User"
import {createConnection} from "typeorm"


AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new Test()
    await AppDataSource.manager.save(user)

    const users = await AppDataSource.manager.find(Test)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")


}).catch(error => console.log(error))