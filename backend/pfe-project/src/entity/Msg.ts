import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import {User} from "./User"

@Entity()
export class Msg {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number

    @Column()
    userId: number
    @ManyToOne(type => User, user => user.userMsgs)
    @JoinColumn({name: "userId"})
    user: User

    @Column()
    guestId: number
    @ManyToOne(type => User, user => user.guestMsgs)
    @JoinColumn({name: "guestId"})
    guest: User

}
