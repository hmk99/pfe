import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import {Blanks} from "./Blanks"
import {User} from "./User"

@Entity()
export class Userqsts {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number

    @ManyToOne(type => User, user => user.userqsts)
    userId: Blanks

    @ManyToOne(type => Blanks, blanks => blanks.userqsts)
    qstId: User

}
