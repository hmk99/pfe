import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import {Cours} from "./Cours"
import {Conj} from "./Conj"

@Entity()
export class Type {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    salim: string

    @Column()
    weak: string

    @Column()
    level: number

    @Column()
    title: string

    @OneToMany(type => Cours, cours => cours.typeId)
    cours: Cours[]

    @OneToMany(type => Conj, conj => conj.typeId)
    conjs: Conj[]

}
