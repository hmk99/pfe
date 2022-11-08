import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, MissingJoinTableError, JoinColumn } from "typeorm"
import {Type} from "./Type"

@Entity()
export class Cours {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    def: string

    @Column()
    typeId: number
    @ManyToOne(type => Type, type => type.cours)
    @JoinColumn({name: "typeId"})
    type: Type

}
