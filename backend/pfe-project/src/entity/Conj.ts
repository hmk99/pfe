import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import {Type} from "./Type"

@Entity()
export class Conj {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    elem: string

    @Column()
    typeId: number
    @ManyToOne(type => Type, type => type.conjs)
    @JoinColumn({name: "typeId"})
    type: Type

}
