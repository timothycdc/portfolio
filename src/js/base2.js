import '../css/base.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(gsap, ScrollTrigger);

window.onbeforeunload = function() {
    window.scrollTo(0, 0);
}