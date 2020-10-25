/*jshint esversion: 6*/

// identifies the html page by script id
let scriptId = $('script[src$="/script.js"]').attr('id')

$(function() {

    if (scriptId === 'index') {
        console.log('index')

        //retrieve and display posts
        loadPosts().then(function (response) {
            for (let post of response) {
                CreatePost(post);
            }
        }).catch(function () {
            alert('Error, failed to display posts')
        })

    } else if (scriptId === 'browse') {
        console.log('browse')

        //retrieve and display all profiles
        loadProfiles()
            .then(function (response) {
                for (let profile of response) {
                    displayProfile(profile)
                }
            }).catch(function () {
            alert('Error, failed to display profiles')
        })
    }

    //retrieve and display user info
    loadUserInfo()
        .then(function (response) {
            let user = new User(
                response.firstname,
                response.lastname,
                response.email,
                response.avatar,
            );
            displayUserInfo(user);
        })
        .catch(function () {
            alert('Error, failed to display user info')
        });

    // on avatar click show user info
    $(".avatar").click(function () {
        let val = $(this).attr('id');
        if (val === 1) {
            $("ul").hide();
            $(this).attr('id', '0');
        } else {
            $("ul").show();
            $(this).attr('id', '1');
        }
    });

});



function loadUserInfo() {
    return $.get('https://private-anon-baef67fb15-wad20postit.apiary-mock.com/users/1')
        .catch(function () {
            alert('Error, failed to retrieve user info')
        });
}

function displayUserInfo(user) {
    $(".dropdown #name").text(user.firstname + " "+ user.lastname);
    $(".dropdown #email").text(user.email);
    $(".avatar").attr("src", user.avatar);
}

function loadProfiles(profile) {
    return $.get('https://private-anon-88f85b3440-wad20postit.apiary-mock.com/profiles')
        .catch(function () {
            alert('Error, failed to retrieve profiles')
        });
}

function displayProfile(profile) {
    let profileContainer = $('<div class="profile">').append(
        $('<img src="" alt="">').attr('src', profile['avatar']),
        $('<h2>').text(profile['firstname'] + ' ' + profile['lastname']),
        $('<button class="follow-button">').text('Follow').click(function() {
            let button = $(this)
            if (button.text() === "Follow") {
                button.toggleClass("unfollow-button").text("Unfollow")
            } else {
                button.toggleClass("unfollow-button").text("Follow")
            }
        })



    )

    $('.browse-container').append(profileContainer)
}

function loadPosts() {
    return $.get("https://private-anon-5f6b9424b5-wad20postit.apiary-mock.com/posts")
        .catch(function () {
            alert('Error, failed to retrieve posts')
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