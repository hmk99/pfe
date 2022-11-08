import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Notes {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    level: number

    @Column()
    rating: string

    @Column()
    note: string

    @Column()
    userId: number
    @ManyToOne(type => User, user => user.notes)
    @JoinColumn({name: "userId"})
    user: User

}
