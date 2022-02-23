export class User {
    id!: number;
    name!: string;
    email!: string;
    password?: string;
    organization?: string;
    image_url?:string;
}