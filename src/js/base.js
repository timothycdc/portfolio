import '../css/base.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(gsap, ScrollTrigger);
import Marquee3k from 'marquee3000';
import { DateTime } from "luxon";



import TypeIt from "typeit";




window.onbeforeunload = function() {
    window.scrollTo(0, 0);
}


init();
gsap.set('.follower', { xPercent: -50, yPercent: -50 })
gsap.set('.cursor', { xPercent: -50, yPercent: -50 })


function startTime() {
    let t = DateTime.local().setZone("Europe/London").toLocaleString(DateTime.TIME_24_WITH_SECONDS);
    let t2 = DateTime.local().setZone("Asia/Kuala_Lumpur").toLocaleString(DateTime.TIME_24_WITH_SECONDS);


    document.getElementById('lon').innerHTML = t;
    document.getElementById('mys').innerHTML = t2;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i }; // add zero in front of numbers < 10
    return i;
}





window.onload = function() {
    startTime();
    setTimeout(function() {

        document.body.style.overflow = 'auto';
        gsap.to('.loaderbadge', { duration: 0.5, opacity: 0, ease: 'power4' })


        // gsap.to('ul.transition li', { delay: 0.5, duration: 0.7, scaleY: 0, transformOrigin: "100% top", stagger: 0.05, ease: 'power2' })
        gsap.to('#loadwrapper', { delay: 0.5, duration: 0.7, top: (-2 * window.innerHeight), ease: 'power2' })
        Marquee3k.init()
        document.body.style.overflow = 'auto';
    }, 100)

}





function createPlane(webGLCurtain) {
    // set up our WebGL context and append the canvas to our wrapper


    // if there's any error during init, we're going to catch it here
    webGLCurtain.onError(function() {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");
    });
    var mousePosition = {
        x: 0,
        y: 0,
    };

    // get our plane element
    var planeElement = document.getElementsByClassName("plane")[0];

    // set our initial parameters (basic uniforms)
    var params = {
        vertexShaderID: "plane-vs", // our vertex shader ID
        fragmentShaderID: "plane-fs", // our framgent shader ID
        //crossOrigin: "", // codepen specific
        widthSegments: 10,
        heightSegments: 10, // we now have 20*20*6 = 2400 vertices !
        alwaysDraw: true,
        watchScroll: false,
        uniforms: {
            time: {
                name: "uTime", // uniform name that will be passed to our shaders
                type: "1f", // this means our uniform is a float
                value: 0,
            },
            mousePosition: { // our mouse position
                name: "uMousePosition",
                type: "2f", // notice this is a length 2 array of floats
                value: [mousePosition.x, mousePosition.y],
            },
            mouseStrength: { // the strength of the effect (we will attenuate it if the mouse stops moving)
                name: "uMouseStrength", // uniform name that will be passed to our shaders
                type: "1f", // this means our uniform is a float
                value: 0,
            },
            progress: {
                name: "uProgress",
                type: "1f",
                value: 0
            },
            resolution: {
                name: "uReso",
                type: "2f",
                value: [innerWidth, innerHeight]
            },


        }
    }

    // create our plane mesh
    var plane = webGLCurtain.addPlane(planeElement, params);

    // if our plane has been successfully created
    // we use the onRender method of our plane fired at each requestAnimationFrame call

    plane && plane.onReady(function() {
        // set a field of view of 35 to exagerate perspective
        // we could have done  it directly in the initial params
        plane.setPerspective(70);


        // listen our mouse/touch events on the whole document
        // we will pass the plane as second argument of our function
        // we could be handling multiple planes that way
        document.body.addEventListener("mousemove", function(e) {
            handleMovement(e, plane);
            gsap.to('.follower', { duration: 1, opacity: 0.8 })
            gsap.to('.cursor', { duration: 1, opacity: 1 })
            gsap.to('.cursor', { ease: 'power3', duration: 0.2, x: e.clientX, y: e.clientY });
            gsap.to('.follower', { ease: 'power3', duration: 0.7, x: e.clientX, y: e.clientY });

        });

        document.body.addEventListener("touchmove", function(e) {
            handleMovement(e, plane);


        });




    }).onRender(function() {
        // update our time uniform value
        plane.uniforms.time.value++;
        //console.log(plane.uniforms.time.value)

        // continually decrease mouse strength
        plane.uniforms.mouseStrength.value = Math.max(0, plane.uniforms.mouseStrength.value - 0.01);

        //gsap.to(plane.uniforms.mouseStrength, { repeat: -1, duration: 1, value: 0 })

        //plane.updatePosition();


    });



    // handle the mouse move event
    function handleMovement(e, plane) {

        // touch event
        if (e.targetTouches) {
            mousePosition.x = e.changedTouches[0].clientX;
            mousePosition.y = e.changedTouches[0].clientY;

        }
        // mouse event
        else {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        }

        // convert our mouse/touch position to coordinates relative to the vertices of the plane
        var mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
        // update our mouse position uniform

        gsap.to(plane.uniforms.mousePosition.value, { ease: 'back', duration: 15.0, 0: mouseCoords.x, 1: mouseCoords.y })

        // reassign mouse strength
        // plane.uniforms.mouseStrength.value = 1;
        gsap.to(plane.uniforms.mouseStrength, { ease: 'ease', duration: 6, value: 1 })
    }



}


function init() {


    var webGLCurtain = new Curtains({
        container: "canvas"

    });

    gsap.to('canvas', { duration: 3, opacity: 1, ease: 'power4' })

    createPlane(webGLCurtain);


    // var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // if (isSafari) {
    //     var myInterval = setInterval(function() {

    //         //gsap.to('canvas', { duration: 0.7, opacity: 0, ease: 'power4' })


    //         // setTimeout(function() {
    //         //     webGLCurtain.dispose();
    //         //     createPlane(webGLCurtain);
    //         //     gsap.to('canvas', { duration: 2, opacity: 1, ease: 'power4' })
    //         // }, 700)
    //     }, 5000);
    // }







    // new TypeIt("#herotext", {
    //         speed: 100,
    //         loop: true,
    //     })
    //     .type("Frontend developer~ ", { delay: 300 })
    //     .pause(3600)
    //     .move(-12, { speed: 100, delay: 100 })
    //     .delete(8)
    //     .type('(Aspiring Full-Stack)', { delay: 300 })
    //     .move(12, { speed: 100, delay: 100 })
    //     .pause(3600)
    //     .delete()
    //     .type("Multi-instrumentalist~ ", { delay: 300 })
    //     .pause(3600)
    //     .delete()
    //     .type("Engineer~ ", { delay: 300 })
    //     .pause(3600)
    //     .delete()
    //     .type("Designer~ ", { delay: 300 })
    //     .pause(3600)
    //     .delete()
    //     .go();

}



var menuTitle = new TypeIt("#typerline", {
        speed: 60,
        loop: true,
    })
    .type("frontend dev~ ", { delay: 0 })
    .pause(200)
    .move(-6, { speed: 60, delay: 2000 })
    .delete(8)
    .type('(aspiring fullstack)', { delay: 0 })
    .move(5, { speed: 60, delay: 0 })
    .pause(2000)
    .delete()
    .type("musician~ ", { delay: 0 })
    .pause(2000)
    .delete()
    .type("engineer~ ", { delay: 0 })
    .pause(2000)
    .delete()
    .type("designer~ ", { delay: 0 })
    .pause(2000)
    .delete()
    .type("photographer~ ", { delay: 0 })
    .pause(2000)
    .delete()
    .type("data sci~ ", { delay: 0 })
    .pause(2000)
    .delete()
    .type("machine learning~ ", { delay: 0 })
    .pause(2000)
    .delete()
    .go();