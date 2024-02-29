export interface User {
    user_id?:           number;
    username:          string;
    email:             string;
    password:          string;
    address:           string;
    registration_date: Date;
    name:              string;
    last_name:         string;
    role:              string;
    activated:         boolean,
    reviews:           Review[];
    rentals:           Rental[];
}

export interface Media {
    mediaId:     number;
    title:       string;
    releaseDate: number;
    gender:      string;
    imageUrl:    string;
    available:   boolean;
    stock:       number;
    price:       null;
    rentals:     Rental[];
    reviews:     Review[];
}

export interface Review {
    reviewId:      number;
    userId:        number;
    mediaId:       number;
    comment:       string;
    rating:        number;
    creation_date: number;
}

export interface Rental {
    rentalId: number;
    userId: number;
    mediaId: number;
    rentalDate: Date;
    returnDate: Date;
    quantity:number;
    returned:boolean;
}

export interface LoginResponse {
    user:User;
    token:string;
}