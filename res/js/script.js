/*jshint esversion: 6*/

$(function() {
    //retrieve and display posts
    loadPosts()

    //retrieve and display user info
    loadUserInfo()
        .then(function(response) {
            let user = new User(
                response.firstname,
                response.lastname,
                response.email,
                response.avatar,
            );
        displayUserInfo(user);
    })
        .catch(function() {
            alert('Error displaying user info')
        });

    // on avatar click show user info
    $(".avatar").click(function() {
        let val = $(this).attr('id');
        if (val === 1) {
            $("ul").hide();
            $(this).attr('id','0');
        } else {
            $("ul").show();
            $(this).attr('id', '1');
        }
    });

});



function displayUserInfo(user) {
    $(".dropdown #name").text(user.firstname + " "+ user.lastname);
    $(".dropdown #email").text(user.email);
    $(".avatar").attr("src", user.avatar);
}

function loadUserInfo() {
    return $.get('https://private-anon-baef67fb15-wad20postit.apiary-mock.com/users/1')
        .catch(function () {
            alert('Error retrieving user info')
        });
}

function loadPosts() {
    $.get("https://private-anon-5f6b9424b5-wad20postit.apiary-mock.com/posts",
        function (response) {
            for (let post of response) {
                CreatePost(post);
            }
        }
    ).catch(function () {
        alert('Error retrieving posts')
    })
}

function CreatePost(content) {
    let image = $.trim(content["media"] === null) === "false";
    let text = $.trim(content["text"] === null) === "false";

    // post container
    let post = $('<div class="post">');

        // author info container
        let postAuthorContainer = $('<div class="post-author">').append(
            $('<span class="post-author-info">').append(
                $('<img src="" alt="">').attr({
                    src: content["author"].avatar
                }),
                $('<small>').text(
                    content["author"].firstname + " " +
                    content["author"].lastname
                )
            ),
            $('<small>').text(content["createTime"])
        );
        post.append(postAuthorContainer);

    // if media not null
    if (image) {

        // post media container
        let postMediaContainer = $('<div class="post-image">');

        // if media type: image
        if (content["media"].type === "image") {

            // create image element
            postMediaContainer.append(
                $('<img src="" alt="">').attr({
                    src: content["media"].url
                })
            );
        } 
        // if media type: video
        else {

            // create video element
            postMediaContainer.append(
                $('<video controls autoplay loop>').append(
                    $('<source>').attr({
                        src: content["media"].url
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
                content["text"]
            )
        );
        post.append(postTitleContainer);
    }
        
        // post buttons container
        let postActionContainer = $('<div class="post-actions">').append(
            $('<button type="button" name="like" class="like-button">').text(
                content["likes"]
            ).click(function() { // click event for like-button
                $(this).toggleClass("liked");
            })
        );
        post.append(postActionContainer);

    $('.main-container').prepend(post);
}