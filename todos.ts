// fixing update-password bug, setup library module
// !DB:

//TODO [MY WEEK - URGINT]
// test image uploading in update req.
// start with library creation, uploading files -> creating new row -> returning the new row.
// test the default value for library.type
// add maximum value for library.description and all other col with db.text
// recapping whole user stories (signup, signin, update user's data, update password).
// test signup.
//  - test normal case.
//  - duplicated username, email.
//  - not existing tag.

// TODO [NOT]
// create a baseResponse<T> => {status,message,data}, PaginatedResponse<T>=> {status,message, stat, meta}, and don't use intercetor
// make the findall and findone (in post moduel) reachable to guest users and handle it in the service level.
// refactor post.controller, use paginationbuiler from utils inteaded of the one in the class,
// add type called paginationOptions that repersent this: { skip: number; take: number } to use it in controller and services
// testing
// go through each service and make sure it's self dependant, don't make user.service run a query on tag model [X], ex: in user.service: this.prisma.tag.findOne().
// create a corn job for deleting replies that their parent not exists.
// add the likesNum and reactionsNum to post, comment, and reply, and update them in each like or reaction.instead of querying each time about it and joining it. (use transaction)
// use logger in each catch block
// add logger to all the app.
// add the path to all uploaded(files, images) and store, return it to the client so in deltion the client can delete it.
// add this: orderBy: { createdAt: 'desc' } in getting the get post reactions ,
// ci/cd: -change the event in main.yml to PR, and do the most work and push to developement, and when need to push to server create PR.
// user can delete his account

//? TESTING:
// create 4 levels of replies
// read them
// delete the leaf one (at 4 level)
// and try to parent one, (level 1)
//    it's should delete it and it's fiest level child (level 2)
//    it's suppose to delete the 3rd level also, and we need to work on it.
// try to find a & delete an existing reply that it's parent not exists

// TODO [FREE TIME...]
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
// - convert tags into arabic
// - make the psot hashtags by auto-complete, and make him able to create post on other colleges

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
//? WHY am I returning the poll statistics when getting the poll post (before user voting) ?
// 1- I don't want to make a new route for getting the poll statistics, because it's not a sensitive data.
