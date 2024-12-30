// !DB:


//? COMMITE message:

//? TESTING:
// create 4 levels of replies
// read them
// delete the leaf one (at 4 level)
// and try to parent one, (level 1)
//    it's should delete it and it's fiest level child (level 2)
//    it's suppose to delete the 3rd level also, and we need to work on it.
// try to find a & delete an existing reply that it's parent not exists

//? Today's Plan:
// add type to serialize reply input
// testing

//TODO [MY WEEK - URGINT]
// add to "ask asem": about what to do with liking comment's and replies.
// create a baseResponse<T> => {status,message,data}, PaginatedResponse<T>=> {status,message, stat, meta}, and don't use intercetor

// user can like his comment and other user's comments.
// implement reply liks
// create many comment in one request

//  poll post type
//  use transactions and promises.all() => in required cases.
//  make the findall and findone (in post moduel) reachable to guest users and handle it in the service level.
//  refactor post.controller, use paginationbuiler from utils inteaded of the one in the class,
//  add type called paginationOptions that repersent this: { skip: number; take: number } to use it in controller and services

// TODO [NOT]
// use logger in each catch block
// refreash token (yt bookmarks)
// add logger to all the app.
// add the path to all uplodad(files, images) and store, return it to the client so in deltion the client can delete it.
// add this: orderBy: { createdAt: 'desc' } in getting the get post reactions ,
// ci/cd: -change the event in main.yml to PR, and do the most work and push to developement, and when need to push to server create PR.
// user can delete his account

// TODO [FEE TIME...]
// - docker.
// - aws account.

//! Before ending:
// - using copilot add /doc for all files.
// - add rate limiting and cors
// - load testin

//! Next Sprint.
// - user profile.
// - report post.
// - block user.
// - hide post.
// - unblock user.
// - forword user to the post creator profile, when click on the creator image.

//! akaram meeting:
// - storage using nestjs (popbably use Wasabi)
// - how to get high availability and multi teair architecture in monolothic app
// - oha memory bench tester.

// !Docker:
// academex-academex_api:latest
// docker tag local-image:tagname new-repo:tagname
// docker push new-repo:tagname
// docker push khaleda02/academex:latest

// !NOTES:
//? WHY I TRANSFARED FROM INTERCEPTORS INTO TYPES IN RESPONSE STANDARDIZATIONS?
// 1- when I want to return a custom res (without standard, no status or data), we should edit the interceptor and add a if statement to check of the req name
// 2- generic types more flixable and easy to maintaine, I have full options of what should I return in each route.

