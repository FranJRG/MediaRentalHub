export interface Movie {
    media_id?:     number;
    title:       string;
    release_date: number;
    gender:      string;
    image_url:    string;
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
    media_id:     number;
    title:       string;
    release_date: number;
    gender:      string;
    image_url:    string;
    available:   boolean;
    stock:       number;
    rentals:     null;
    reviews:     null;
    director:      string;
}

export interface MovieContent {
    media_id:     number;
    title:       string;
    release_date: number;
    gender:      string;
    image_url:    string;
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
