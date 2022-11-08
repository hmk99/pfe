import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
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

    @Column()
    userId: number
    @ManyToOne(type => User, user => user.stats)
    @JoinColumn({name: "userId"})
    user: User

}
