import { Delete } from "@nestjs/common";
import { Role } from "../../common/enums/rol.enum";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column( { unique: true, nullable: false } )
    email: string;

    @Column( { nullable: false, select: false } )
    password: string;

    @Column( { type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @DeleteDateColumn()
    deletedAt?: Date;
}


