import { Model, Table } from "@ninots/framework";

/**
 * User model.
 */
@Table("users")
export class User extends Model {
    protected static override fillable = ["email", "name", "password", "avatar", "metadata"];
}
