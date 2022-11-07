import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import {User} from "./User"

@Entity()
export class Msg {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number

    @ManyToOne(type => User, user => user.userMsgs)
    userId: User

    @ManyToOne(type => User, user => user.guestMsgs)
    guestId: User

}
