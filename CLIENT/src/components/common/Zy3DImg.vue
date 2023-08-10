<template>
  <section class="box">
    <div class="wrap">
      <!-- <div class="card-shadow"></div>-->
      <div class="card"  @mouseleave="(e)=>handleMouseLeave(e)">
        <div class="card-front">
          <div class="card-title">3D perspective title</div>
          <div class="card-subtitle">3D perspective subtitle</div>
          <div class="card-shine"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Zy3DImg",
  methods: {
   handleMouseLeave:(e, index) => {
      document.removeEventListener('mousemove', rotateToMouse);
      let card =  document.querySelector('.card');
      card.style.transform = '';
      const glowElement = card.querySelector('.card-shine');
      glowElement.style.backgroundImage = '';
    }
  },
  mounted() {
    var card = document.querySelector('.card');
    var cardTitle = document.querySelector('.card-title');
    var cardSubtitle = document.querySelector('.card-subtitle');
    var cardShine = document.querySelector('.card-shine');
    // var cardShadow = document.querySelector('.card-shadow');
    var currentMousePos = {x: 0, y: 0};
    var mouseFromCenter = {x: 0, y: 0};

    card.addEventListener('mousemove', function (event) {
      var wHeight = window.innerHeight;
      var wWidth = window.innerWidth;

      currentMousePos.x = event.pageX;
      currentMousePos.y = event.pageY;
      mouseFromCenter.x = currentMousePos.x - (wWidth / 2);
      mouseFromCenter.y = currentMousePos.y - (wHeight / 2);

      var around1 = -1 * (currentMousePos.y * 100 / wHeight * 0.2 - 10) + 'deg';
      var around2 = 1 * (currentMousePos.x * 100 / wWidth * 0.2 - 10) + 'deg';
      var trans1 = (currentMousePos.x * 100 / wHeight * 0.3) + 'px';
      var trans2 = (currentMousePos.y * 100 / wHeight * 0.3) + 'px';
      var dy = event.pageY - wHeight / 2;
      var dx = event.pageX - wWidth / 2;
      var theta = Math.atan2(dy, dx);
      var angle = theta * 180 / Math.PI - 90;
      var mousePositionX = (currentMousePos.x / wWidth) * 100;
      var mousePositionY = 50 + (currentMousePos.y / wHeight) * 10;

      // gradient angle and opacity for card shine effect
      // cardShine.style.background = 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + (currentMousePos.y / wHeight) * .7 + ') 0%,rgba(255,255,255, 0) 80%)';

      // card pos and angle
      card.style.webkitTransform = "translate3d(" + trans1 + ", " + trans2 + ", 0) scale(1) rotatex(" + around1 + ") rotatey(" + around2 + ")";
      card.style.backgroundPosition = mousePositionX + '%' + ' ' + (currentMousePos.y / wHeight) * 50 + '%';

      // card shadow pos and angle
      // cardShadow.style.transform = "scale(.9,.9) translateX(" + ((mouseFromCenter.x * -0.02) + 12) + "px) translateY(" + ((mouseFromCenter.y * -0.02) + 12) + "px) scale(1.0) rotateY(" + (mouseFromCenter.x / 25) * 0.5 + "deg) rotateX(" + ((mouseFromCenter.y / -25)) + "deg)";

      cardTitle.style.transform = "translateX(" + ((mouseFromCenter.x / 25) * 0.7) + "px) translateY(" + ((mouseFromCenter.y / 25) * 1.65) + "px)";

      cardSubtitle.style.transform = "translateX(" + ((mouseFromCenter.x / 25) * 0.5) + "px) translateY(" + ((mouseFromCenter.y / 25) * 1.15) + "px) translateZ(60px)";
    });

  }
}
</script>

<style lang="scss" scoped>
$clip: -0px;

.box {
  //background: -webkit-linear-gradient(top, #ddd 0%, #f0f0f0 40%);
  //background: linear-gradient(to bottom, #ddd 0%, #f0f0f0 40%);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: perspective(800px);
  transform: perspective(800px);
}

.wrap {
  //position: absolute;
  perspective: 1600px;
  height: 100vh;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
  box-sizing: border-box;
  .card-shadow, .card {
    margin: 0 auto;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    z-index: 1;
    position: absolute;
    border-radius: 10px;
    top: $clip;
    bottom: $clip;
    left: $clip;
    right: $clip;
  }

  .card {
    //background: #fff url('https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?fit=crop&fm=jpg&h=950&q=80&w=1925') 50% 50%;
    background: #fff url('https://images.unsplash.com/photo-1685209170962-eae093d26379?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') 50% 50%;
    //background: #fff url('https://source.unsplash.com/2070x1440') 50% 50%;
    background-size: cover;

  }

  .card-shine {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    z-index: 1;
    border-radius: 10px;
    background: -webkit-linear-gradient(315deg, rgba(245, 245, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%);
    z-index: -1;
  }

  .card-shadow {
    top: 10px;
    transform-style: preserve-3d;
    transform: translateZ(40px);
    z-index: -1;
    background: #B3B3B3;
    transform: scale(.5, .5);
    box-shadow: 0 0 30px 10px #aaa;
  }

  .card-front, .card-title, .card-subtitle {
    position: absolute;
    color: #FFF;
    transform-style: preserve-3d;
  }

  .card-front {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: rgba(0, 0, 0, .1);
  }

  .card-title {
    font-weight: 700;
    text-align: left;
    left: 30px;
    bottom: 140px;
    font-size: 35px;
    line-height: 30px;
    //text-shadow: 0 5px 8px rgba(0,0,0,.65);
    transform: translateZ(0px);
    overflow: hidden;
    margin: 0;
    width: 80%;
  }

  .card-subtitle {
    font-weight: normal;
    text-align: left;
    left: 30px;
    width: 80%;
    bottom: 80px;
    font-size: 25px;
    line-height: 20px;
    text-shadow: 0 3px 6px rgba(0, 0, 0, .8);
    transform: translateZ(0px);
  }
}


</style>
