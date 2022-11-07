import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import { Type } from "./Type"
import { User } from "./User"

@Entity()
export class Stats {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number

    @Column()
    score: number

    @Column()
    fails: number

    @Column()
    saved: number

    @ManyToOne(type => User, user => user.stats)
    userId: User

}
