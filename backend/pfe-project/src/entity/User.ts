import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Userqsts } from "./Userqsts"
import { Notes } from "./Notes"
import { Stats } from "./Stats"
import { Msg } from "./Msg"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    googleId: string

    @Column()
    name: string

    @Column()
    email: number

    @Column()
    pwd: string

    @Column()
    image: string

    @Column()
    level: number 

    @OneToMany(type => Notes, notes => notes.userId)
    notes: Notes[]

    @OneToMany(type => Stats, stats => stats.userId)
    stats: Stats[]

    @OneToMany(type => Userqsts, userqsts => userqsts.userId)
    userqsts: Userqsts[]

    @OneToMany(type => Msg, msgs => msgs.userId)
    userMsgs: Msg[]

    @OneToMany(type => Msg, msgs => msgs.guestId)
    guestMsgs: Msg[]

}
