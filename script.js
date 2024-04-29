function homepageAnimation(){
    gsap.set(".slidesm",{
        scale:5
    })
    /*we creating a timeline so that the  .videodiv and .slidesm are triggered together */
    var tl=gsap.timeline({
    
        scrollTrigger:{
            trigger:".home",
            start:"top top",
            end:"bottom bottom",
           scrub:3 
        },
    })
    
    //we are handling the css variable clip
    //scrolltrigger is used to clip the videodi as we scroll and stop the clipping at the part where the scrolling stops
    //for that to happen we also use .scrub
    //start tells when we want to start , so we want it to start when the top element is on top
    //end tells us, when the bottom of home is on the bottom of page
    //we are pinning home and it will not move until the scrolling isn't complete
    
    
    tl
    .to(".videodiv",{
        '--clip':"0%",
        ease:Power2,
        
    },'a')//for the .slides and .videodiv to scroll together we pass any common flag in them as in this case we have used 'a'
    .to(".slidesm",{
        scale:1,
        ease:Power2
    
    },'a')
    .to(".lft",{
        xPercent:-10,
        stagger: .03,
        ease:Power4
    
    },'b')
    .to(".rgt",{
        xPercent:10,
        stagger: .03,
        ease:Power4
    
    },'b')    
}


function realAnimation(){
    //for trigger we usually target the parent element
gsap.to(".slide",{
    scrollTrigger:{
        trigger:".real",
        start:"top top",
        end:"bottom bottom",
        scrub:1
    },
    xPercent: -200,
    ease:Power4
});
}

function teamAnimation(){
    //we want the circular element which contains the image to move along with the mouse pointer
//the image should come close to the mouse pointer when the mouse pointer is coming towards middle
//and should go away when the mouse pointer is going towards left
document.querySelectorAll(".listelem")
.forEach(function(e){
e.addEventListener("mousemove",function(dets){
gsap.to(this.querySelector(".picture"),{opacity:1, x:gsap.utils.mapRange(0,window.innerWidth,-200,200,dets.clientX), ease:Power4,duration:.5})


    })

e.addEventListener("mouseleave",function(){
        gsap.to(this.querySelector(".picture"),{opacity:0,ease:Power4,duration:.5})
    })
})
}

function paraAnimation(){
    var clutter="";
    //textcontent.split is used for spliting the paragraph into an array of all the single letters
    //now if the letter is a space then we add nbsp in the paragraph
    //when the para's top is 50% of the screen ,we start the animation
    document.querySelector(".textpara").textContent.split("").forEach(function(e){
    if(e ===" ")clutter+=`<span>&nbsp;</span>`
      clutter+=`<span >${e}</span>`
    })
    document.querySelector(".textpara").innerHTML=clutter;
    gsap.set(".textpara span",{opacity:.1})
    gsap.to(".textpara span",{
        scrollTrigger:{
            trigger:".para ",
            start: "top 60%",
            end:"bottom 90%",
            scrub:"1"
        },
        opacity:1,
        stagger:.03,
        ease: Power4
    })
} 

function loco(){
    (function () {
        const locomotiveScroll = new LocomotiveScroll();
    })();
}

function capsulesAnimation(){
    gsap.to(".capsule:nth-child(2)",{
        scrollTrigger:{
            trigger:".capsules",
            start:"top 70%",
            bottom:"bottom bottom",
            scrub:1
        },
        y:0,
        ease:Power4,
    })
}


function bodyColorChange(){
    //onEnter is for when we enter into a new section
document.querySelectorAll(".section").forEach(function(e){
    ScrollTrigger.create({
        trigger:e,
        start:"top 50%",
        end:"bottom 50%",
        onEnter:function(){
            document.body.setAttribute("class",e.dataset.color)
        },
        onEnterBack:function(){
            document.body.setAttribute("class",e.dataset.color)
        }
    
    })
})
}

bodyColorChange();
loco();
capsulesAnimation();
paraAnimation();
teamAnimation();
homepageAnimation();
realAnimation();