<template>
	<div>
		<canvas id="Canvas" ref="Canvas" :width="width" :height="height"></canvas>
	</div>
</template>

<script>

	class HSLColor {
	    constructor(h,s,l) {
	      this.h = h;
	      this.s = s;
	      this.l = l;
	    }
	}

	import GLOBAL from '/imports/ui/GLOBAL.js';
 
	export default {

		data() {
    		return {
    			cv:Object,
    			id:undefined,
    			pixels:Array,
    		}
    	},

    	props: {
	  		text: String,
	  		width:Number,
	  		height:Number,
	  		res:Number,
	  	},



		mounted:function(){
			//le canvas display
			this.cv = this.$refs.Canvas;

			//lancement de l'animation
			this.updateCanvas();

		    this.pixels = new Array(this.res);
		    for (let i = 0; i<this.res;i++)
		      this.pixels[i] = new Array(this.res);
		},


		destroyed() {
        	window.cancelAnimationFrame(this.id);
        	this.id = undefined;
    	},


		methods:{

			updateCanvas(){

				this.pixels = new Array(this.res);
			    for (let i = 0; i<this.res;i++)
			      this.pixels[i] = new Array(this.res);

				let ctx = this.cv.getContext('2d');

				//display
				ctx.clearRect(0, 0, this.canvasDimensions, this.canvasDimensions);
				ctx. fillStyle = '#F0F0F0';
			    ctx.fillRect(0, 0, this.canvasDimensions, this.canvasDimensions);


			    //les pixels
				let x = this.canvasDimensions/2;
				let y = this.canvasDimensions/2;
				let dir = 0;
				let nodes = [];

				let light = 50;

				for (var i = 0; i < this.text.length; i++) {
					let c = this.text.charAt(i);

					//un espace = pas de caractère
					if (c == " ") {
						x = this.nextX(x, dir);
						y = this.nextY(y, dir);
					}	

					else if (c =="<")
						light = Math.min(light + 10, 80);
					else if (c == ">")
						light = Math.max(light-10, 0);

					else {
	
						let alpha = 0.6;

						//changement de direction
						if (c == 'a' || c=='e' || c=='i' || c=='o' || c=='u' ||c=='y'
							|| c == 'A' || c=='E' || c=='I' || c=='O' || c=='U' ||c=='Y' )
							dir = (dir + 1)%4;

						else if (c == '.' || c==',' || c==';' || c==':' || c=='!' || c=='?') {
							dir = (dir-1)%4;
							dir = dir<0?3:dir;
							alpha = 1;
							
							light = light>=80 ? 50 : light+20;
						}

						//dessin du pixel
						let code = Math.floor(358 * (c.charCodeAt(0) - 30) / (127 - 30));
						ctx. fillStyle = 'hsla('+code+',100%,'+light+'%, '+alpha+')';
	        			ctx.fillRect(x, y, this.pixelSize, this.pixelSize);

	        			//sauvegarde dans le tableau
	        			this.pixels[y/this.pixelSize][x/this.pixelSize] = new HSLColor(code, 100, light)
	       			
						x = this.nextX(x, dir);
						y = this.nextY(y, dir);
					}


					//boucle si on dépasse du cadre
					if (x >= this.canvasDimensions)
						x = 0;
					else if (x<0)
						x = this.canvasDimensions-this.pixelSize;
					if (y >= this.canvasDimensions)
						y = 0;
					else if (y <0)
						y = this.canvasDimensions-this.pixelSize;
				}


				//animation
				this.id = window.requestAnimationFrame(
            		this.updateCanvas
        		);
			},


			nextY(y, dir) {
	    		if (dir%2 == 0) 
					y += (dir == 0)?this.pixelSize:-this.pixelSize;
				return y;
	    	},

	    	nextX(x, dir) {
	    		if (dir%2 != 0) 
					x+= (dir ==1)?this.pixelSize:-this.pixelSize;	
				return x;
	    	},
		},

	  	
	  	computed: {
	  		
	  		canvasDimensions:function(){
	  			return this.width;
	  		},

	  		pixelSize:function(){
	  			return this.canvasDimensions / this.res;
	  		},
	  	},
	}
	
</script>

