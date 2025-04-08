import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Posts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    image_url: string;
    
    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}