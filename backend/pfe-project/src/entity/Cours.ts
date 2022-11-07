import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import {Type} from "./Type"

@Entity()
export class Cours {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    def: string

    @ManyToOne(type => Type, type => type.cours)
    typeId: Type

}
