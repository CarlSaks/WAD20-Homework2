/*jshint esversion: 6*/

$(function() {
    loadUserInfo()
        .then(function(response) {
            let user = new User(
                response.firstname,
                response.lastname,
                respone.email,
                respone.avatar,
            );
        displayUserInfo(user);
    })
        .catch(function() {
            alert('Error loading user info')
        });
});

function displayUserInfo(user) {
    $("#dropdown #name").text(user.firstname + " "+ user.lastname);
    $("#dropdown #email").text(user.email);
    $("#avatar").image(user.avatar);
}

function loadUserInfo() {
    return $.get(
        {
            url: 'https://private-anon-baef67fb15-wad20postit.apiary-mock.com/users/1',
            success: function (response) {
                return response;
            },
            error: function() {
                alert('error')
            }
        }
    );
}

$(document).ready(function() {
    // on avatar click
    $(".avatar").click(function() {
        var val = $(this).attr('id');
        if (val == 1) {
            $("ul").hide();
            $(this).attr('id','0');
        } else {
            $("ul").show();
            $(this).attr('id', '1');
        }
    });
});


let posts = [];

$(function () {
    loadPosts();


});

function loadPosts() {
    $.get("https://private-anon-5f6b9424b5-wad20postit.apiary-mock.com/posts",
        function (response) {
            for (let post of response) {
                CreatePost(post);
                posts.push(post);
            }
        }
    );
}

function CreatePost(content) {
    let image = $.trim(content.media === null) === "false";
    let text = $.trim(content.text === null) === "false";

    // post container
    let post = $('<div class="post">');

        // author info container
        let postAuthorContainer = $('<div class="post-author">').append(
            $('<span class="post-author-info">').append(
                $('<img>').attr({
                    src: content.author.avatar
                }),
                $('<small>').text(
                    content.author.firstname + " " +
                    content.author.lastname
                )
            ),
            content.createTime
        );
        post.append(postAuthorContainer);

    // if media not null
    if (image) {

        // post media container
        let postMediaContainer = $('<div class="post-image">');

        // if media type: image
        if (content.media.type === "image") { 

            // create image element
            postMediaContainer.append(
                $('<img>').attr({
                    src: content.media.url
                })
            );
        } 
        // if media type: video
        else {

            // create video element
            postMediaContainer.append(
                $('<video controls autoplay loop>').append(
                    $('<source>').attr({
                        src: content.media.url
                    }),
                    "Your browser does not support the video tag."
                )
            );
        }
        post.append(postMediaContainer);
    }

    // if text not null
    if (text) {

        // post title container
        let postTitleContainer = $('<div class="post-title">').append(
            $('<h3>').text(
                content.text
            )
        );
        post.append(postTitleContainer);
    }
        
        // post buttons container
        let postActionContainer = $('<div class="post-actions">').append(
            $('<button type="button" name="like" class="like-button">').text(
                content.likes
            ).click(function() { // click event for like-button
                $(this).toggleClass("liked");
            })
        );
        post.append(postActionContainer);

    $('.main-container').prepend(post);
}