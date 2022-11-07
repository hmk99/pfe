import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
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

    @ManyToOne(type => User, user => user.notes)
    userId: User

}
