import { Model, Table } from "@ninots/orm";
/**
 * User model.
 */
@Table("users")
export class User extends Model {
    protected static override fillable = ["email", "name", "password", "avatar", "metadata"];
}
