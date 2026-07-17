export interface ReviewMember {

    id: string;

    fullname: string;

    email: string

    profileImage: string;

}

export interface Review {

    id: string;

    rating: number;

    comment: string;

    member: ReviewMember;

    createdAt: string;

    updatedAt: string;

    trainer: ReviewMember

}

export interface TrainerReviewsData {

    averageRating: number;

    totalReviews: number;

    reviews: Review[];

}

export interface TrainerReviewsResponse {

    message: string;

    data: TrainerReviewsData;

}

export interface ReviewsResponse{
    success:boolean;
    message:string;
    data:Review[];
}