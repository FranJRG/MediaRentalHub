export interface Movie {
    mediaId?:     number;
    title:       string;
    releaseDate: number;
    gender:      string;
    imageUrl:    string;
    available:   boolean;
    stock:       number;
    rentals:     Rental[];
    reviews:     Review[];
    director:    string;
    price:       number;
}

export interface Review {
    reviewId: number;
    userId:   number;
    mediaId:  number;
    comment:  string;
    rating:   number;
    creation_date: Date;
    deleted:    boolean;
}

export interface Rental {
    rentalId: number;
    userId: number;
    mediaId: number;
    rental_date: Date;
    return_date: Date;
}

export interface Main {
    content:          Content[];
    pageable:         Pageable;
    last:             boolean;
    totalElements:    number;
    totalPages:       number;
    size:             number;
    number:           number;
    sort:             Sort;
    first:            boolean;
    numberOfElements: number;
    empty:            boolean;
}

export interface Content {
    mediaId:     number;
    title:       string;
    releaseDate: number;
    gender:      string;
    imageUrl:    string;
    available:   boolean;
    stock:       number;
    rentals:     null;
    reviews:     null;
    director:      string;
}

export interface MovieContent {
    mediaId:     number;
    title:       string;
    releaseDate: number;
    gender:      string;
    imageUrl:    string;
    available:   boolean;
    stock:       number;
    rentals:     null;
    reviews:     null;
    director:    string;
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    unpaged:    boolean;
    paged:      boolean;
}

export interface Sort {
    empty:    boolean;
    sorted:   boolean;
    unsorted: boolean;
}
