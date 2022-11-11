// First include hammer.js to your page, https://github.com/hammerjs/hammer.js
const draggable = document.getElementById("draggable");
    let draggableRect=draggable.getBoundingClientRect();
    const droppable=document.getElementById('droppable');
    const droppableRect=droppable.getBoundingClientRect();
    
    const START_X = 0;
    const START_Y = 0;
    let ticking = false, out=true, dropped=false, transform, timer;

    const reqAnimationFrame = ( () => {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] ||  (callback=>{
            window.setTimeout(callback, 1000 / 60);
        });
    })();

    const mc = new Hammer.Manager(draggable);

    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Tap());

    const dragHandle=()=>{
        console.log(draggableRect.right,' ',droppableRect.left)
        if(draggableRect.right>droppableRect.left && draggableRect.bottom>droppableRect.top && draggableRect.left<droppableRect.right && draggableRect.top<droppableRect.bottom){
            out=false;
            droppable.style.boxShadow='inset 0 0 30px #00f';// just some live reaction to overlap
        } else {
            out=true;
            droppable.style.boxShadow='none';
        }

    }

    const dropHandle=()=>{
        
        if(!out){
            if(!dropped){
                /****************** YOUR SUCCESSFUL DROP FUNCTION HERE, LIKE ALIGNING CENTERS OF TWO ELEMENTS AND OTHER THINGS *************/
            }
            dropped=true;
        }
    }

    const updateElementTransform = () => {
        draggableRect=draggable.getBoundingClientRect();

        let value = ['translate(' + transform.translate.x + 'px, ' + transform.translate.y + 'px)'];
        value = value.join(" ");
        draggable.textContent = value;
        draggable.style.webkitTransform = value;
        draggable.style.mozTransform = value;
        draggable.style.transform = value;
        ticking = false;
    }

    const requestElementUpdate = () => {
        if(!ticking) {
            reqAnimationFrame(updateElementTransform);
            dragHandle()
            ticking = true;
        }
    }

    const resetElement = () => {
        draggable.className = 'animate';
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };

        requestElementUpdate();

    }

    const onPan=ev=>{
        if(!dropped){
            draggable.className = '';
            transform.translate = {
                x: START_X + ev.deltaX,
                y: START_Y + ev.deltaY
            };

            requestElementUpdate();
        }
    }

    const onSwipe=ev=>{
        if(out){
            transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
            transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;

            requestElementUpdate();
        }
    }

    const onTap=ev=>{
        if(out){
            transform.rx = 1;
            transform.angle = 25;

            clearTimeout(timer);
            timer = setTimeout(function () {
                resetElement();
            }, 200);
            requestElementUpdate();
        }
    }

    mc.on("panstart panmove", onPan);
    mc.on("swipe", onSwipe);
    mc.on("tap", onTap);

    mc.on("hammer.input", ev => {
        if(ev.isFinal ) {
            dropHandle();
            if(out){
                resetElement();
            }
            
        }
    });

    if(out){
        resetElement();
    }