import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import {Blanks} from "./Blanks"
import {User} from "./User"

@Entity()
export class Userqsts {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number

    @Column()
    userId: number
    @ManyToOne(type => User, user => user.userqsts)
    @JoinColumn({name: "userId"})
    user: User

    @Column()
    qstId: number
    @ManyToOne(type => Blanks, blanks => blanks.userqsts)
    @JoinColumn({name: "qstId"})
    qst: Blanks

}
