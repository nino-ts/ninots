import { Column, Model, Table } from "@ninots/orm";

/**
 * User model.
 *
 * Represents a user in the system.
 */
@Table("users")
export class User extends Model {
    @Column({ primary: true, autoIncrement: true })
    public id: number;

    @Column({ unique: true })
    public email: string;

    @Column()
    public name: string;

    @Column({ hidden: true })
    public password: string;

    @Column({ nullable: true })
    public avatar: string;

    @Column({ type: "json", nullable: true })
    public metadata: Record<string, unknown>;
}
