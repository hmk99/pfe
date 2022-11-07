import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import {Type} from "./Type"

@Entity()
export class Conj {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    elem: string

    @ManyToOne(type => Type, type => type.conjs)
    typeId: Type

}
