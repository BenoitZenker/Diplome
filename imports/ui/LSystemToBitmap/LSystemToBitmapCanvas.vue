<template>
	<div>
		<canvas id="canvasDisplay" ref="canvasDisplay" :width="canvasDimensions" :height="canvasDimensions" :style="canvasStyle"></canvas>
		<canvas id="canvasSave" ref="canvasSave" width="res" height="res" ></canvas>

	</div>
</template>

<script>

	import GLOBAL from '/imports/ui/GLOBAL.js';
 
	export default {

		data() {
    		return {
    			cvDisplay:Object,
    			cvSave:Object,
    			id:undefined,
    		}
    	},


		mounted:function(){
			//le canvas display
			this.cvDisplay = this.$refs.canvasDisplay;

			//le canvas save
			this.cvSave = this.$refs.canvasSave;
			this.cvSave.width = this.res;
			this.cvSave.height = this.res;	

			//lancement de l'animation
			this.updateCanvas();
		},

		destroyed() {
        	window.cancelAnimationFrame(this.id);
        	this.id = undefined;
    	},


		methods:{
			setupCanvas(){
			},
			

			updateCanvas(){

				let ctx = this.cvDisplay.getContext('2d');
				let ctxSave = this.cvSave.getContext('2d');

				//display
				ctx.clearRect(0, 0, this.canvasDimensions, this.canvasDimensions);
				ctx. fillStyle = '#ffffff7f';
			    ctx.fillRect(0, 0, this.canvasDimensions, this.canvasDimensions);
			    //save
				ctxSave. fillStyle = '#ffffffff';
			    ctxSave.fillRect(0, 0, this.res, this.res);


			    //les pixels
				let x = 0;
				let y = 0;
				let dir = 0;
				let nodes = [];

				for (var i = 0; i < this.turtle.length; i++) {
					let c = this.turtle.charAt(i);
					if (c == '+') 
						dir = (dir + 1)%4;
					else if (c == '-') {
						dir = (dir-1)%4;
						dir = dir<0?3:dir;
					}

					else if (c =='[') {
						nodes.push({x:x, y:y, dir:dir});
					}
					else if (c == ']') {
						let n = nodes.pop();
						x=n.x;
						y=n.y;
						dir=n.dir;	
					}

					else if (c == " ") {
						x = this.nextX(x, dir);
						y = this.nextY(y, dir);
					}	

					else {
						//dessin display
						ctx. fillStyle = '#000000';
            			ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
            			//dessin save
            			ctxSave. fillStyle = '#000000';
             			ctxSave.fillRect(x/this.pixelSize, y/this.pixelSize, 1, 1);
           			
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

		
	  	props: {
	  		text: String,
	  		rules: Array,
	  		nb: Number,
	  		baseDimension:Number,
	  		res:Number,
	  	},

	  	computed: {
	  		turtle:function(){
	  			//copie de l'expression
	  			let expr = (this.text).repeat(1);
	  			let nb = this.nb;


	  			for (let rule of this.rules.values()){
	  				let t = rule.target;
		  			let r = rule.rule;
					
					//on applique la règle seulement si elle existe
		  			if (t!= "" && r !="") {
		  				let re = new RegExp(t, "g");
						for (var i = 0; i < nb; i++) {
		    				expr = expr.replace(re, r);
		  				}
		    		}	
	  			}
	  			
	    		return expr;
	  		},

	  		canvasDimensions:function(){
	  			return this.baseDimension - GLOBAL.MARGIN*2;
	  		},

	  		pixelSize:function(){
	  			return this.canvasDimensions / this.res;
	  		},

	  		canvasStyle(){
		      return{
		        'margin': GLOBAL.MARGIN+'px',
      			}
    		},
	  	},
		

	}

	
	
</script>

