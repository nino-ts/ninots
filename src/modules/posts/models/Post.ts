import { Column, Model, Table } from "@ninots/orm";

/**
 * Post model.
 *
 * Represents a blog post or article.
 */
@Table("posts")
export class Post extends Model {
    @Column({ primary: true, autoIncrement: true })
    public id: number;

    @Column()
    public title: string;

    @Column({ unique: true })
    public slug: string;

    @Column({ type: "text" })
    public content: string;

    @Column({ nullable: true })
    public excerpt: string;

    @Column()
    public authorId: number;

    @Column({ default: "draft" })
    public status: string;

    @Column({ nullable: true })
    public publishedAt: Date;
}
