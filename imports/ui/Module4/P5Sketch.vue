<template>
	<div>
		<vue-p5  v-on="{ setup, draw, mouseclicked}"></vue-p5>
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


	import VueP5 from 'vue-p5';
	 
	export default {

		data(){
			return{
				pixSize:Number,
				currentColor:HSLColor,
			}
		},

		props: {
	  		imgDim:Number,
	  		width:Number,
	  		height:Number,
	  		pixels:Array,
	  	},

	  	mounted:function(){
	  	},

		methods: {

			handleResize() {
	    		this.sketch.resizeCanvas(this.width, this.height);
	    		this.pixSize = this.width/this.imgDim;
	    	},

		    setup(sketch) {
		    	this.sketch = sketch;
		      	sketch.resizeCanvas(this.width, this.height);
		      	window.addEventListener('resize', this.handleResize);
		      	this.pixSize = this.width/this.imgDim;


		      	this.currentColor = new HSLColor(0,50,100);


	    	},


	    	draw(sketch) {		
				this.sketch.clear();
				sketch.rectMode(sketch.CORNER);
		      	this.sketch.background('rgba(255,255,255, 0.5)');

		      	this.drawImage(sketch);
		      	//this.drawCursor(sketch);    	
	    	},



	    	drawImage(sketch){

	    		this.sketch.fill(10,10,10,20)
		      	this.sketch.rect(0,0, this.width, this.width);

	    		sketch.noStroke();
	    		sketch.rectMode(sketch.CORNER);

				for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++) {
		      			let c = this.pixels[y][x];
		      			if (c) {
		      				//console.log(c)
		      				//sketch.fill(sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'))
		      				sketch.fill(sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'))
		      				sketch.rect(x*this.pixSize, y*this.pixSize, this.pixSize, this.pixSize);
		      			}
		      		}
		     	}
	    	},

	    	drawCursor(sketch){
	    		let c = this.currentColor;
	    		sketch.ellipseMode(sketch.CENTER);
	    		sketch.fill(sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'));
	    		sketch.rectMode(sketch.CENTER);
	    		sketch.rect(sketch.mouseX, sketch.mouseY, this.pixSize, this.pixSize)
	    	},


	    	/*
	    	mouseclicked(sketch,e) {
	    		//check si on a bien cliqué sur le canvas et pas sur une div au-dessus du canvas
	    		if (e.target.className === 'p5Canvas') {

		      		
		      		//si on clique sur l'image
	    			let x= Math.floor(sketch.mouseX/this.pixSize);
	    			let y= Math.floor(sketch.mouseY/this.pixSize);
	    			let c = this.currentColor

		    		if (x >=0 && x<this.imgDim && y >=0 && y<this.imgDim) {

		    			//si on est en mode prélèvement
		    			if (sketch.keyIsDown(32) || sketch.keyIsDown(17) || sketch.keyIsDown(16)) {
		    				if(this.pixels[y][x])
		    					this.currentColor = this.pixels[y][x];
		    				else
		    					this.currentColor = new HSLColor(0,50,100);
		    			}
		    			//sinon on change de couleur
		    			else {
		    				//si c'est blanc
		    				if (c.l == 100)
		    					this.$emit('remove-pixel',x ,y);	
		    				else
		    				//sinon on change la couleur
		    					this.$emit('change-pixel',x ,y, new HSLColor(c.h, c.s, c.l));
		    			}
		    		}
	    		}	
	    	},
	    	*/

	    	mouseclicked(sketch,e) {

	    		//check si on a bien cliqué sur le canvas et pas sur une div au-dessus du canvas
	    		if (e.target.className === 'p5Canvas') {
	    			this.$emit('shuffle-pixels');
	    			console.log("emit shuffle")
	    		}
	    		
	    	},


	    	clearAllPixels(){
	    		for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++)
		      			this.pixels[y][x] = false;  		
		     	}
	    	},

	    	loadPixels(pixels){
	    		//on fait une copie
	    		for (var i = 0; i < pixels.length; i++)
    				this.pixels[i] = pixels[i].slice();
	    	},
	  	},


	  	components: {
		    "vue-p5": VueP5
		},

	}

	
	
</script>

