import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import {Stats} from "./Stats"
import { Userqsts } from "./Userqsts"

@Entity()
export class Blanks {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    salim: string

    @Column()
    weak: string

    @Column()
    temps: number

    @Column()
    qst: string

    @Column()
    unvocalized: string

    @Column()
    freq: number
    
    @Column()
    pronom: string

    @Column()
    rep: string

    @Column()
    repDc: string

    @Column()
    op1: string

    @Column()
    op2: string

    @Column()
    op3: string

    @Column()
    op4: string

    @OneToMany(type => Userqsts, userqsts => userqsts.qst)
    userqsts: Userqsts[]

}   
