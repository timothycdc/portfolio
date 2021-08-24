import '../css/liquid.css';
import { gsap } from 'gsap';
import TypeIt from "typeit";




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
        widthSegments: 80,
        heightSegments: 80, // we now have 20*20*6 = 2400 vertices !
        alwaysDraw: true,
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

        });

        document.body.addEventListener("touchmove", function(e) {
            handleMovement(e, plane);

        });




    }).onRender(function() {
        // update our time uniform value
        plane.uniforms.time.value++;

        // continually decrease mouse strength
        plane.uniforms.mouseStrength.value = Math.max(0, plane.uniforms.mouseStrength.value - 0.01);
        //gsap.to(plane.uniforms.mouseStrength, { repeat: -1, duration: 1, value: 0 })
        // resize in case
        plane.updatePosition();
        // innerWidth = window.innerWidth;
        // innerHeight = window.innerHeight;
        // // console.log(canvas.getBoundingClientRect());
        // // console.log(innerWidth, innerHeight);
        // plane.uniforms.resolution.value = [innerWidth, innerHeight];
        // //plane.uniforms.resolution.value = [canvas.getBoundingClientRect()];

    });



    // handle the mouse move event
    function handleMovement(e, plane) {

        // touch event
        if (e.targetTouches) {
            mousePosition.x = e.targetTouches[0].clientX;
            mousePosition.y = e.targetTouches[0].clientY;
        }
        // mouse event
        else {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        }

        // convert our mouse/touch position to coordinates relative to the vertices of the plane
        var mouseCoords = plane.mouseToPlaneCoords(mousePosition.x, mousePosition.y);
        // update our mouse position uniform

        gsap.to(plane.uniforms.mousePosition.value, { duration: 9.0, 0: mouseCoords.x, 1: mouseCoords.y })

        // reassign mouse strength
        // plane.uniforms.mouseStrength.value = 1;
        gsap.to(plane.uniforms.mouseStrength, { duration: 5, value: 1 })
    }



}





var webGLCurtain = new Curtains({
    container: "canvas"
});

createPlane(webGLCurtain);

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
    var myInterval = setInterval(function() {

        gsap.to('canvas', { duration: 1.2, opacity: 0 })


        setTimeout(function() {
            webGLCurtain.dispose();
            createPlane(webGLCurtain);
            gsap.to('canvas', { duration: 1, opacity: 1 })
        }, 1000)
    }, 100000);
}



var spanName = document.getElementById('surname');
spanName.addEventListener('mouseover', function() {
    spanName.classList.toggle('reveal-surname')
    spanName.innerHTML = '钟 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    spanName.style.paddingBottom = '40px';
})
spanName.addEventListener('mouseout', function() {
    spanName.classList.toggle('reveal-surname')
    spanName.innerHTML = 'Chung'
    spanName.style.paddingBottom = 'unset';

})




new TypeIt("#herotext", {
        speed: 100,
        loop: true,
    })
    .type("Frontend developer~ ", { delay: 300 })
    .pause(3600)
    .move(-12, { speed: 100, delay: 100 })
    .delete(8)
    .type('(Aspiring Full-Stack)', { delay: 300 })
    .move(12, { speed: 100, delay: 100 })
    .pause(3600)
    .delete()
    .type("Multi-instrumentalist~ ", { delay: 300 })
    .pause(3600)
    .delete()
    .type("Engineer~ ", { delay: 300 })
    .pause(3600)
    .delete()
    .type("Designer~ ", { delay: 300 })
    .pause(3600)
    .delete()
    .go();